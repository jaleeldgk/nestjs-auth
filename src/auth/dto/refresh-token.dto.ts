// src/auth/dto/refresh-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh-token', description: 'It will be around 100-300 characters' })
  @IsString({ message: 'Refresh token must be a string' })
  @Length(100, 300, { message: 'Invalid refresh token' })
  refreshToken: string;
}
