import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { OtpModule } from 'src/common/services/otp/otp.module';
import { EmailModule } from 'src/common/services/notifications/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ENV } from 'src/config/env';
import { EnvironmentKeys } from 'src/config/config.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    OtpModule,
    EmailModule,
    PassportModule,
    JwtModule.register({
      secret: ENV.JWT_SECRET as EnvironmentKeys,
      signOptions: { expiresIn: ENV.JWT_EXPIRES_IN as number },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
