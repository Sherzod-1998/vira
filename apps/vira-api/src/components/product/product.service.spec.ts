import { ProductService } from './product.service';
import { ProductStatus } from '../../libs/enums/product.enum';

describe('ProductService status timestamp updates', () => {
	const buildService = () => {
		const exec = jest.fn();
		const findOneAndUpdate = jest.fn(() => ({ exec }));
		const productModel = {
			findOneAndUpdate,
		} as any;

		const memberService = {
			memberStatsEditor: jest.fn().mockResolvedValue(null),
		} as any;

		const service = new ProductService(productModel, memberService, {} as any, {} as any);
		return { service, productModel, memberService, exec };
	};

	it('updateProduct should set soldAt when status becomes SOLD', async () => {
		const { service, productModel, exec, memberService } = buildService();
		exec.mockResolvedValue({
			_id: 'p1',
			memberId: 'm1',
			productStatus: ProductStatus.SOLD,
		});

		const input: any = {
			_id: 'p1',
			productStatus: ProductStatus.SOLD,
		};

		await service.updateProduct('m1' as any, input);

		expect(productModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
		const [, updatePayload] = productModel.findOneAndUpdate.mock.calls[0];
		expect(updatePayload.soldAt).toBeInstanceOf(Date);
		expect(memberService.memberStatsEditor).toHaveBeenCalled();
	});

	it('updateProduct should set deletedAt when status becomes DELETE', async () => {
		const { service, productModel, exec, memberService } = buildService();
		exec.mockResolvedValue({
			_id: 'p1',
			memberId: 'm1',
			productStatus: ProductStatus.DELETE,
		});

		const input: any = {
			_id: 'p1',
			productStatus: ProductStatus.DELETE,
		};

		await service.updateProduct('m1' as any, input);

		expect(productModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
		const [, updatePayload] = productModel.findOneAndUpdate.mock.calls[0];
		expect(updatePayload.deletedAt).toBeInstanceOf(Date);
		expect(memberService.memberStatsEditor).toHaveBeenCalled();
	});

	it('updateProductByAdmin should set soldAt when status becomes SOLD', async () => {
		const { service, productModel, exec, memberService } = buildService();
		exec.mockResolvedValue({
			_id: 'p1',
			memberId: 'seller1',
			productStatus: ProductStatus.SOLD,
		});

		const input: any = {
			_id: 'p1',
			productStatus: ProductStatus.SOLD,
		};

		await service.updateProductByAdmin(input);

		expect(productModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
		const [, updatePayload] = productModel.findOneAndUpdate.mock.calls[0];
		expect(updatePayload.soldAt).toBeInstanceOf(Date);
		expect(memberService.memberStatsEditor).toHaveBeenCalledWith({
			_id: 'seller1',
			targetKey: 'memberProducts',
			modifier: -1,
		});
	});

	it('getProducts should not crash when search is omitted', async () => {
		const aggregateExec = jest.fn().mockResolvedValue([{ list: [], metaCounter: [{ total: 0 }] }]);
		const productModel = {
			aggregate: jest.fn(() => ({ exec: aggregateExec })),
		} as any;

		const service = new ProductService(productModel, {} as any, {} as any, {} as any);

		await expect(
			service.getProducts(
				'm1' as any,
				{
					page: 1,
					limit: 10,
				} as any,
			),
		).resolves.toEqual({ list: [], metaCounter: [{ total: 0 }] });
		expect(productModel.aggregate).toHaveBeenCalledTimes(1);
	});
});
