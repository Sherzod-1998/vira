/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';

import { NoticeService } from './notice.service';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';

import { MemberType } from '../../libs/enums/member.enum';
import { Notice, NoticeList } from '../../libs/dto/notice/notice';
import { NoticesInquiry, CreateNoticeInput } from '../../libs/dto/notice/notice.input';

type ObjectId = Types.ObjectId;

@Resolver()
export class NoticeResolver {
	constructor(private readonly noticeService: NoticeService) {}

	/** USER: Notice ro'yxati */
	@UseGuards(WithoutGuard)
	@Query(() => NoticeList)
	async getNotices(@Args('input') input: NoticesInquiry): Promise<NoticeList> {
		return this.noticeService.getNotices(input);
	}

	/** ADMIN: Notice ro'yxati */
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => NoticeList)
	async getAdminNotices(@Args('input') input: NoticesInquiry): Promise<NoticeList> {
		return this.noticeService.getAdminNotices(input);
	}

	/** ADMIN: Notice yaratish */
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	async createNotice(@Args('input') input: CreateNoticeInput, @AuthMember('_id') adminId: ObjectId): Promise<Notice> {
		return this.noticeService.createNotice(adminId, input);
	}
}
