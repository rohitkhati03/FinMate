import User from "../models/User.js";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { name, email, password, currency } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({
        message: "Name, email and password are required."
      });

    const existing = await User.findOne({ email });

    if (existing)
      return res.status(400).json({
        message: "Email already registered."
      });

    const hashed = await hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
      currency: currency || "INR"
    });

    const token = generateToken(user._id);

    res.status(201).json({
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
      message: "Registration failed.",
      error: err.message
    });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        message: "Invalid email or password."
      });

    const isMatch = await compare(password, user.password);

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