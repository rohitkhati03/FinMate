import express from "express";
import { register, login, getMe, updateProfile, verifyOTP, resendOtp } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import { loginLimit, optlimit, registerLimit } from "../middleware/ratelimiter.middleware.js";
import { validateLogin, validateRegister } from "../middleware/validation.middleware.js";

const router = express.Router();
//POST /api/auth/register 

router.post("/register",  registerLimit, validateRegister, register)
router.post("/login",loginLimit,validateLogin, login);
router.post("/verify-otp",optlimit, verifyOTP);
router.post("/resend-otp", resendOtp);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);

export default router;