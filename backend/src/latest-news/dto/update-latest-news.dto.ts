import { PartialType } from '@nestjs/mapped-types';
import { CreateLatestNewsDto } from './create-latest-news.dto';

export class UpdateLatestNewsDto extends PartialType(CreateLatestNewsDto) {}
