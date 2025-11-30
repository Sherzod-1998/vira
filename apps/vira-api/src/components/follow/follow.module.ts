import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import FollowSchema from '../../schemas/Follow.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Follow',
				schema: FollowSchema,
			},
		]),
		AuthModule,
		MemberModule,
		forwardRef(() => NotificationModule),
	],
	providers: [FollowResolver, FollowService],
	exports: [FollowModule],
})
export class FollowModule {}
