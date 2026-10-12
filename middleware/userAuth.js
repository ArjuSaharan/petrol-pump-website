import jwt from 'jsonwebtoken'
import "dotenv/config"

const userAuth=async (req,res,next)=>{
    console.log("coookies");
    const {token}=req.cookies;

    if(!token){
        return res.json({success:false,message:"not authorize login again"})
    }
    try{
        console.log("token found");
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET);

        if(!tokenDecode){
            return res.json({success:false,message:"invalid token"});
        }
        
        req.userId=tokenDecode.id;
        console.log("login user id: ",req.userId);

        next();
    }
    catch(error){
        return res.json({success:false,message:error.message});
    }
}

export default userAuth;