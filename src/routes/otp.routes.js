import express from "express";
import { otpRequest, verifyOtp } from "../controllers/Otp.controllers.js";
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/request-otp", verifyToken, otpRequest);
router.post("/verify-otp", verifyToken,verifyOtp);

export default router;