// src/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {

  @ApiProperty({ example: 'John Doe', description: 'Full User name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Your name must be at least 3 characters long' })
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: 'StrongPassword123!', description: 'User password' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[\W_]/, { message: 'Password must contain at least one special character' })
  password: string;

  @ApiProperty({ example: 'USER', enum: Role, required: false, description: 'User role' })
  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role, must be USER or ADMIN' })
  role?: Role;
}
