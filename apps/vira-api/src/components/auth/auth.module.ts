// apps/vira-api/src/components/auth/auth.module.ts (yo bo‘lmasa o'zingizda qayerda bo'lsa)

// 🔽 guardlarni import qilamiz
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { WithoutGuard } from './guards/without.guard';

@Module({
	imports: [
		HttpModule,
		JwtModule.register({
			secret: `${process.env.SECRET_TOKEN}`,
			signOptions: { expiresIn: '30d' },
		}),
	],
	providers: [AuthService, AuthGuard, RolesGuard, WithoutGuard],
	exports: [AuthService, AuthGuard, RolesGuard, WithoutGuard],
})
export class AuthModule {}
