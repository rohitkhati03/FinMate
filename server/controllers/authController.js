import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import sendSMS from "../utils/sendSMS.js";
import { generateOTP,verifyOTP as checkOTP } from "../utils/otp.js";

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { name, email, password, phone,  currency } = req.body;

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    if (!name || !email || !password || !phone )
      return res.status(400).json({
        message: "Name, email , phone  and password are required."
      });

    const existing = await User.findOne({ email });

    if (existing)
      return res.status(400).json({
        message: "Email already registered."
      });

    const hashed = await bcrypt.hash(password, 12);
    const secret = email + process.env.OTP_SECRET;
    const otp= generateOTP(secret);

    try{
      await sendEmail(email, otp);
      // await sendSMS(phone, otp);
    }catch(err){
      return res.status(500).json({message:"Failed to send otp. Check your email/phone number"});
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      otp,
      otpExpiry: new Date(Date.now() + 5 * 60 *1000),
      currency: currency || "INR",
      isVerified:false,
    });

  
  
    res.status(201).json({   
     message:"OTP sent to your email and phone. Please veer",
     email, // seding back email so frotend knows where to redirect 
    });

  } catch (err) {
    res.status(500).json({
      message: "Registration failed.",
      error: err.message
    });
  }
}

// verify OTP
export  async function verifyOTP(req,res) {
  try{
    //take the otp from the client
    const{email, otp}= req.body;
    //check wethe the email is valid or not
    const user = await User.findOne({email});
    if(!user)
      return res.status(404).json({message:"User not found"});

    if(!user.otpExpiry || new Date()> user.otpExpiry)
      return res.status(400).json({message:"OTP has expired. Please request a new otp."});

    const secret = email + process.env.OTP_SECRET;
    const isValid = checkOTP(otp, secret);

    if(!isValid)
    return res.status(400).json({message:"Invalid OTP"});

    user.isVerified = true;
    user.otp= undefined;
    user.otpExpiry= undefined;
    await user.save();

    const token = generateToken(user._id);

  res.status(200).json({
    message:"Account verified successfully ",
    token,
    user:{ id: user._id, name: user.name, email:user.email}
  }) 

  }
  catch(error){
    res.status(500).json({message:"Verification failed ", error:error.message});
  }
}

// Resend OTP
export async function resendOtp(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) 
      return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
       return res.status(400).json({ message: "User already verified" });

    const secret = email + process.env.OTP_SECRET;
    const otp = generateOTP(secret);

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendEmail(email, otp);
    await sendSMS(user.phone, otp);

    res.json({ message: "OTP resent successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Resend failed", error: err.message });
  }
};


// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        message: "Invalid email or password."
      });
      
      if(!user.isVerified)
        return res.status(403).json({
      message: "Account not verified. Please verify  first "})

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        message: "Invalid email or password."
      });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Login failed.",
      error: err.message
    });
  }
}

// GET /api/auth/me
export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user)
      return res.status(404).json({
        message: "User not found."
      });

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user.",
      error: err.message
    });
  }
}

// PUT /api/auth/profile
export async function updateProfile(req, res) {
  try {
    const { name, avatar, currency } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar, currency },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: "Profile update failed.",
      error: err.message
    });
  }
}