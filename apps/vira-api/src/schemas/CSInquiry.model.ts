import { Schema } from 'mongoose';
import { CsStatus } from '../libs/enums/cs.enum';

const CsInquirySchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'members',
		},

		title: {
			type: String,
			required: true,
		},

		content: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			enum: Object.values(CsStatus),
			default: CsStatus.PENDING,
		},

		answer: {
			type: String,
			default: null,
		},

		answeredBy: {
			type: Schema.Types.ObjectId,
			ref: 'members',
			default: null,
		},

		answeredAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		collection: 'cs_inquiries',
	},
);

export default CsInquirySchema;
