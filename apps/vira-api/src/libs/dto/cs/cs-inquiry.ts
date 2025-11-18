// libs/dto/cs/cs-inquiry.ts
import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CsStatus } from '../../enums/notice.enum';

// GraphQL enum registration
registerEnumType(CsStatus, {
	name: 'CsStatus',
});

@ObjectType()
export class CsInquiry {
	@Field(() => ID)
	_id: string;

	@Field()
	title: string;

	@Field()
	content: string;

	@Field(() => CsStatus)
	status: CsStatus;

	@Field(() => String)
	userId: string;

	@Field({ nullable: true })
	answer?: string;

	@Field(() => String, { nullable: true })
	answeredBy?: string;

	@Field({ nullable: true })
	answeredAt?: Date;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}

@ObjectType()
export class CsInquiryList {
	@Field(() => [CsInquiry])
	list: CsInquiry[];

	@Field(() => Int)
	total: number;
}
