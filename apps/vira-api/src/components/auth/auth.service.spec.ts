import { AuthService } from './auth.service';

describe('AuthService', () => {
	it('should sign a minimal token payload', async () => {
		const signAsync = jest.fn().mockResolvedValue('token');
		const jwtService = { signAsync } as any;
		const service = new AuthService(jwtService);

		const member: any = {
			_id: '65f000000000000000000001',
			memberNick: 'john',
			memberType: 'USER',
			memberStatus: 'ACTIVE',
			memberAuthType: 'PHONE',
			memberPhone: '+821000000000',
			memberPassword: 'hashed-secret',
		};

		await service.createToken(member);

		expect(signAsync).toHaveBeenCalledTimes(1);
		expect(signAsync).toHaveBeenCalledWith({
			_id: member._id,
			memberNick: member.memberNick,
			memberType: member.memberType,
			memberStatus: member.memberStatus,
			memberAuthType: member.memberAuthType,
			memberImage: '',
			memberPhone: member.memberPhone,
			memberFullName: '',
			memberAddress: '',
		});
	});
});
