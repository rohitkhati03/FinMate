// utils/sendEmail.js
import nodemailer from "nodemailer";
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS,
    
  },
});

export default async function sendEmail(to, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"FinMate" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:auto">
          <h2>OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:8px;color:#4F46E5">${otp}</h1>
          <p>Valid for <strong>5 minutes</strong>.</p>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw error;
  }
}