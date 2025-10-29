import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { QueryCustomersDto } from './dto/query-customers.dto';
import { UpdateCustomerStatusDto } from './dto/update-customer-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCustomerDto } from './dto/create-customers.dto';
import { SubmitSource } from './customers.types';
import {
  type AuthUser,
  CurrentUser,
} from 'src/common/decorators/current-user.decorator';
import type { Response } from 'express';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Get()
  findAll(@Query() query: QueryCustomersDto) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerStatusDto: UpdateCustomerStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.customersService.updateStatus(
      id,
      updateCustomerStatusDto,
      user.id,
    );
  }

  @Get('export/csv')
  async exportCustomers(@Query() query: QueryCustomersDto, @Res() res: any) {
    const { csvContent, filename } =
      await this.customersService.exportData(query);
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    // Add BOM for proper UTF-8 encoding in Excel
    res.write('\uFEFF');
    res.end(csvContent);
  }
}

// ============================================================================
// PUBLIC ENDPOINTS
// ============================================================================
@Controller('public/customers')
export class CustomersPublicController {
  constructor(private readonly customersService: CustomersService) { }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @Req() req: any) {
    const submitSource =
      req.useragent?.isMobile || req.useragent?.isMobileNative
        ? SubmitSource.Mobile
        : req.useragent?.isTablet
          ? SubmitSource.Tablet
          : SubmitSource.Desktop;

    return this.customersService.create({
      ...createCustomerDto,
      submitSource,
    });
  }
}
