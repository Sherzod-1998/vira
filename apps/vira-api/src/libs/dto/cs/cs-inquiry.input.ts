import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { CsStatus } from '../../enums/cs.enum';

@InputType()
export class CreateCsInquiryInput {
	@Field()
	title: string;

	@Field()
	content: string;
}

@InputType()
export class MyCsInquiryInquiry {
	@Field(() => Int, { defaultValue: 1 })
	page: number;

	@Field(() => Int, { defaultValue: 10 })
	limit: number;

	@Field(() => CsStatus, { nullable: true })
	status?: CsStatus;
}

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
