/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CsService } from './cs.service';
import { CsResolver } from './cs.resolver';
import CsInquirySchema from '../../schemas/CSInquiry.model';

import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'CsInquiry', schema: CsInquirySchema }]), 
	AuthModule, 
	MemberModule],
	providers: [CsService, CsResolver],
	exports: [CsService],
})
export class CsModule {}
