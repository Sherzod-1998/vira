/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Parent, Query, Resolver, ResolveField } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';

import { CsService } from './cs.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

import { MemberType } from '../../libs/enums/member.enum';

import {
	CreateCsInquiryInput,
	MyCsInquiryInquiry,
	AdminCsInquiryInquiry,
	AnswerCsInquiryInput,
} from '../../libs/dto/cs/cs-inquiry.input';
import { CsInquiry, CsInquiryList } from '../../libs/dto/cs/cs-inquiry';
import { MemberService } from '../member/member.service';

@Resolver(() => CsInquiry)
export class CsResolver {
	constructor(
		private readonly csService: CsService,
		private readonly memberService: MemberService,
	) {}

	@UseGuards(AuthGuard)
	@Mutation(() => CsInquiry)
	public async createCsInquiry(
		@Args('input') input: CreateCsInquiryInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<any> {
		console.log('Mutation: createCsInquiry');
		return await this.csService.createCsInquiry(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => CsInquiryList)
	public async getMyCsInquiries(
		@Args('input') input: MyCsInquiryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<any> {
		console.log('Query: getMyCsInquiries');

		if (!input.page) input.page = 1;
		if (!input.limit) input.limit = 10;

		return await this.csService.getMyCsInquiries(memberId, input);
	}

	/** USER: bitta CS so'rov detali **/
	@UseGuards(AuthGuard)
	@Query(() => CsInquiry)
	public async getMyCsInquiryDetail(
		@Args('inquiryId') inquiryId: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<any> {
		console.log('Query: getMyCsInquiryDetail');
		return await this.csService.getMyCsInquiryDetail(memberId, inquiryId);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => CsInquiryList)
	public async getAdminCsInquiries(@Args('input') input: AdminCsInquiryInquiry): Promise<any> {
		console.log('Query: getAdminCsInquiries');

		if (!input.page) input.page = 1;
		if (!input.limit) input.limit = 10;

		return await this.csService.getAdminCsInquiries(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => CsInquiry)
	public async answerCsInquiry(
		@Args('input') input: AnswerCsInquiryInput,
		@AuthMember('_id') adminId: ObjectId,
	): Promise<any> {
		console.log('Mutation: answerCsInquiry');
		return await this.csService.answerCsInquiry(adminId, input);
	}

	@ResolveField(() => String, { name: 'memberNick', nullable: true })
	async resolveMemberNick(@Parent() inquiry: CsInquiry): Promise<string | null> {
		if (!inquiry.userId) return null;

		const member = await this.memberService.findMemberById(inquiry.userId as any);
		return member?.memberNick ?? null;
	}
}
