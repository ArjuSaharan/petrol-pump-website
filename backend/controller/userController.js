import express from 'express'
import userModel from '../models/userModel.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import "dotenv/config"
import cookieParser from 'cookie-parser';


export const userRegsiter = async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !phone) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all the required details",
        });
    }

    if (!/^[6-9]\d{9}$/.test(String(phone))) {
        return res.status(400).json({
            success: false,
            message: "Enter a valid 10-digit Indian phone number",
        });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await userModel.findOne({
            $or: [
                { email: normalizedEmail },
                { phone: String(phone) },
            ],
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    existingUser.email === normalizedEmail
                        ? "Email is already registered"
                        : "Phone number is already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user correctly
        const user = await userModel.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: String(phone),
            password: hashedPassword,
        });

        // Generate JWT
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        // Store JWT in an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to register user",
        });
    }
};



// user login
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: "fill the complete detail" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "invalid email" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({ success: false, message: "invalid password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure:true,
            sameSite: 'none',
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({ success: true, message: "login successfully" });
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

// logout 

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite:'none',
             path: "/"
        })

        return res.json({ success: true, message: "user logout successfully" });
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
