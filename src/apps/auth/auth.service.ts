import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/auth.dto';
import { User } from '../users/entities/user.entity';
import { AtomicTransactionService } from 'src/database/atomic-transaction.service';
import { EntityManager } from 'typeorm';
import { OtpService } from 'src/common/services/otp/otp.service';
import { EmailService } from 'src/common/services/notifications/email/email.notification';
import { Msgs } from 'src/common/utils/messages.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly atomicTransaction: AtomicTransactionService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
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

  async verifyEmail(email: string, otp: string): Promise<boolean> {
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
}
