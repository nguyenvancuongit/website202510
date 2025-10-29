import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { AddressesService } from './addresses.service';
import type { IpLocationResponse } from './addresses.service';
import { GetProvincesDto } from './dto/get-provinces.dto';
import { GetCitiesDto } from './dto/get-cities.dto';
import { GetDistrictsDto } from './dto/get-districts.dto';
import { publicApiThrottler } from 'src/common/config/throttler.config';

@Controller('public/addresses')
@UseGuards(ThrottlerGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  /**
   * Get all provinces
   * GET /public/addresses/provinces?name=广东
   */
  @Get('provinces')
  @Throttle({ default: publicApiThrottler })
  getProvinces(@Query() query: GetProvincesDto) {
    const provinces = this.addressesService.getProvinces(query.name);
    return {
      data: provinces,
      total: provinces.length,
    };
  }

  /**
   * Get cities by province name and city name
   * GET /public/addresses/cities?province=广东省&name=石家庄市
   */
  @Get('cities')
  @Throttle({ default: publicApiThrottler })
  getCities(@Query() query: GetCitiesDto) {
    const cities = this.addressesService.getCities(query.province, query.name);
    return {
      data: cities,
      total: cities.length,
    };
  }

  /**
   * Get districts by province name and city name and district name
   * GET /public/addresses/districts?province=广东省&city=广州市&name=天河区
   */
  @Get('districts')
  @Throttle({ default: publicApiThrottler })
  getDistricts(@Query() query: GetDistrictsDto) {
    const districts = this.addressesService.getDistricts(
      query.province,
      query.city,
      query.name
    );
    return {
      data: districts,
      total: districts.length,
    };
  }

  /**
   * Get IP location using JYSHARE API (proxy to avoid CORS)
   * GET /public/addresses/ip-location
   */
  @Get('ip-location')
  @Throttle({ default: publicApiThrottler })
  async getIpLocation(@Req() req: Request): Promise<IpLocationResponse> {
    const clientIp = this.getClientIp(req);
    return await this.addressesService.getIpLocation(clientIp);
  }

  private getClientIp(req: Request): string {
    // Try to get real IP from various headers (for proxy/load balancer scenarios)
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : forwarded[0];
    }

    const realIp = req.headers['x-real-ip'];
    if (realIp) {
      return typeof realIp === 'string' ? realIp : realIp[0];
    }

    return req.ip || req.socket.remoteAddress || '';
  }
}

