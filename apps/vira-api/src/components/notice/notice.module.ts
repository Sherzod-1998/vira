import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import NoticeSchema from '../../schemas/Notice.model';
import { NoticeService } from './notice.service';
import { NoticeResolver } from './notice.resolver';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Notice', schema: NoticeSchema }]), AuthModule, MemberModule],
	providers: [NoticeService, NoticeResolver],
	exports: [NoticeService],
})
export class NoticeModule {}
