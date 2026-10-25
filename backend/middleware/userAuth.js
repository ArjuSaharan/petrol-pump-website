import jwt from 'jsonwebtoken'
import "dotenv/config"

const userAuth=async (req,res,next)=>{
    const {token}=req.cookies;
    console.log(req.cookies)
    if(!token){
        return res.json({success:false,message:"not authorize login again"})
    }
    try{
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET);

        if(!tokenDecode){
            return res.json({success:false,message:"invalid token"});
        }
        
        req.userId=tokenDecode.id;
        next();
    }
    catch(error){
        return res.json({success:false,message:error.message});
    }
}

export default userAuth;
