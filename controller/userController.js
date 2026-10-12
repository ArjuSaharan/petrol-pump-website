import express from 'express'
import userModel from '../models/userModel.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import "dotenv/config"
import cookieParser from 'cookie-parser';

export const userRegsiter = async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || !phone) {
        return res.json({ success: false, message: "fill the complete details" });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: "Enter valid 10 digit Indian phone number",
        });
    }
    try {
        const existemail = await userModel.findOne({
            $or: [{ email }, { phone }],
        });
        if (existemail) {
            return res.json({ success: false, message: "email and phone number already registered" });
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const user = new userModel.create({ name, email, phone, password: hashpassword });
        await user.save()

        // genrate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' })
        //store in cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.JWT_SECRET,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

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
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


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
            secure: process.env.JWT_SECRET,
            sameSite: 'strict',
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
            secure: process.env.JWT_SECRET,
            sameSite:'lax'
        })

        return res.json({ success: true, message: "user logout successfully" });
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}