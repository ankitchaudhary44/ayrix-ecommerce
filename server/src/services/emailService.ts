import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export class EmailService {
  private static getTransporter() {
    return nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: ENV.SMTP_PORT,
      secure: ENV.SMTP_PORT === 465,
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS
      }
    });
  }

  public static async sendWelcomeEmail(toEmail: string, name: string): Promise<boolean> {
    if (!ENV.SMTP_USER || ENV.SMTP_USER.includes('ethereal')) return true;
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: ENV.MAIL_FROM,
        to: toEmail,
        subject: 'Welcome to AYRIX | Luxury Redefined',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; text-align: center;">
            <h1 style="color: #000000; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;">AYRIX</h1>
            <div style="width: 40px; height: 2px; background-color: #000000; margin: 0 auto 30px auto;"></div>
            <h2 style="color: #111111; font-size: 20px; font-weight: normal; margin-bottom: 20px;">Welcome to the future of fit, ${name}.</h2>
            <p style="color: #666666; line-height: 1.8; font-size: 14px; margin-bottom: 30px;">
              Your AYRIX profile has been successfully created. You now have access to our precision fit-engine, real-time analytics, and premium tailored collections. Enjoy zero-return confidence across our entire catalog.
            </p>
            <a href="http://localhost:3000/shop" style="display: inline-block; padding: 14px 30px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">Explore Collections</a>
            <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eeeeee;">
              <p style="color: #999999; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">AYRIX Fit Engine &copy; ${new Date().getFullYear()}</p>
            </div>
          </div>
        `
      });
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  public static async sendLoginOtpEmail(toEmail: string, otp: string): Promise<boolean> {
    if (!ENV.SMTP_USER || ENV.SMTP_USER.includes('ethereal')) return true;
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: ENV.MAIL_FROM,
        to: toEmail,
        subject: 'AYRIX-FIT | Your Login OTP',
        text: `Welcome back to AYRIX-FIT! Your login OTP is: ${otp}`
      });
      return true;
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      return false;
    }
  }

  public static async sendRegisterOtpEmail(toEmail: string, otp: string): Promise<boolean> {
    if (!ENV.SMTP_USER || ENV.SMTP_USER.includes('ethereal')) return true;
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: ENV.MAIL_FROM,
        to: toEmail,
        subject: 'AYRIX-FIT | Verify your Registration',
        text: `Welcome to AYRIX-FIT! To complete your registration, please use this OTP: ${otp}`
      });
      return true;
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      return false;
    }
  }

  public static async sendFitReminderEmail(toEmail: string, productName: string, orderId: string): Promise<boolean> {
    if (!ENV.SMTP_USER || ENV.SMTP_USER.includes('ethereal')) return true;
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: ENV.MAIL_FROM,
        to: toEmail,
        subject: `How did your ${productName} fit? | AYRIX Fit Feedback`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a;">How was the fit?</h2>
            <p style="color: #334155; line-height: 1.6;">
              Your recent purchase of <strong>${productName}</strong> has been delivered. Please share your fit feedback so AYRIX can refine your future recommendations!
            </p>
          </div>
        `
      });
      return true;
    } catch (error) {
      console.error('Failed to send fit reminder email:', error);
      return false;
    }
  }

  public static async sendTicketReplyEmail(toEmail: string, message: string): Promise<boolean> {
    if (!ENV.SMTP_USER || ENV.SMTP_USER.includes('ethereal')) return true;
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: ENV.MAIL_FROM,
        to: toEmail,
        subject: `Update on your AYRIX Support Request`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a;">New Message Received</h2>
            <p style="color: #334155; line-height: 1.6;">
              An AYRIX Support Agent has replied to your ticket:
            </p>
            <blockquote style="background: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; color: #475569;">
              ${message}
            </blockquote>
            <p style="color: #64748b; font-size: 0.875rem;">
              You can reply by visiting your AYRIX dashboard.
            </p>
          </div>
        `
      });
      return true;
    } catch (error) {
      console.error('Failed to send ticket reply email:', error);
      return false;
    }
  }
}
