import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Notification {
	@Field(() => ID)
	_id: string;

	@Field()
	notificationType: string;

	@Field()
	notificationStatus: string;

	@Field()
	notificationGroup: string;

	@Field()
	notificationTitle: string;

	@Field({ nullable: true })
	notificationDesc?: string;

	@Field(() => ID)
	authorId: string;

	@Field(() => ID)
	receiverId: string;

	@Field(() => ID, { nullable: true })
	productId?: string;

	@Field(() => ID, { nullable: true })
	articleId?: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}

@ObjectType()
export class NotificationListResult {
	@Field(() => [Notification])
	list: Notification[];

	@Field()
	total: number;

	@Field()
	page: number;

	@Field()
	limit: number;
}
