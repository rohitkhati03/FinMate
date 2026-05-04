import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔐 Generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

//  REGISTER 
export async function register(req, res) {
  try {
    const { name, email, password, phone, currency } = req.body;

    //  Validate input
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    //  Hash password (optimized)
    const hashedPassword = await bcrypt.hash(password, 8);

    //  Format phone
    const formattedPhone = phone.startsWith("+")
      ? phone
      : `+91${phone}`;

    //  Create user (rely on unique index for email)
    const user = await User.create({
      name,
      email,
      phone: formattedPhone,
      password: hashedPassword,
      currency: currency || "INR",
      isVerified: false
    });

    //  Generate token
    const token = generateToken(user._id);

    //  Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency
      }
    });

  } catch (err) {

    //  Handle duplicate email error (MongoDB)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: err.message
    });
  }
}

//  LOGIN 
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    //  Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    //  Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    //  Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
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
      success: false,
      message: "Login failed",
      error: err.message
    });
  }
}

//  GET ME 
export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: err.message
    });
  }
}

//  UPDATE PROFILE 
export async function updateProfile(req, res) {
  try {
    const { name, avatar, currency } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar, currency },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      user: updatedUser
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: err.message
    });
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 🔍 Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔐 Generate token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    // 📩 For project: log reset link
    const resetURL = `http://localhost:7000/reset-password/${token}`;
    console.log("Reset Link:", resetURL);

    return res.json({
      success: true,
      message: "Reset link generated (check console)"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in forgot password",
      error: error.message
    });
  }
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    // 🔐 Hash new password
    const hashed = await bcrypt.hash(password, 8);

    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      message: "Password reset successful"
    });

  } catch (err) {
    res.status(500).json({
      message: "Reset failed",
      error: err.message
    });
  }
};

