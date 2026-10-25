import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import userModel from '../models/userModel.js';
import loginotp from '../models/loginotp.js';
import { sendLoginOtp } from '../config/mailer.js';


export const requestLoginOtp = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({
            email: email.trim().toLowerCase(),
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate a cryptographically secure 6-digit OTP.
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Store only the hash, never the plain OTP.
        const otpHash = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        // Replace any previously issued OTP for this user.
        await loginotp.deleteMany({ userId: user._id });

        await loginotp.create({
            userId: user._id,
            otpHash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            attempts: 0,
        });

        try {
            await sendLoginOtp(user.email, otp);
        } catch (mailError) {
            // Do not leave a usable OTP if email delivery fails.
            await loginotp.deleteMany({ userId: user._id });
            throw mailError;
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent to your registered email",
        });
    } catch (error) {
        console.error("Request login OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to send OTP. Please try again.",
        });
    }
};

// POST /auth/login/verify-otp
export const verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !/^\d{6}$/.test(String(otp || ""))) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 6-digit OTP",
            });
        }

        const user = await userModel.findOne({
            email: email.trim().toLowerCase(),
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        const otpRecord = await loginotp.findOne({
            userId: user._id,
        });

        if (!otpRecord || otpRecord.expiresAt <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired. Please log in again.",
            });
        }

        if (otpRecord.attempts >= 5) {
            await loginotp.deleteMany({ userId: user._id });

            return res.status(429).json({
                success: false,
                message: "Too many attempts. Request a new OTP.",
            });
        }

        const submittedHash = crypto
            .createHash("sha256")
            .update(String(otp))
            .digest("hex");

        const matches = crypto.timingSafeEqual(
            Buffer.from(submittedHash, "hex"),
            Buffer.from(otpRecord.otpHash, "hex")
        );

        if (!matches) {
            otpRecord.attempts += 1;
            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "Incorrect OTP",
            });
        }

        // Consume the OTP before issuing the session.
        await loginotp.deleteMany({ userId: user._id });

        // Match the payload to your existing auth middleware:
        // req.userId = decoded.id
        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure:true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Verify login OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
        });
    }
};
