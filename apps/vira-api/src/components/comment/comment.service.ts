/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, PipelineStage } from 'mongoose';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';
import { Member } from '../../libs/dto/member/member';

import { MemberService } from '../member/member.service';
import { ProductService } from '../product/product.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel('Comment') private readonly commentModel: Model<Comment>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private readonly memberService: MemberService,
		private readonly productService: ProductService,
		private readonly boardArticleService: BoardArticleService,
		private readonly notificationService: NotificationService,
	) {}

	public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
		input.memberId = memberId;

		let result: Comment | null = null;
		try {
			result = await this.commentModel.create(input);
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}

		// 🔢 Statistika yangilash
		switch (input.commentGroup) {
			case CommentGroup.PRODUCT:
				await this.productService.productStatsEditor({
					_id: input.commentRefId,
					targetKey: 'productComments',
					modifier: 1,
				});
				break;
			case CommentGroup.ARTICLE:
				await this.boardArticleService.boardArticleStatsEditor({
					_id: input.commentRefId,
					targetKey: 'articleComments',
					modifier: 1,
				});
				break;
			case CommentGroup.MEMBER:
				await this.memberService.memberStatsEditor({
					_id: input.commentRefId,
					targetKey: 'memberComments',
					modifier: 1,
				});
				break;
		}

		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);

		// 🔔 COMMENT NOTIFICATION
		try {
			let receiverId: string | null = null;
			let notificationGroup: NotificationGroup | null = null;

			const refId = input.commentRefId as unknown as ObjectId;
			const refIdStr = (refId as any).toString();
			const authorIdStr = memberId.toString();

			if (input.commentGroup === CommentGroup.PRODUCT) {
				// 🛒 Product egasiga
				const product = await (this.productService as any).getProduct(null, refId);
				if (product?.memberId) {
					receiverId = (product.memberId as any).toString();
					notificationGroup = NotificationGroup.PRODUCT;
				}
			} else if (input.commentGroup === CommentGroup.ARTICLE) {
				// 📝 Article egasiga – sizdagi mavjud metodga qarab
				let article: any = null;

				if (typeof (this.boardArticleService as any).getBoardArticle === 'function') {
					// agar sizda shunaqa signatura bo‘lsa: getBoardArticle(memberId, articleId)
					article = await (this.boardArticleService as any).getBoardArticle(null, refId);
				} else if (typeof (this.boardArticleService as any).getBoardArticleById === 'function') {
					article = await (this.boardArticleService as any).getBoardArticleById(refId);
				}

				if (article?.memberId) {
					receiverId = article.memberId.toString();
					notificationGroup = NotificationGroup.ARTICLE;
				}
			} else if (input.commentGroup === CommentGroup.MEMBER) {
				// 👤 Profilga yozilgan comment
				receiverId = refIdStr;
				notificationGroup = NotificationGroup.MEMBER;
			}

			// O'ziga-o'zi comment qilsa – notification yubormaymiz
			if (receiverId && receiverId !== authorIdStr && notificationGroup) {
				await this.notificationService.createNotification({
					notificationType: NotificationType.COMMENT,
					notificationGroup,
					notificationTitle: 'New comment received',
					notificationDesc:
						// bu yerda backenddagi field nomiga moslab o‘zgartiring
						(result as any).commentContent ?? (result as any).commentDesc ?? 'Someone commented on your post.',
					authorId: authorIdStr,
					receiverId,
					productId: notificationGroup === NotificationGroup.PRODUCT ? refIdStr : undefined,
					articleId: notificationGroup === NotificationGroup.ARTICLE ? refIdStr : undefined,
				});
			}
		} catch (err) {
			console.log('Notification error on createComment:', err?.message ?? err);
		}

		return result;
	}

	public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
		const { _id } = input;
		const result = await this.commentModel
			.findOneAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					commentStatus: CommentStatus.ACTIVE,
				},
				input,
				{
					new: true,
				},
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
		const { commentRefId } = input.search;
		const match: T = { commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result: Comments[] = await this.commentModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// memberData
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
		const result = await this.commentModel.findByIdAndDelete(input).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}

	async getCommentsSummary(): Promise<{
		total: number;
		recentCommenters: { id: string; avatarUrl?: string }[];
	}> {
		const total = await this.commentModel.countDocuments({ commentStatus: CommentStatus.ACTIVE });

		const pipeline: PipelineStage[] = [
			{ $match: { commentStatus: CommentStatus.ACTIVE } },
			{ $sort: { createdAt: -1 } },
			{
				$group: {
					_id: '$memberId',
					lastCommentAt: { $first: '$createdAt' },
				},
			},
			// members bilan join
			{
				$lookup: {
					from: 'members',
					localField: '_id',
					foreignField: '_id',
					as: 'member',
				},
			},
			{
				$unwind: {
					path: '$member',
					preserveNullAndEmptyArrays: false,
				},
			},
			{ $sort: { lastCommentAt: -1 } },
			{ $limit: 3 },
			{
				$project: {
					_id: 0,
					id: { $toString: '$_id' },
					avatarUrl: {
						$cond: [{ $eq: ['$member.memberImage', ''] }, 'uploads/member/default-avatar.jpg', '$member.memberImage'],
					},
				},
			},
		];

		const recentCommenters = await this.commentModel.aggregate<{
			id: string;
			avatarUrl?: string;
		}>(pipeline);

		return { total, recentCommenters };
	}
}
