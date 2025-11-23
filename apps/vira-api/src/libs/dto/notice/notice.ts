// libs/dto/notice/notice.ts
import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

registerEnumType(NoticeCategory, { name: 'NoticeCategory' });
registerEnumType(NoticeStatus, { name: 'NoticeStatus' });

@ObjectType()
export class Notice {
	@Field()
	_id: string;

	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field(() => NoticeStatus)
	noticeStatus: NoticeStatus;

	@Field()
	noticeTitle: string;

	@Field()
	noticeContent: string;

	@Field()
	memberId: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}

@ObjectType()
export class NoticeList {
	@Field(() => [Notice])
	list: Notice[];

	@Field(() => Int)
	total: number;
}
