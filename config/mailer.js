
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendLoginOtp = async (email, otp) => {
  return transporter.sendMail({
    from: `"Petrol Pump App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Login Verification OTP",
    text: `Your login OTP is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px">
        <h2>Login Verification</h2>
        <p>Use the following OTP to log in to your account:</p>
        <h1 style="letter-spacing:8px">${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
        <p>If you did not request this code, ignore this email.</p>
      </div>
    `,
  });
};

export default transporter;