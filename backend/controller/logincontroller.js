import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


export const login=async (req,res)=>{
    try{
        const {email,passowrd}=req.body;
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:true,message:'user not found'});
        }
        const isMatch=await bcrypt.compare(passowrd,user.password);
        if(!isMatch){
            return res.json({success:false,message:"invalid password"})
        }

        const token=jwt.sign(
            {
                id:user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn:'7d'
            }
        )

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })

        return res.json({success:false,message:"login successfully"});
    }
    catch(error){
        return res.json({success:false,message:error.message});
    }
}
