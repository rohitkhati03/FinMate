import express from "express";
import auth from "../middleware/auth.js";
import {
  addExpense,
  getExpenses,
  getSummary,
  getMonthlyTrends,
  updateExpense,
  deleteExpense
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", auth, addExpense);
router.get("/", auth, getExpenses);
router.get("/summary", auth, getSummary);
router.get("/trends", auth, getMonthlyTrends);
router.put("/:id", auth, updateExpense);
router.delete("/:id", auth, deleteExpense);

export default router;