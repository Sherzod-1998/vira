import { registerEnumType } from '@nestjs/graphql';

export enum CsStatus {
	PENDING = 'PENDING',
	ANSWERED = 'ANSWERED',
	CLOSED = 'CLOSED',
}
registerEnumType(CsStatus, {
	name: 'CsStatus',
});
