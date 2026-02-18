import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class OtpService {
  private readonly OTP_PREFIX = 'otp:';
  private readonly OTP_TTL_SECONDS = 10 * 60; // 10 minutes

  constructor(private redisService: RedisService) {}

  /**
   * Generate a 6-digit OTP
   */
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Store OTP in Redis with TTL
   */
  async storeOtp(email: string, otp: string): Promise<void> {
    const key = this.getOtpKey(email);
    await this.redisService.set(key, otp, this.OTP_TTL_SECONDS);
  }

  /**
   * Verify OTP against stored value
   */
  async verifyOtp(email: string, providedOtp: string): Promise<boolean> {
    const key = this.getOtpKey(email);
    const storedOtp = await this.redisService.get(key);

    if (!storedOtp || storedOtp !== providedOtp) {
      return false;
    }

    await this.redisService.del(key);
    return true;
  }

  /**
   * Get existing OTP without deleting it
   */
  async getExistingOtp(email: string): Promise<string | null> {
    const key = this.getOtpKey(email);
    return this.redisService.get(key);
  }

  /**
   * Check if OTP exists for email (for rate limiting)
   */
  async hasOtp(email: string): Promise<boolean> {
    const key = this.getOtpKey(email);
    const otp = await this.redisService.get(key);
    return otp !== null;
  }

  /**
   * Resend OTP - returns existing OTP or generates new one
   */
  async resendOtp(email: string): Promise<string> {
    const existingOtp = await this.getExistingOtp(email);
    if (existingOtp) {
      return existingOtp;
    }

    const otp = this.generateOtp();
    await this.storeOtp(email, otp);
    return otp;
  }

  /**
   * Get Redis key for OTP
   */
  private getOtpKey(email: string): string {
    return `${this.OTP_PREFIX}${email}`;
  }
}
