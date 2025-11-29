import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification, NotificationListResult } from '../../libs/dto/notification/notification';
import { GetMyNotificationsInput, CreateNotificationInput } from '../../libs/dto/notification/notification.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver(() => Notification)
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	/* 🔔 GET LIST */
	@UseGuards(WithoutGuard)
	@Query(() => NotificationListResult)
	async getMyNotifications(@Args('input') input: GetMyNotificationsInput, @AuthMember('_id') memberId: ObjectId) {
		return this.notificationService.getMyNotifications(memberId, input);
	}

	/* 🔔 GET UNREAD COUNT */
	@UseGuards(WithoutGuard)
	@Query(() => Int)
	async getMyUnreadNotificationsCount(@AuthMember('_id') memberId: ObjectId) {
		return this.notificationService.getMyUnreadCount(memberId);
	}

	/* 🔔 CREATE */
	@Mutation(() => Notification)
	async createNotification(@Args('input') input: CreateNotificationInput) {
		return this.notificationService.createNotification(input);
	}

	/* 🔔 MARK ONE */
	@UseGuards(WithoutGuard)
	@Mutation(() => Boolean)
	async markNotificationRead(
		@Args('notificationId', { type: () => ID }) notificationId: string,
		@AuthMember('_id') memberId: ObjectId,
	) {
		return this.notificationService.markNotificationRead(memberId, notificationId);
	}

	/* 🔔 MARK ALL */
	@UseGuards(WithoutGuard)
	@Mutation(() => Boolean)
	async markAllNotificationsRead(@AuthMember('_id') memberId: ObjectId) {
		return this.notificationService.markAllNotificationsRead(memberId);
	}
}
