import express from "express";
import { register, login, getMe, updateProfile, forgotPassword,resetPassword } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import { loginLimit,  registerLimit } from "../middleware/ratelimiter.middleware.js";
import { validateLogin, validateRegister } from "../middleware/validation.middleware.js";

const router = express.Router();
//POST /api/auth/register 

router.post("/register", register)
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;