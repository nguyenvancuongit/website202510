import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruitmentPostDto } from './create-recruitment-post.dto';

export class UpdateRecruitmentPostDto extends PartialType(CreateRecruitmentPostDto) {}
