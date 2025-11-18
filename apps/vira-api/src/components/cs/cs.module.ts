// apps/vira-api/src/components/cs/cs.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CsService } from './cs.service';
import { CsResolver } from './cs.resolver';
import CsInquirySchema from '../../schemas/CSInquiry.model';

// 🔽 AuthModule import
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'CsInquiry', schema: CsInquirySchema }]),
		AuthModule, // 🔴 Muhim: shu yerga qo'shamiz
	],
	providers: [CsService, CsResolver],
	exports: [CsService],
})
export class CsModule {}
