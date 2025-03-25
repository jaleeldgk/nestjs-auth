import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // True for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM'),
      to,
      subject,
      html,
    });
  }

  async sendEmailVerificationOTP(name: string, email: string, otp: string) {
    const html = `<h1>Email Verification</h1>
                  <h3>Hello ${name}</h3>
                  <p>Your OTP for email verification is: <strong>${otp}</strong></p>
                  <p>This OTP is valid for 10 minutes.</p>`;
  
    await this.sendMail(email, 'Verify Your Email', html);
  }
  
  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;
    const html = `<h1>Password Reset Request</h1><p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;
    await this.sendMail(email, 'Reset Your Password', html);
  }

  async sendPasswordResetOTP(email: string, otp: string) {
    const html = `<h1>Password Reset OTP</h1>
                  <p>Your OTP for resetting your password is: <strong>${otp}</strong></p>
                  <p>This OTP is valid for 10 minutes.</p>`;
  
    await this.sendMail(email, 'Password Reset OTP', html);
  }


}
