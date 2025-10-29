import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ClientsService } from './clients.service';
import { QueryClientsDto } from './dto/query-clients.dto';
import { ExportClientsDto } from './dto/export-clients.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ClientLoginDto } from './dto/client-login.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClientJwtAuthGuard } from './guards/client-jwt-auth.guard';

@Controller()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // ============================================================================
  // PUBLIC CLIENT AUTH ENDPOINTS (client/auth/*)
  // ============================================================================

  @Post('client/auth/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterClientDto) {
    return this.clientsService.register(registerDto);
  }

  @Post('client/auth/verify-code')
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() verifyDto: VerifyCodeDto) {
    return this.clientsService.verifyCode(verifyDto);
  }

  @Post('client/auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: ClientLoginDto) {
    return this.clientsService.login(loginDto);
  }

  // ============================================================================
  // CLIENT PROTECTED ENDPOINTS (client/auth/*)
  // ============================================================================

  @Get('client/auth/profile')
  @UseGuards(ClientJwtAuthGuard)
  async getProfile(@Request() req) {
    return this.clientsService.getProfile(req.user.id);
  }

  @Patch('client/auth/profile')
  @UseGuards(ClientJwtAuthGuard)
  async updateProfile(
    @Request() req,
    @Body() updateDto: UpdateClientProfileDto,
  ) {
    return this.clientsService.updateProfile(req.user.id, updateDto);
  }

  // ============================================================================
  // ADMIN ENDPOINTS (clients/*)
  // ============================================================================

  @Get('clients')
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: QueryClientsDto) {
    const result = await this.clientsService.findAll(query);
    return {
      message: '客户列表获取成功',
      ...result,
    };
  }

  @Get('clients/export')
  @UseGuards(JwtAuthGuard)
  async exportToCsv(@Query() query: ExportClientsDto, @Res() res: Response) {
    const csvData = await this.clientsService.exportToCsv(query);

    // Set CSV headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="clients_export_${new Date().toISOString().split('T')[0]}.csv"`,
    );

    return res.send(csvData);
  }

  @Get('clients/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const client = await this.clientsService.findOne(id);
    return {
      message: '客户详情获取成功',
      data: client,
    };
  }

  @Patch('clients/:id/status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateClientStatusDto,
  ) {
    const client = await this.clientsService.updateStatus(id, updateStatusDto);
    return {
      message: '客户状态更新成功',
      data: client,
    };
  }
}
