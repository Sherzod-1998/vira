import 'reflect-metadata';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { NotificationResolver } from './notification.resolver';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';

describe('NotificationResolver Security Metadata', () => {
	const target = NotificationResolver.prototype;

	const readGuards = (methodName: keyof NotificationResolver) =>
		Reflect.getMetadata(GUARDS_METADATA, target[methodName]) ?? [];

	it('should require AuthGuard for member notification queries and mutations', () => {
		expect(readGuards('getMyNotifications')).toContain(AuthGuard);
		expect(readGuards('getMyUnreadNotificationsCount')).toContain(AuthGuard);
		expect(readGuards('markNotificationRead')).toContain(AuthGuard);
		expect(readGuards('markAllNotificationsRead')).toContain(AuthGuard);
	});

	it('should require RolesGuard and ADMIN role for createNotification', () => {
		const guards = readGuards('createNotification');
		const roles = Reflect.getMetadata('roles', target.createNotification) ?? [];

		expect(guards).toContain(RolesGuard);
		expect(roles).toContain(MemberType.ADMIN);
	});
});
