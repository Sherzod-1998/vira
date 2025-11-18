// libs/dto/cs/cs-inquiry.input.ts
import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { CsStatus } from '../../enums/notice.enum';

@InputType()
export class CreateCsInquiryInput {
	@Field()
	title: string;

	@Field()
	content: string;
}

// USER: o'z CS so'rovlari ro'yxati (mypage)
@InputType()
export class MyCsInquiryInquiry {
	@Field(() => Int, { defaultValue: 1 })
	page: number;

	@Field(() => Int, { defaultValue: 10 })
	limit: number;

	@Field(() => CsStatus, { nullable: true })
	status?: CsStatus;
}

// ADMIN: barcha CS so'rovlari (adminka)
@InputType()
export class AdminCsInquiryInquiry {
	@Field(() => Int, { defaultValue: 1 })
	page: number;

	@Field(() => Int, { defaultValue: 10 })
	limit: number;

	@Field(() => CsStatus, { nullable: true })
	status?: CsStatus;

	@Field({ nullable: true })
	searchText?: string;
}

@InputType()
export class AnswerCsInquiryInput {
	@Field(() => ID)
	inquiryId: string;

	@Field()
	answer: string;
}
