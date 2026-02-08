import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { UserDto } from 'src/apps/users/dto/user.dto';

class RegisterResponseDataDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;
}

class LoginResponseDataDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  token: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

export class RegisterResponseDto extends ApiResponseDto<RegisterResponseDataDto> {
  @ApiProperty({ type: RegisterResponseDataDto })
  data: RegisterResponseDataDto;
}

export class LoginResponseDto extends ApiResponseDto<LoginResponseDataDto> {
  @ApiProperty({ type: LoginResponseDataDto })
  data: LoginResponseDataDto;
}
