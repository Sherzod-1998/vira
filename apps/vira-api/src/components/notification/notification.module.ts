import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import NotificationSchema from '../../schemas/Notification.model';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { SocketModule } from '../../socket/socket.module';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
		forwardRef(() => SocketModule),
		AuthModule, // 🔥 WithoutGuard ichidagi AuthService shu yerdan keladi
	],
	providers: [NotificationResolver, NotificationService],
	exports: [NotificationService],
})
export class NotificationModule {}
