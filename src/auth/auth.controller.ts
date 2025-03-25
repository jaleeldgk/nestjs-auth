import { Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';



@ApiTags('Auth') // Groups the endpoints under "Auth" in Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email using OTP' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  signin(@Body() dto: AuthDto, @Req() request: Request) {
    return this.authService.signin(dto, request);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refresh token' })
  async refreshToken(@Body('token') token: string) {
    return this.authService.refreshToken(token);
  }

  // Request Password Reset (Send Email)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid email' })
  @Post('forgot-password')
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(forgotPasswordDto.email);
  }

  // Reset Password (Using Token)
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

}
