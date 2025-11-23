// libs/dto/notice/notice.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

@InputType()
export class NoticesInquiry {
	@Field(() => Int, { nullable: true })
	page?: number;

	@Field(() => Int, { nullable: true })
	limit?: number;

	@Field({ nullable: true })
	searchText?: string;

	@Field(() => NoticeCategory, { nullable: true })
	noticeCategory?: NoticeCategory;

	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus; // admin tarafda filter uchun
}

@InputType()
export class CreateNoticeInput {
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field()
	noticeTitle: string;

	@Field()
	noticeContent: string;

	@Field({ nullable: true })
	isTop?: boolean; // agar keyin kerak bo'lsa, hozircha ishlatmasak ham bo‘ladi
}
