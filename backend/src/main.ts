import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SnakeCaseInterceptor } from './common/interceptors/snake-case.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { appConfig } from './common/config';
import userAgent from 'express-useragent';

async function bootstrap() {
  // Validate configuration on startup
  try {
    appConfig.validateConfig();
  } catch (error) {
    process.exit(1);
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set global API prefix
  app.setGlobalPrefix(appConfig.apiConfig.prefix);
  // Middleware to parse User-Agent header
  app.use(userAgent.express());

  // Serve static files for uploads
  const uploadsPath = join(process.cwd(), appConfig.uploadConfig.uploadPath);
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
    maxAge: '1y',
    immutable: true, // tell browsers/CDNs file never changes
  });

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable snake_case response transformation and BigInt/Date serialization
  app.useGlobalInterceptors(new SnakeCaseInterceptor());

  // Enable CORS for frontend
  // app.enableCors(appConfig.corsConfig);
  app.enableCors({
    origin: [
      'http://localhost:3000', // Frontend running locally
      'http://127.0.0.1:3000', // Alternative localhost
      'http://10.0.0.17:3000', // Docker network IP
      'http://frontend:3000', // Docker service name
      'http://localhost:3000', // Frontend running locally
      'http://127.0.0.1:3000', // Alternative localhost
      'http://10.1.1.43:3000', // Docker network IP
      'http://10.1.1.43:3003',
      'http://localhost:3003',
      'http://54.254.63.231:3003',
      'http://54.254.63.231:3000',
      'http://frontend:3000', // Docker service name
      'https://vian.serveo.net',
      'https://vian-api.serveo.net',
      'https://eyed-blonde-refresh-livestock.trycloudflare.com',
      'https://nextel-express-launches-specials.trycloudflare.com',
      /^http:\/\/10\.0\.0\.\d+:3000$/, // Regex cho Docker network range
      /^http:\/\/172\.16\.\d+\.\d+:3000$/, // Docker bridge network
      /^http:\/\/192\.168\.\d+\.\d+:3000$/, // Docker custom network
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
    ],
    credentials: true, // Allow cookies/auth headers
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  // app.setGlobalPrefix('api');

  await app.listen(appConfig.port);
}
bootstrap();
