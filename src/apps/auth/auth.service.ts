import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/auth.dto';
import { User } from '../users/entities/user.entity';
import { AtomicTransactionService } from 'src/database/atomic-transaction.service';
import { EntityManager } from 'typeorm';
import { OtpService } from 'src/common/services/otp/otp.service';
import { EmailService } from 'src/common/services/notifications/email/email.notification';
import { Msgs } from 'src/common/utils/messages.utils';
import { JwtService } from '@nestjs/jwt';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { UserDto } from 'src/apps/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly atomicTransaction: AtomicTransactionService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<User> {
    return this.atomicTransaction.runInAtomic(
      async (txnManager: EntityManager) => {
        const user = await this.usersService.create(data, txnManager);

        // Generate and send OTP
        const otp = this.otpService.generateOtp();
        console.log('OTP:', otp);
        await this.otpService.storeOtp(user.email, otp);
        this.sendOtpEmail(user, otp).catch(() => {
          // prevent crash but don't fail registration
        });

        return user;
      },
    );
  }

  private async sendOtpEmail(user: User, otp: string): Promise<void> {
    await this.emailService.sendEmail({
      recipientEmail: user.email,
      recipientName: `${user.firstName} ${user.lastName}`,
      subject: 'Verify Your Email - OTP Code',
      templatePath: 'src/templates/otp-email.ejs',
      templateData: {
        otp,
        recipientName: `${user.firstName} ${user.lastName}`,
      },
    });
  }

  async verify(email: string, otp: string): Promise<boolean> {
    const isValid = await this.otpService.verifyOtp(email, otp);

    if (!isValid) {
      throw new BadRequestException(Msgs.auth.INVALID_OTP());
    }

    // Mark user as verified
    await this.usersService.markAsVerified(email);
    return true;
  }

  async resendOtp(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    // Get OTP (existing or new) and send email
    const otp = await this.otpService.resendOtp(email);
    await this.sendOtpEmail(user, otp);
  }

  async validateUser(
    email: User['email'],
    password: User['password'],
  ): Promise<User | null> {
    const user = await this.usersService.findOneOrNull({ email });
    const isValid = await user?.comparePassword(password);
    return isValid ? user : null;
  }

  async login(email: string, password: string): Promise<{ token: string; user: UserDto }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(Msgs.auth.INVALID_CREDENTIALS());
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    const userDto: UserDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return {
      token,
      user: userDto,
    };
  }
}
