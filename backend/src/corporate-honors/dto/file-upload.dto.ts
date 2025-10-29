import { IsOptional } from 'class-validator';
import {
  IsImageFile,
  MaxFileSize,
} from '../../common/decorators/file-validation.decorator';

export class FileUploadDto {
  @IsOptional()
  @IsImageFile({ message: '图片必须是有效的图片文件 (JPEG, PNG, WebP)' })
  @MaxFileSize(5 * 1024 * 1024, { message: '图片大小不能超过5MB' }) // 5MB
  image?: Express.Multer.File;
}
