import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationService } from './notification.service';
import { NotificationType, NotificationGroup } from '../../libs/enums/notification.enum';

describe('NotificationService', () => {
	const setup = () => {
		const notificationModel = {
			create: jest.fn().mockResolvedValue({ _id: new Types.ObjectId() }),
			updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
		} as any;
		const socketGateway = {
			emitToMember: jest.fn(),
		} as any;
		const service = new NotificationService(notificationModel, socketGateway);
		return { service, notificationModel, socketGateway };
	};

	it('throws BadRequestException when createNotification receives invalid ids', async () => {
		const { service, notificationModel, socketGateway } = setup();

		await expect(
			service.createNotification({
				notificationType: NotificationType.COMMENT,
				notificationGroup: NotificationGroup.PRODUCT,
				notificationTitle: 't',
				notificationDesc: 'd',
				authorId: 'invalid',
				receiverId: new Types.ObjectId().toHexString(),
				productId: new Types.ObjectId().toHexString(),
			}),
		).rejects.toBeInstanceOf(BadRequestException);

		expect(notificationModel.create).not.toHaveBeenCalled();
		expect(socketGateway.emitToMember).not.toHaveBeenCalled();
	});

	it('throws BadRequestException when markNotificationRead receives invalid notificationId', async () => {
		const { service, notificationModel } = setup();

		await expect(service.markNotificationRead(new Types.ObjectId() as any, 'bad-id')).rejects.toBeInstanceOf(
			BadRequestException,
		);
		expect(notificationModel.updateOne).not.toHaveBeenCalled();
	});
});
