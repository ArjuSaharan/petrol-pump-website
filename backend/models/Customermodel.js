import mongoose from "mongoose";

const customerSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"usersRegister",
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
     amount: {
      type: Number,
      default: 0,
    },

    totalPending: {
      type: Number,
      default: 0,
    },
    phone:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    }

})

const customerModel=mongoose.model("customerdetail",customerSchema);

export default customerModel;