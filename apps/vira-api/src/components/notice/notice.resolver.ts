/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Query, Resolver, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';

import { NoticeService } from './notice.service';
import { WithoutGuard } from '../auth/guards/without.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';

import { MemberType } from '../../libs/enums/member.enum';
import { Notice, NoticeList } from '../../libs/dto/notice/notice';
import { NoticesInquiry, CreateNoticeInput } from '../../libs/dto/notice/notice.input';
import { UpdateNoticeInput } from '../../libs/dto/notice/notice.update';
import { MemberService } from '../member/member.service';

type ObjectId = Types.ObjectId;

@Resolver(() => Notice)
export class NoticeResolver {
	constructor(
		private readonly noticeService: NoticeService,
		private readonly memberService: MemberService,
	) {}

	@UseGuards(WithoutGuard)
	@Query(() => NoticeList)
	async getNotices(@Args('input') input: NoticesInquiry): Promise<NoticeList> {
		return this.noticeService.getNotices(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => NoticeList)
	async getAdminNotices(@Args('input') input: NoticesInquiry): Promise<NoticeList> {
		return this.noticeService.getAdminNotices(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	async createNotice(@Args('input') input: CreateNoticeInput, @AuthMember('_id') adminId: ObjectId): Promise<Notice> {
		return this.noticeService.createNotice(adminId, input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	async updateNotice(@Args('input') input: UpdateNoticeInput, @AuthMember('_id') adminId: ObjectId): Promise<Notice> {
		return this.noticeService.updateNotice(adminId, input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Boolean)
	async deleteNotice(@Args('noticeId', { type: () => ID }) noticeId: string): Promise<boolean> {
		return this.noticeService.deleteNotice(noticeId);
	}

	@ResolveField(() => String, { name: 'memberNick', nullable: true })
	async resolveMemberNick(@Parent() notice: Notice): Promise<string | null> {
		if (!notice.memberId) return null;

		const member = await this.memberService.findMemberById(notice.memberId as any);
		return member?.memberNick ?? null;
	}
}
