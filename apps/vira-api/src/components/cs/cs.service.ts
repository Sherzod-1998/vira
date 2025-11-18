// apps/vira-api/src/components/cs/cs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import {
	AdminCsInquiryInquiry,
	AnswerCsInquiryInput,
	CreateCsInquiryInput,
	MyCsInquiryInquiry,
} from '../../libs/dto/cs/cs-inquiry.input';
import { CsStatus } from '../../libs/enums/notice.enum';

type T = Record<string, any>;

@Injectable()
export class CsService {
	constructor(
		@InjectModel('CsInquiry')
		private readonly csInquiryModel: Model<any>,
	) {}

	/**
	 * USER: yangi CS savol yaratish
	 */
	public async createCsInquiry(userId: ObjectId, input: CreateCsInquiryInput): Promise<any> {
		const doc = await this.csInquiryModel.create({
			userId,
			title: input.title,
			content: input.content,
			status: CsStatus.PENDING,
		});

		return doc;
	}

	/**
	 * USER: o'zining CS savollari ro'yxati (pagination bilan)
	 */
	public async getMyCsInquiries(userId: ObjectId, input: MyCsInquiryInquiry): Promise<any> {
		const page = input.page ?? 1;
		const limit = input.limit ?? 10;

		const match: T = { userId };

		if (input.status) {
			match.status = input.status;
		}

		const [list, total] = await Promise.all([
			this.csInquiryModel
				.find(match)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.lean(),
			this.csInquiryModel.countDocuments(match),
		]);

		return { list, total };
	}

	/**
	 * ADMIN: barcha CS savollar ro'yxati (filter + search + pagination)
	 */
	public async getAdminCsInquiries(input: AdminCsInquiryInquiry): Promise<any> {
		const page = input.page ?? 1;
		const limit = input.limit ?? 10;

		const match: T = {};

		if (input.status) {
			match.status = input.status;
		}

		if (input.searchText) {
			const regex = new RegExp(input.searchText, 'i');
			match.$or = [{ title: regex }, { content: regex }];
		}

		const [list, total] = await Promise.all([
			this.csInquiryModel
				.find(match)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.lean(),
			this.csInquiryModel.countDocuments(match),
		]);

		return { list, total };
	}

	/**
	 * ADMIN: bitta CS savolga javob yozish
	 */
	public async answerCsInquiry(adminId: ObjectId, input: AnswerCsInquiryInput): Promise<any> {
		const doc = await this.csInquiryModel.findById(input.inquiryId);

		if (!doc) {
			throw new NotFoundException('CS inquiry not found');
		}

		doc.answer = input.answer;
		doc.status = CsStatus.ANSWERED;
		doc.answeredBy = adminId;
		doc.answeredAt = new Date();

		await doc.save();

		return doc;
	}

	/**
	 * USER: bitta CS savol detalini ko'rish
	 */
	public async getMyCsInquiryDetail(userId: ObjectId, id: string): Promise<any> {
		const doc = await this.csInquiryModel
			.findOne({
				_id: id,
				userId,
			})
			.lean();

		if (!doc) {
			throw new NotFoundException('CS inquiry not found');
		}

		return doc;
	}
}
