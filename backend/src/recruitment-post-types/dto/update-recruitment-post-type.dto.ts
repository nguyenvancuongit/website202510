import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruitmentPostTypeDto } from './create-recruitment-post-type.dto';

export class UpdateRecruitmentPostTypeDto extends PartialType(CreateRecruitmentPostTypeDto) {}