import express from "express";
import { register, login, getMe, updateProfile, verifyOTP, resendOtp } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtp);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);

export default router;