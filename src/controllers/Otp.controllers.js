import { userModel } from "../models/authorisiedUser.model.js";
import { generateOTP } from "../utilis/otpGenerator.utilis.js";
import { sendOTPEmail } from "../services/email.services.js";

export const otpRequest = async (req,res) => {
    const { email } = req.body;
  const otp = generateOTP();
  
  // Set expiration for 10 minutes from now
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  await userModel.findOneAndUpdate(
    { email }, 
    { otp, otpExpires: expires }
  );

  await sendOTPEmail(email, otp);
  res.json({ message: "OTP sent to your email!" });
}

export const verifyOtp = async (req,res) => {
  const { email, otp } = req.body;
  const user = await userModel.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Success! Clear OTP and set verified to true
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: "Email verified successfully!", isVerified: true });
}