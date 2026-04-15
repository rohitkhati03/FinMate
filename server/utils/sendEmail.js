import nodemailer from "nodemailer";

export default async function sendEmail(to, otp) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"FinMate" <finmate@test.com>',
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

  //  Open this URL in browser to see  OTP
  console.log("📧 View OTP email here:", nodemailer.getTestMessageUrl(info));
}