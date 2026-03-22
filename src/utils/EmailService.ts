import nodemailer from 'nodemailer';
import { config } from '../config/config';
import { logger } from './logger';

console.log('EMAIL_USER:', config.email.user);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: config.email.user || '"Job Portal" <noreply@jobportal.com>',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('NODEMAILER ERROR:', error);
    logger.error('Error sending email:', error);
    throw error;
  }
};
