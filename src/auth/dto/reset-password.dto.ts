import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@mail.com', description: 'Enter user email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: '6 digit OTP is required' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  @IsString()
  otp: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'New password (min 8 characters)' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsString()
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[\W_]/, { message: 'Password must contain at least one special character' })
  password: string;
}
