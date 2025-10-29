import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { VerifyCaptchaDto } from './dto/verify-captcha.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verifyCaptcha(
    @Body() verifyCaptchaDto: VerifyCaptchaDto,
    @Req() req: any,
  ) {
    const userIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    
    const isValid = await this.captchaService.verifyCaptcha(
      9, // Tencent Cloud Captcha type
      userIp,
      verifyCaptchaDto.ticket,
      verifyCaptchaDto.randstr,
      verifyCaptchaDto.captchaAppId,
      verifyCaptchaDto.appSecretKey,
    );

    return {
      success: isValid,
      message: isValid ? 'Captcha verification successful' : 'Captcha verification failed',
    };
  }
}
