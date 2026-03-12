import express from "express";
import auth from "../middleware/auth.js";
import Budget from "../models/Budget.js";

const router = express.Router();

// POST /api/budgets — create or update budget for a month
router.post("/", auth, async (req, res) => {
  try {
    const { month, limits } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, month },
      { limits },
      { upsert: true, new: true, runValidators: true }
    );

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/budgets/:month
router.get("/:month", auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      userId: req.user.id,
      month: req.params.month
    });

    res.json(budget || { limits: {} });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;