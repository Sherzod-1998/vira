import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types, isValidObjectId } from 'mongoose';
import { CreateNotificationInput, GetMyNotificationsInput } from '../../libs/dto/notification/notification.input';
import { NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { Notification, NotificationListResult } from '../../libs/dto/notification/notification';
import { SocketGateway } from '../../socket/socket.gateway';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Notification')
		private readonly notificationModel: Model<any>,

		@Inject(forwardRef(() => SocketGateway))
		private readonly socketGateway: SocketGateway,
	) {}

	/* 🔔 CREATE + REAL-TIME SEND */
	async createNotification(input: CreateNotificationInput) {
		const template = this.generateTemplate(input);

		const doc = await this.notificationModel.create({
			...input,
			notificationTitle: template.title,
			notificationDesc: template.desc,
			notificationStatus: NotificationStatus.WAIT,
			authorId: new Types.ObjectId(input.authorId),
			receiverId: new Types.ObjectId(input.receiverId),
			productId: input.productId ? new Types.ObjectId(input.productId) : undefined,
			articleId: input.articleId ? new Types.ObjectId(input.articleId) : undefined,
		});

		// 🔥 Send realtime event to receiver
		this.socketGateway.emitToMember(input.receiverId, {
			event: 'NEW_NOTIFICATION',
			payload: doc,
		});

		return doc;
	}

	/* 🔔 LIST */
	async getMyNotifications(memberId: ObjectId, input: GetMyNotificationsInput): Promise<NotificationListResult> {
		const page = input.page;
		const limit = input.limit;
		const skip = (page - 1) * limit;

		const filter = { receiverId: memberId };

		const [listRaw, total] = await Promise.all([
			this.notificationModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
			this.notificationModel.countDocuments(filter),
		]);

		
		const list = listRaw as unknown as Notification[];

		return { list, total, page, limit };
	}

	/* 🔔 COUNT */
	async getMyUnreadCount(memberId: ObjectId): Promise<number> {
		return this.notificationModel.countDocuments({
			receiverId: memberId,
			notificationStatus: NotificationStatus.WAIT,
		});
	}

	/* 🔔 READ ONE */
	async markNotificationRead(memberId: ObjectId, notificationId: string): Promise<boolean> {
		const res = await this.notificationModel.updateOne(
			{ _id: new Types.ObjectId(notificationId), receiverId: memberId },
			{ $set: { notificationStatus: NotificationStatus.READ } },
		);

		return res.modifiedCount > 0;
	}

	/* 🔔 READ ALL */
	async markAllNotificationsRead(memberId: ObjectId): Promise<boolean> {
		await this.notificationModel.updateMany(
			{ receiverId: memberId, notificationStatus: NotificationStatus.WAIT },
			{ $set: { notificationStatus: NotificationStatus.READ } },
		);

		return true;
	}

	/* 🔔 Template generator */
	private generateTemplate(input: CreateNotificationInput) {
		switch (input.notificationType) {
			case NotificationType.LIKE:
				return {
					title: 'Your product received a like!',
					desc: 'Someone liked your product.',
				};
			case NotificationType.COMMENT:
				return {
					title: 'New comment received!',
					desc: 'Someone commented on your post.',
				};
			case NotificationType.FOLLOW:
				return {
					title: 'You have a new follower',
					desc: 'Someone started following you.',
				};
		}
		return { title: 'Notification', desc: '' };
	}
}
