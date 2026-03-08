import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsOptional, Min } from 'class-validator';
import { NotificationGroup, NotificationType } from '../../enums/notification.enum';

@InputType()
export class CreateNotificationInput {
	@IsEnum(NotificationType)
	@Field(() => NotificationType)
	notificationType: NotificationType;

	@IsEnum(NotificationGroup)
	@Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;

	@Field()
	notificationTitle: string;

	@Field({ nullable: true })
	notificationDesc?: string;

	@IsMongoId()
	@Field(() => ID)
	authorId: string;

	@IsMongoId()
	@Field(() => ID)
	receiverId: string;

	@IsOptional()
	@IsMongoId()
	@Field(() => ID, { nullable: true })
	productId?: string;

	@IsOptional()
	@IsMongoId()
	@Field(() => ID, { nullable: true })
	articleId?: string;
}

@InputType()
export class GetMyNotificationsInput {
	@Min(1)
	@Field(() => Int, { defaultValue: 1 })
	page: number;

	@Min(1)
	@Field(() => Int, { defaultValue: 10 })
	limit: number;
}
