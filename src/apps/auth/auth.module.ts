import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { OtpModule } from 'src/common/services/otp/otp.module';
import { EmailModule } from 'src/common/services/notifications/email/email.module';

@Module({
  imports: [UsersModule, DatabaseModule, OtpModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
