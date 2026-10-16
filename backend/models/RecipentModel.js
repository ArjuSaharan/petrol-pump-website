import mongoose from "mongoose";

const RecipentSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usersRegister",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customerdetail",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase:true
  },
  fuelType: {
    type: String,
    enum: ["Petrol", "Diesel"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending"
  }
}, { timestamps: true });

const recipentModel = mongoose.model("Recipent", RecipentSchema);

export default recipentModel;
