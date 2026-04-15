// utils/otp.js
import crypto from "crypto";

export const generateOTP = (secret) => {
  const counter = Math.floor(Date.now() / 300000); // 5 min window
  const hmac = crypto.createHmac("sha1", secret);
  hmac.update(Buffer.from(counter.toString()));
  const hash = hmac.digest("hex");
  return (parseInt(hash.slice(-6), 16) % 1000000)
    .toString()
    .padStart(6, "0");
};

export const verifyOTP = (token, secret) => {
  return token === generateOTP(secret);
};