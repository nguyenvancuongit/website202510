import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { QueryHashtagsDto } from './dto/query-hashtags.dto';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { UpdateHashtagStatusDto } from './dto/update-hashtag-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('hashtags')
@UseGuards(JwtAuthGuard)
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get()
  findAll(@Query() query: QueryHashtagsDto) {
    return this.hashtagsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagsService.findOne(id);
  }

  @Post()
  create(@Body() createHashtagDto: CreateHashtagDto) {
    return this.hashtagsService.create(createHashtagDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHashtagDto: UpdateHashtagDto,
  ) {
    return this.hashtagsService.update(id, updateHashtagDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHashtagStatusDto: UpdateHashtagStatusDto,
  ) {
    return this.hashtagsService.updateStatus(id, updateHashtagStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagsService.remove(id);
  }
}
