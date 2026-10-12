import mongoose from "mongoose";

const PaymentSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "usersRegister",
        required: true,
    },
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "customerdetail",
        required: true,
    },
    amount:{
        type:Number,
        required:true,
    },
    paymentType:{
        type:String,
        enum:["cash","online"],
        required:true,
    },
},{timestamps:true});

const paymentModel=mongoose.model("Payment",PaymentSchema);

export default paymentModel;