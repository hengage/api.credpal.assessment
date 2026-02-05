import { IsEmail } from 'class-validator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  email: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @MinLength(8)
  @MaxLength(128)
  @IsString()
  @IsNotEmpty()
  password: string;
}
