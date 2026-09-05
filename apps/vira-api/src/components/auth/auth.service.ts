import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Member } from '../../libs/dto/member/member';
import { JwtService } from '@nestjs/jwt';
import { T } from '../../libs/types/common';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { MemberStatus, MemberType, MemberAuthType } from '../../libs/enums/member.enum';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	public async hashPassword(memberPassword: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return await bcrypt.hash(memberPassword, salt);
	}

	public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}

	public async createToken(member: Member): Promise<string> {
		const source: T = member['_doc'] ? member['_doc'] : member;
		const payload: T = {
			_id: source._id,
			memberNick: source.memberNick,
			memberType: source.memberType as MemberType,
			memberStatus: source.memberStatus as MemberStatus,
			memberAuthType: source.memberAuthType as MemberAuthType,
			memberImage: source.memberImage ?? '',
			memberPhone: source.memberPhone ?? '',
			memberFullName: source.memberFullName ?? '',
			memberAddress: source.memberAddress ?? '',
		};
		return await this.jwtService.signAsync(payload);
	}

	public async verifyToken(token: string): Promise<Member> {
		const member = await this.jwtService.verifyAsync(token);
		member._id = shapeIntoMongoObjectId(member._id);
		return member;
	}

	public async getGoogleUserInfo(
		accessToken: string,
	): Promise<{ sub: string; email: string; name: string; picture: string }> {
		const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
		const data = await res.json();
		if (!data.sub || data.error) throw new Error('Invalid Google access token');
		return data;
	}
}
