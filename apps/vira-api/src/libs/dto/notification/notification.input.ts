import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateNotificationInput {
	@Field()
	notificationType: string;

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
}

@InputType()
export class GetMyNotificationsInput {
	@Field(() => Int, { defaultValue: 1 })
	page: number;

	@Field(() => Int, { defaultValue: 10 })
	limit: number;
}
