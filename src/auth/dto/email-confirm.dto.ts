import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches, IsString, Length } from 'class-validator';

export class emailConfirmDto {
  @ApiProperty({ example: 'user@example.com', description: 'Enter user email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: '6 digit OTP is required' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  @IsString()
  otp: string;
}
