import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { emailConfirmDto } from 'src/auth/dto/email-confirm.dto';
import { VerifyEmailDto } from 'src/auth/dto/verify-email.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto';
import { Request } from 'express';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private emailService: EmailService) { }

  async signup(dto: RegisterDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email is already taken');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          isVerified: false,
          emailVerifiedAt: null,
        },
      });

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

      await this.prisma.emailVerification.create({
        data: { userId: user.id, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }, // 10-minute expiry
      });

      // Send email confirmation OTP
      await this.emailService.sendEmailVerificationOTP(user.name, user.email, otp);
      return { message: 'Registration successful. Please verify your email using the OTP sent to you.', user };
    }
    catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }    //    return this.generateToken(user.id, user.email);
  }

  async signin(dto: AuthDto, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    // Capture IP & User-Agent
//    const ip = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Ensure user exist
    if (!user) {
      this.logAuthActivity(dto.email, 'failed', ip, userAgent, "User not exist", "");
      throw new NotFoundException('User not found');
    }
    // Ensure user is verified
    if (!user.isVerified) 
      {
        this.logAuthActivity(dto.email, 'failed', ip, userAgent, "Email not verified", "");
        throw new ForbiddenException('Please verify your email before logging in');
      }

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      this.logAuthActivity(dto.email, 'failed', ip, userAgent, "Password is invalid", "")
      throw new UnauthorizedException('Invalid credentials');
    }
    this.logAuthActivity(dto.email, 'success', ip, userAgent, "User logged in", user.id);
    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async refreshToken(token: string) {
    const decoded = this.jwtService.verify(token);
    return this.jwtService.sign({ sub: decoded.sub, email: decoded.email });
  }

  async requestPasswordReset(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new NotFoundException('User not found');

      // Delete any existing OTP for this user
      await this.prisma.passwordReset.deleteMany({
        where: { userId: user.id },
      });

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Ensures a 6-digit number

      await this.prisma.passwordReset.create({
        data: { userId: user.id, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }, // 10-minute expiry
      });

      // Send OTP via email
      await this.emailService.sendPasswordResetOTP(email, otp);

      return { message: 'Password reset OTP sent' };
    } catch (error) {
      //      throw new InternalServerErrorException(`${error}`);
      throw new NotFoundException('User not found!');
    }
  }
  async resetPassword(dto: ResetPasswordDto) {
    const { email, otp, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const passwordReset = await this.prisma.passwordReset.findFirst({
      where: { userId: user.id, otp: otp },
    });

    if (!passwordReset) throw new BadRequestException('Invalid OTP');

    if (passwordReset.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete OTP record after successful reset
    await this.prisma.passwordReset.delete({ where: { id: passwordReset.id } });

    return { message: 'Password updated successfully' };
  }



  async verifyEmail(dto: VerifyEmailDto) {
    const { email, otp } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const verificationRecord = await this.prisma.emailVerification.findFirst({
      where: { userId: user.id, otp },
    });

    if (!verificationRecord) throw new BadRequestException('Invalid OTP');

    if (verificationRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark user as verified and update verification timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, emailVerifiedAt: new Date() },
    });

    // Delete OTP record after successful verification
    await this.prisma.emailVerification.delete({ where: { id: verificationRecord.id } });

    return { message: 'Email verified successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return {
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      emailVerifiedAt: user.emailVerifiedAt,
    };
  }


  private async logAuthActivity(email: string, status: string, ip: string, userAgent: string, comments: string, userId?: string) {
    await this.prisma.authLog.create({
      data: {
        userId: userId,
        userEmail: email,
        status: status,
        ip,
        userAgent,
        comments
      },
    });
  }

}

