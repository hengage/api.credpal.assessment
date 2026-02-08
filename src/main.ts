import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentKeys } from './config/config.service';
import { ENV } from './config/env';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

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
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(app.get(Reflector)),
  );
  setupSwagger(app);
  await app.listen(ENV.PORT as EnvironmentKeys);
}
bootstrap().catch((e) => console.error('Error bootstrapping app:', e));
