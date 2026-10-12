import customerModel from "../models/Customermodel.js";

export const getCustomeData=async(req,res)=>{
   try{
      const customers=await customerModel.find({
         userId:req.userId
      });
    return res.json({sucess:true,customers})

   }catch(error){
    return res.json({success:false,message:error.message});
   }
}

