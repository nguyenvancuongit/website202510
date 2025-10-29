import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../common/config';

export interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.SMTP.HOST,
      port: EMAIL_CONFIG.SMTP.PORT,
      secure: EMAIL_CONFIG.SMTP.SECURE,
      auth: {
        user: EMAIL_CONFIG.SMTP.AUTH.USER,
        pass: EMAIL_CONFIG.SMTP.AUTH.PASS,
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const { to, subject, template, context } = options;

    let htmlContent = '';

    // Simple template handling - you can expand this with a proper template engine
    switch (template) {
      case EMAIL_CONFIG.TEMPLATES.EMAIL_VERIFICATION_CODE:
        htmlContent = this.getEmailVerificationCodeTemplate(context);
        break;
      case EMAIL_CONFIG.TEMPLATES.PASSWORD_SENT:
        htmlContent = this.getPasswordSentTemplate(context);
        break;
      case EMAIL_CONFIG.TEMPLATES.PASSWORD_RESET:
        htmlContent = this.getPasswordResetTemplate(context);
        break;
      case EMAIL_CONFIG.TEMPLATES.WELCOME:
        htmlContent = this.getWelcomeTemplate(context);
        break;
      default:
        htmlContent = `<p>Hello ${context.fullName || 'User'}</p>`;
    }

    const mailOptions = {
      from: `"${EMAIL_CONFIG.FROM_NAME}" <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('邮件发送失败');
    }
  }

  private getEmailVerificationCodeTemplate(
    context: Record<string, any>,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>验证码 - Vian Stats</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f8f9fa; padding: 30px; text-align: center; }
          .code { display: inline-block; background-color: #28a745; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Vian Stats</h1>
          </div>
          <div class="content">
            <h2>邮箱验证码</h2>
            <p>您正在注册 Vian Stats 账户，验证码如下：</p>
            <div class="code">${context.code}</div>
            <p>验证码有效期为 ${context.expiresIn}，请尽快使用。</p>
            <p>如果您没有注册 Vian Stats 账户，请忽略此邮件。</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Vian Stats. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordSentTemplate(context: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>您的登录密码 - Vian Stats</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f8f9fa; padding: 30px; }
          .password { display: inline-block; background-color: #dc3545; color: white; padding: 15px 20px; font-size: 18px; font-weight: bold; border-radius: 5px; margin: 20px 0; font-family: monospace; }
          .footer { text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>注册成功！</h1>
          </div>
          <div class="content">
            <h2>您的登录信息</h2>
            <p>恭喜您成功注册 Vian Stats！您的登录信息如下：</p>
            <p><strong>邮箱：</strong> ${context.email}</p>
            <p><strong>密码：</strong> ${context.password}</p>
            <p><strong>重要提醒：</strong></p>
            <ul>
              <li>请妥善保管您的密码</li>
              <li>建议您登录后立即修改密码</li>
              <li>不要将密码泄露给他人</li>
            </ul>
            <p>现在您可以使用邮箱和密码登录 Vian Stats 了！</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Vian Stats. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetTemplate(context: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>重置您的密码</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f8f9fa; padding: 30px; }
          .button { display: inline-block; background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>密码重置</h1>
          </div>
          <div class="content">
            <h2>重置您的密码</h2>
            <p>亲爱的 ${context.fullName}，</p>
            <p>我们收到了重置您密码的请求。请点击下面的链接重置您的密码：</p>
            <p style="text-align: center;">
              <a href="${context.resetLink}" class="button">重置密码</a>
            </p>
            <p>此链接将在 ${context.expiresIn} 后过期。</p>
            <p>如果您没有请求重置密码，请忽略此邮件。您的密码不会被更改。</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Vian Stats. All rights reserved.</p>
            <p>如果按钮无法点击，请复制以下链接到浏览器地址栏：<br>
            ${context.resetLink}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeTemplate(context: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>欢迎加入 Vian Stats</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f8f9fa; padding: 30px; }
          .footer { text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>欢迎加入 Vian Stats！</h1>
          </div>
          <div class="content">
            <h2>注册成功！</h2>
            <p>亲爱的 ${context.fullName}，</p>
            <p>恭喜您成功注册 Vian Stats！您现在可以开始探索我们的内容和功能。</p>
            <p>如果您有任何问题，请随时联系我们的客服团队。</p>
            <p>再次欢迎您的加入！</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Vian Stats. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
