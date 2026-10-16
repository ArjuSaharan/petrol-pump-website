import mongoose from "mongoose";
const fuelPriceSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"usersRegister",
        required:true,
    },
    petrol:{
        type:Number,
        required:true,
        default:0,
        min:0,
    },
    diesel:{
        type:Number,
        required:true,
        default:0,
        min:0,
    }
},{timestamps:true});

const priceModel=mongoose.model("FuelPrice",fuelPriceSchema);

export default priceModel;