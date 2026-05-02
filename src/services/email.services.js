import dotenv from "dotenv"
import nodemailer from "nodemailer"
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: `"FXAE Production" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Welcome to FXAE Production! 🚀",
    html: `
      <div style="font-family: sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 10px;">
        <h1 style="color: #3b82f6;">Welcome, ${userName}!</h1>
        <p style="font-size: 16px; color: #cccccc;">
          Thank you for joining <b>FXAE Production</b>. Your account will be accept by our Admin shortly.
        </p>
        <p style="font-size: 14px; color: #9ca3af;">
          Thank you for having patience, please note that after getting verified by our admin, full production features will be unlocked once you verify your email.
        </p>
        <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email error:", error);
  }
};



// 2. Function to send the OTP email
export const sendOTPEmail = async (userEmail, otp) => {
  const mailOptions = {
    from: `"FXAE Verification" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Your Verification Code - FXAE Production",
    html: `
      <div style="font-family: sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 10px; text-align: center;">
        <h1 style="color: #3b82f6;">Verify Your Email</h1>
        <p style="color: #cccccc;">Use the code below to unlock full production features:</p>
        <div style="background: #1a1a1a; padding: 20px; border: 1px solid #3b82f6; border-radius: 8px; display: inline-block; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffffff;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #666;">This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("OTP Email error:", error);
  }
};