import { MemberService } from './member.service';

describe('MemberService password hashing on update', () => {
	const buildService = () => {
		const exec = jest.fn();
		const findOneAndUpdate = jest.fn(() => ({ exec }));
		const create = jest.fn();
		const memberModel = {
			create,
			findOneAndUpdate,
		} as any;

		const authService = {
			hashPassword: jest.fn().mockResolvedValue('hashed-password'),
			createToken: jest.fn().mockResolvedValue('token'),
		} as any;

		const service = new MemberService(memberModel, {} as any, authService, {} as any, {} as any);
		return { service, memberModel, authService, exec };
	};

	it('signup ignores caller supplied privilege fields', async () => {
		const { service, memberModel, authService } = buildService();
		memberModel.create.mockResolvedValue({ _id: 'm1' });

		await service.signup({
			memberNick: 'tester',
			memberPhone: '+821000000000',
			memberPassword: 'plain-password',
			memberType: 'ADMIN',
		} as any);

		expect(authService.hashPassword).toHaveBeenCalledWith('plain-password');
		expect(memberModel.create).toHaveBeenCalledTimes(1);
		const [createPayload] = memberModel.create.mock.calls[0];
		expect(createPayload.memberType).toBe('USER');
		expect(createPayload.memberStatus).toBe('ACTIVE');
		expect(createPayload.memberPassword).toBe('hashed-password');
	});

	it('updateMember hashes memberPassword before persisting', async () => {
		const { service, memberModel, authService, exec } = buildService();
		exec.mockResolvedValue({ _id: 'm1' });

		await service.updateMember(
			'm1' as any,
			{
				memberNick: 'tester',
				memberPassword: 'plain-password',
			} as any,
		);

		expect(authService.hashPassword).toHaveBeenCalledWith('plain-password');
		expect(memberModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
		const [, updatePayload] = memberModel.findOneAndUpdate.mock.calls[0];
		expect(updatePayload.memberPassword).toBe('hashed-password');
	});

	it('updateMemberByAdmin hashes memberPassword before persisting', async () => {
		const { service, memberModel, authService, exec } = buildService();
		exec.mockResolvedValue({ _id: 'm1' });

		await service.updateMemberByAdmin({
			_id: 'm1',
			memberPassword: 'plain-password',
		} as any);

		expect(authService.hashPassword).toHaveBeenCalledWith('plain-password');
		expect(memberModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
		const [, updatePayload] = memberModel.findOneAndUpdate.mock.calls[0];
		expect(updatePayload.memberPassword).toBe('hashed-password');
	});

	it('does not hash when memberPassword is absent', async () => {
		const { service, memberModel, authService, exec } = buildService();
		exec.mockResolvedValue({ _id: 'm1' });

		await service.updateMember(
			'm1' as any,
			{
				memberNick: 'tester',
			} as any,
		);

		expect(authService.hashPassword).not.toHaveBeenCalled();
		const [, updatePayload] = memberModel.findOneAndUpdate.mock.calls[0];
		expect(updatePayload).toEqual({ memberNick: 'tester' });
	});

	it('updateMember strips privilege fields from self-service updates', async () => {
		const { service, memberModel, authService, exec } = buildService();
		exec.mockResolvedValue({ _id: 'm1' });

		await service.updateMember(
			'm1' as any,
			{
				memberNick: 'tester',
				memberType: 'ADMIN',
				memberStatus: 'BLOCK',
			} as any,
		);

		expect(authService.hashPassword).not.toHaveBeenCalled();
		const [, updatePayload] = memberModel.findOneAndUpdate.mock.calls[0];
		expect(updatePayload).toEqual({ memberNick: 'tester' });
	});
});
