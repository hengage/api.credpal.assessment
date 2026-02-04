import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentKeys } from './config/config.service';
import { ENV } from './config/env';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(ENV.PORT as EnvironmentKeys);
}
bootstrap().catch((e) => console.error('Error bootstrapping app:', e));
