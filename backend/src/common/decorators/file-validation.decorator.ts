import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsImageFile(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isImageFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true; // Allow optional files

          // Check if it's a file object
          if (!value.originalname) return false;

          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
          const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
          ];

          const filename = value.originalname.toLowerCase();
          const mimetype = value.mimetype?.toLowerCase();

          // Check file extension
          const hasValidExtension = allowedExtensions.some((ext) =>
            filename.endsWith(ext),
          );

          // Check MIME type
          const hasValidMimeType = allowedMimeTypes.includes(mimetype);

          return hasValidExtension && hasValidMimeType;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid image file (JPEG, PNG, WebP)`;
        },
      },
    });
  };
}

export function MaxFileSize(
  maxSizeInBytes: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'maxFileSize',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [maxSizeInBytes],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow optional files

          const [maxSize] = args.constraints;
          return value.size <= maxSize;
        },
        defaultMessage(args: ValidationArguments) {
          const [maxSize] = args.constraints;
          const maxSizeInMB = (maxSize / (1024 * 1024)).toFixed(1);
          return `${args.property} file size must not exceed ${maxSizeInMB}MB`;
        },
      },
    });
  };
}
