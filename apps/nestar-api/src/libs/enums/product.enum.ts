import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
	RING = 'RING',
	NECKLACE = 'NECKLACE',
	BRACELET = 'BRACELET',
	EARRING = 'EARRING',
	SET = 'SET',
	WATCH = 'WATCH',
	BROOCH = 'BROOCH',
	CHAIN = 'CHAIN',
	GOLD_BAR = 'GOLD_BAR',
	OTHER = 'OTHER',
}
registerEnumType(ProductType, {
	name: 'ProductType',
});

export enum ProductStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(ProductStatus, {
	name: 'ProductStatus',
});

export enum ProductMaterial {
	GOLD = 'GOLD',
	WHITE_GOLD = 'WHITE_GOLD',
	ROSE_GOLD = 'ROSE_GOLD',
	SILVER = 'SILVER',
	PLATINUM = 'PLATINUM',
	DIAMOND = 'DIAMOND',
	PEARL = 'PEARL',
	TITANIUM = 'TITANIUM',
	STAINLESS_STEEL = 'STAINLESS_STEEL',
	BRASS = 'BRASS',
	COPPER = 'COPPER',
	LEATHER = 'LEATHER',
	OTHER = 'OTHER',
}
registerEnumType(ProductMaterial, {
	name: 'ProductMaterial',
});

export enum ProductLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}
registerEnumType(ProductLocation, {
	name: 'ProductLocation',
});
