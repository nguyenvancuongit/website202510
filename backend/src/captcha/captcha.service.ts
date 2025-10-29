import { Injectable, BadRequestException } from '@nestjs/common';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';

@Injectable()
export class CaptchaService {
  private readonly client: InstanceType<typeof tencentcloud.captcha.v20190722.Client>;

  constructor() {
    // Initialize Tencent Cloud Captcha client
    this.client = new tencentcloud.captcha.v20190722.Client({
      credential: {
        secretId: process.env.TENCENT_SECRET_ID,
        secretKey: process.env.TENCENT_SECRET_KEY,
      },
      region: 'ap-beijing', // 根据你的需求调整region
      profile: {
        httpProfile: {
          endpoint: 'captcha.tencentcloudapi.com',
        },
      },
    });
  }

  async verifyCaptcha(
    captchaType: number,
    userIp: string,
    ticket: string,
    randstr: string,
    captchaAppId: string,
    appSecretKey: string,
  ): Promise<boolean> {
    try {
      const params = {
        CaptchaType: captchaType, // 9 for Tencent Cloud Captcha
        UserIp: userIp,
        Ticket: ticket,
        Randstr: randstr,
        CaptchaAppId: parseInt(captchaAppId),
        AppSecretKey: appSecretKey,
      };

      const response = await this.client.DescribeCaptchaResult(params);
      
      // Captcha verification is successful if CaptchaCode is 1
      return response.CaptchaCode === 1;
    } catch (error) {
      console.error('Captcha verification error:', error);
      throw new BadRequestException('Captcha verification failed');
    }
  }
}
