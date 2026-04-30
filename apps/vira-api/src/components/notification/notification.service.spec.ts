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

	it('preserves caller supplied title and description when creating notifications', async () => {
		const { service, notificationModel } = setup();
		const receiverId = new Types.ObjectId().toHexString();
		const authorId = new Types.ObjectId().toHexString();

		await service.createNotification({
			notificationType: NotificationType.COMMENT,
			notificationGroup: NotificationGroup.PRODUCT,
			notificationTitle: 'Custom title',
			notificationDesc: 'Custom description',
			authorId,
			receiverId,
			productId: new Types.ObjectId().toHexString(),
		});

		expect(notificationModel.create).toHaveBeenCalledTimes(1);
		const [payload] = notificationModel.create.mock.calls[0];
		expect(payload.notificationTitle).toBe('Custom title');
		expect(payload.notificationDesc).toBe('Custom description');
	});
});
