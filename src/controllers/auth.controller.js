import { userModel } from '../models/authorisiedUser.model.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

export const requestAccess = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // 1. Check if user already exists in the database
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            if (existingUser.status === 'APPROVED') {
                return res.status(400).json({ message: "User is already approved and active." });
            }
            if (existingUser.status === 'PENDING') {
                return res.status(400).json({ message: "Access request is already pending admin approval." });
            }
            return res.status(400).json({ message: "Access request was previously rejected." });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        // 2. Create a new user with 'PENDING' status
        const newAuthorisedUser = new userModel({
            email,
            password: hashedPassword,
            name,
            status: 'PENDING'
        });

        await newAuthorisedUser.save();

        res.status(201).json({ 
            message: "Request sent successfully. Please wait for admin approval." 
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        

        // 1. CHECK STATUS FIRST
        if (user.status !== "APPROVED") {
            return res.status(403).json({ 
                success: false, 
                message: "Your account is pending approval. Please wait for the admin." 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // 3. GENERATE TOKEN & SET COOKIE
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        }).status(200).json({
            success: true,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        // 'req.userId' comes from your verifyToken middleware
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ success: false });

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};