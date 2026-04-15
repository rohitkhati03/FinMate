// importing essential modules
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// importing routes
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";
import budgetRoutes from "./routes/budgets.js";
import groupRoutes from "./routes/groups.js";
import savingsRoutes from "./routes/savings.js";
import ExpressMongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const app = express();
//helmet
app.use(helmet());
// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URI || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

//Mongo santizer - preventing mongo injection
app.use(ExpressMongoSanitize());
const globalLimiter = rateLimit({
  windowMs:15*60*100, // 15 min
  max:100,
  message:{
    success:false,
    message:"Too many request, please try again after some time "
  },
  standardHeaders:true,
  legacyHeaders:false,
})
app.use(globalLimiter);

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/savings", savingsRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "FinMate API Running ", version: "1.0.0" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});
// Connect DB and start server
const PORT = process.env.PORT || 7000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" MongoDB Connected");

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });
