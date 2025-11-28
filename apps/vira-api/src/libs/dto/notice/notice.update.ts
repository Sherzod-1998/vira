import { Field, InputType, ID } from '@nestjs/graphql';
import { NoticeStatus, NoticeCategory } from '../../enums/notice.enum';

@InputType()
export class UpdateNoticeInput {
	@Field(() => ID)
	noticeId: string;

	@Field(() => NoticeCategory, { nullable: true })
	noticeCategory?: NoticeCategory;

	@Field({ nullable: true })
	noticeTitle?: string;

	@Field({ nullable: true })
	noticeContent?: string;

	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;
}
