import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { OperationLogService } from './operation-log.service';
import { QueryOperationLogDto } from './dto/query-operation-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Permission } from 'src/users/constants';

@Controller('operation-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.MANAGE_OPERATION_LOGS)
export class OperationLogController {
  constructor(private readonly operationLogService: OperationLogService) {}

  @Get()
  async findAll(@Query() query: QueryOperationLogDto) {
    return await this.operationLogService.findAll(query);
  }

  @Get('export')
  async exportCsv(@Query() query: QueryOperationLogDto, @Res() res: Response) {
    return await this.operationLogService.exportToCsv(query, res);
  }
}
