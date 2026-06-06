import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NoticesInquiry, CreateNoticeInput } from '../../libs/dto/notice/notice.input';
import { NoticeStatus } from '../../libs/enums/notice.enum';
import { Notice } from '../../libs/dto/notice/notice';
import { UpdateNoticeInput } from '../../libs/dto/notice/notice.update';

type ObjectId = Types.ObjectId;
type T = Record<string, any>;

@Injectable()
export class NoticeService {
	constructor(
		@InjectModel('Notice')
		private readonly noticeModel: Model<any>,
	) {}

	public async getNotices(input: NoticesInquiry): Promise<{ list: Notice[]; total: number }> {
		const page = input.page ?? 1;
		const limit = input.limit ?? 10;

		const match: Record<string, any> = {
			noticeStatus: NoticeStatus.ACTIVE,
		};

		if (input.noticeCategory) {
			match.noticeCategory = input.noticeCategory;
		}

		const list = await this.noticeModel
			.find(match)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean();

		const total = await this.noticeModel.countDocuments(match);

		// === GraphQL DTO ga mos formatga o'tkazish ===
		const shapedList = list.map((doc) => ({
			_id: doc._id.toString(),
			noticeCategory: doc.noticeCategory,
			noticeStatus: doc.noticeStatus,
			noticeTitle: doc.noticeTitle,
			noticeContent: doc.noticeContent,
			memberId: doc.memberId?.toString(),
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		}));

		return { list: shapedList, total };
	}

	async getAdminNotices(input: NoticesInquiry) {
		const page = input.page ?? 1;
		const limit = input.limit ?? 10;

		const match: T = {};

		if (input.noticeStatus) {
			match.noticeStatus = input.noticeStatus;
		}
		if (input.noticeCategory) {
			match.noticeCategory = input.noticeCategory;
		}
		if (input.searchText) {
			const regex = new RegExp(input.searchText, 'i');
			match.$or = [{ noticeTitle: regex }, { noticeContent: regex }];
		}

		const [list, total] = await Promise.all([
			this.noticeModel
				.find(match)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit),
			this.noticeModel.countDocuments(match),
		]);

		return { list, total };
	}

	async createNotice(adminId: ObjectId, input: CreateNoticeInput) {
		const doc = await this.noticeModel.create({
			noticeCategory: input.noticeCategory,
			noticeTitle: input.noticeTitle,
			noticeContent: input.noticeContent,
			noticeStatus: NoticeStatus.ACTIVE,
			memberId: adminId,
		});

		return doc;
	}

	async updateNotice(adminId: ObjectId, input: UpdateNoticeInput) {
		const { noticeId, ...updateData } = input;

		const notice = await this.noticeModel.findById(noticeId);
		if (!notice) throw new NotFoundException('Notice not found');

		Object.assign(notice, updateData);
		notice.updatedAt = new Date();

		await notice.save();
		return notice;
	}

	async deleteNotice(noticeId: string) {
		const notice = await this.noticeModel.findById(noticeId);
		if (!notice) throw new NotFoundException('Notice not found');

		await this.noticeModel.deleteOne({ _id: noticeId });
		return true;
	}
}
