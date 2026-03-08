import ProductSchema from './Product.model';

describe('ProductSchema', () => {
	it('should include option flags used by product filters', () => {
		const barterPath = ProductSchema.path('productBarter');
		const rentPath = ProductSchema.path('productRent');

		expect(barterPath).toBeDefined();
		expect(rentPath).toBeDefined();
	});
});
