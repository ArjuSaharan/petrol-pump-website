
import mongoose from "mongoose";

const loginOtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "usersRegister",
    index: true,
  },

  otpHash: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },

  attempts: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

export default mongoose.model("LoginOtp", loginOtpSchema);