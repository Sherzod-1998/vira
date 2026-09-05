import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

const CLOUDINARY_FOLDER = 'vira';

export const isCloudinaryConfigured = (): boolean => Boolean(process.env.CLOUDINARY_URL);

export const normalizeUploadTarget = (target: string): string => {
	if (!/^[a-zA-Z0-9_-]+$/.test(target)) {
		throw new Error('Invalid upload target');
	}

	return target;
};

export const getCloudinaryAssetUrl = (assetPath: string): string => {
	const cloudName = cloudinary.config().cloud_name;
	const normalizedPath = assetPath.replace(/^\/+/, '');

	return `https://res.cloudinary.com/${cloudName}/image/upload/${CLOUDINARY_FOLDER}/${normalizedPath}`;
};

export const uploadImage = async (stream: Readable, target: string, imageName: string): Promise<UploadApiResponse> => {
	const publicId = imageName.replace(/\.[^.]+$/, '');

	return await new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: `${CLOUDINARY_FOLDER}/${target}`,
				public_id: publicId,
				resource_type: 'image',
			},
			(error, result) => {
				if (error || !result) {
					reject(error ?? new Error('Cloudinary upload failed'));
					return;
				}

				resolve(result);
			},
		);

		stream.pipe(uploadStream);
	});
};
