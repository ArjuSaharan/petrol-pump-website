import userModel from "../models/userModel.js";

export const getuserdata=async (req,res)=>{
    try{
         const user = await userModel.findById(req.userId);
        if(!user){
            return res.json({success:false,message:"user not found"})
        }
        res.json({success:true,userData:{
            name:user.name,
            email:user.email,
        }})
    }
    catch(error){
        return res.json({success:false,message:error.message});
    }
}

