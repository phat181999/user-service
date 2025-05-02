import { ConfigService } from '@nestjs/config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const fileTypeMappings = {
  image: {
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
};

export const storage = (configService: ConfigService): CloudinaryStorage => {
  return new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      if (!file) {
        throw new Error('No file uploaded');
      }

      const fileType = file.mimetype.split('/')[0];
      const fileMapping = fileTypeMappings[fileType] || fileTypeMappings.image;

      return {
        folder: configService.get<string>('CLOUDINARY_FOLDER'),
        resource_type: fileMapping.resource_type,
        allowed_formats: fileMapping.allowed_formats,
      };
    },
  });
};
