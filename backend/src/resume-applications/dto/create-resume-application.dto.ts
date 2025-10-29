import { IsString, IsNotEmpty } from 'class-validator';

export class CreateResumeApplicationDto {
  @IsNotEmpty()
  @IsString()
  recruitment_post_id: string;
}