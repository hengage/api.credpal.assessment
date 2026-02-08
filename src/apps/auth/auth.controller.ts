import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, ResendOtpDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterResponseDto, LoginResponseDto } from './dto/auth-response.dto';
import { APIS } from '@getbrevo/brevo';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: 'User registered successfully',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ApiResponseDto<undefined>,
    description: 'Email verified successfully',
  })
  async verify(@Body() verifyDto: VerifyEmailDto) {
    return this.authService.verify(verifyDto.email, verifyDto.otp);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ApiResponseDto<undefined>,
    description: 'OTP sent successfully',
  })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto.email);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'User logged in successfully',
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
