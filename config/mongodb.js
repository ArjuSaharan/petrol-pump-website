import mongoose from "mongoose";

export const connectDB= async()=>{
    mongoose.connection.on("connected",()=>{
        console.log("db is conected");
    })
    await mongoose.connect("mongodb://127.0.0.1:27017/userdetails")
}