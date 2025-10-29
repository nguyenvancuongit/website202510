import { PartialType } from '@nestjs/mapped-types';
import { CreateCorporateHonorDto } from './create-corporate-honor.dto';

export class UpdateCorporateHonorDto extends PartialType(
  CreateCorporateHonorDto,
) {}
