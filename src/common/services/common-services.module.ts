import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [RedisModule, OtpModule],
  exports: [RedisModule, OtpModule],
})
export class CommonServicesModule {}
