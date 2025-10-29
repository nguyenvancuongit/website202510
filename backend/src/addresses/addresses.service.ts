import { Injectable, Logger } from '@nestjs/common';
import regionData from './constants/region.json';

export interface RegionData {
  code: string | number;
  name: string;
  children?: RegionData[];
}


export interface IpLocationData {
  status: string;
  query: string;
  country: string;
  regionName: string;
  city: string;
  isp: string;
  lat: number;
  lon: number;
  timezone: string;
}

export interface IpLocationResponse {
  flag: boolean;
  msg: string;
  data: IpLocationData | string;
}

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);
  private readonly regions: RegionData[] = regionData;
  private readonly jyshareUrl = process.env.JYSHARE_URL;
  private readonly jyshareToken = process.env.JYSHARE_TOKEN;

  /**
   * Get all provinces, optionally filter by name
   */
  getProvinces(name?: string): string[] {
    const provinces = this.regions.map(region => region.name);

    if (name) {
      return provinces.filter((province) =>
        province.toLowerCase().includes(name.toLowerCase()),
      );
    }

    return provinces;
  }


  /**
   * Get cities by province name
   */
  getCities(provinceName: string, cityName?: string): string[] {
    const province = this.findRegionByName(provinceName);

    if (!province || !province.children) {
      return [];
    }

    // Handle special cases like 北京市, 天津市, 上海市, 重庆市
    // These have "市辖区" as the city key, but we want to return the districts directly
    if (province.children.length === 1 && province.children[0].name === '市辖区') {
      const districts = province.children[0].children?.map(child => child.name) || [];
      if (cityName) {
        return districts.filter((district) =>
          district.toLowerCase().includes(cityName.toLowerCase()),
        );
      }
      return districts;
    }

    const cities = province.children.map(city => city.name);
    if (cityName) {
      return cities.filter((city) =>
        city.toLowerCase().includes(cityName.toLowerCase()),
      );
    }

    return cities;
  }


  /**
   * Get districts by province and city name
   */
  getDistricts(provinceName: string, cityName: string, districtName?: string): string[] {
    const province = this.findRegionByName(provinceName);

    if (!province || !province.children) {
      return [];
    }
    
    // Handle special cases like 北京市, 天津市, 上海市, 重庆市
    if (province.children.length === 1 && province.children[0].name === '市辖区') {
      // For direct municipalities, check if the cityName is one of the districts
      const districts = province.children[0].children?.map(child => child.name) || [];
      if (districts.includes(cityName)) {
        return []; // No sub-districts for these municipalities
      }
      return [];
    }

    const city = province.children.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase(),
    );

    if (!city || !city.children) {
      return [];
    }

    const districts = city.children.map(child => child.name);
    if (districtName) {
      return districts.filter((district) =>
        district.toLowerCase().includes(districtName.toLowerCase()),
      );
    }

    return districts;
  }



  /**
   * Helper: Find region by name (case-insensitive)
   */
  private findRegionByName(name: string): RegionData | null {
    return (
      this.regions.find((region) => 
        region.name.toLowerCase().includes(name.toLowerCase())
      ) || null
    );
  }

  /**
   * Get IP location from JYSHARE API
   * This acts as a proxy to avoid CORS and browser detection issues
   */
  async getIpLocation(clientIp: string): Promise<IpLocationResponse> {
    // Check if JYSHARE credentials are configured
    if (!this.jyshareUrl || !this.jyshareToken) {
      this.logger.warn('JYSHARE API not configured');
      return {
        flag: false,
        msg: '未配置IP定位服务',
        data: '',
      };
    }

    // Check if IP is localhost or private IP
    const isLocalhost =
      !clientIp ||
      clientIp === '::1' ||
      clientIp === '127.0.0.1' ||
      clientIp === 'localhost' ||
      clientIp.startsWith('192.168.') ||
      clientIp.startsWith('10.') ||
      clientIp.startsWith('172.');

    if (isLocalhost) {
      this.logger.warn(`Local/Private IP detected: ${clientIp}`);
      return {
        flag: false,
        msg: '本地IP无法定位',
        data: '',
      };
    }

    try {
      // Build the URL with proper parameters
      const url = `${this.jyshareUrl}?type=checkIP&requestToken=${this.jyshareToken}&REMOTE_ADDR=${clientIp}`;

      this.logger.log(`Fetching IP location for: ${clientIp}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          Referer: 'https://www.jyshare.com/',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: IpLocationResponse = await response.json();

      if (result.flag && typeof result.data === 'object') {
        this.logger.log(
          `IP location found: ${result.data.regionName} - ${result.data.city}`,
        );
      } else {
        this.logger.warn(`IP location failed: ${result.msg}`);
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to fetch IP location', error);
      return {
        flag: false,
        msg: '获取IP定位失败',
        data: '',
      };
    }
  }
}

