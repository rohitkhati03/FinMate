import Expense from "../models/Expense.js";
import { Types } from "mongoose";

// POST /api/expenses
export async function addExpense(req, res) {
  try {
    // Take the data from request body
    const { amount, category, note, date } = req.body;
    // new expense doucument
    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      category,
      note,
      date: date || new Date()
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({
      message: "Failed to add expense.",
      error: err.message
    });
  }
}

// GET /api/expenses
export async function getExpenses(req, res) {
  try {
    // query parameters(filters)
    const { month, category, startDate, endDate } = req.query;
    //base query only fetch logged-in users's data
    let query = { userId: req.user.id };
    //filter by month(format: YYYY-MM)
    if (month) {
      const [year, m] = month.split("-");
      query.date = {
        $gte: new Date(year, m - 1, 1),
        $lte: new Date(year, m, 0, 23, 59, 59)
      };
    }
// filter by cutom date range 
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
// filtering by category
    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch expenses.",
      error: err.message
    });
  }
}

// GET /api/expenses/summary
export async function getSummary(req, res) {
  try {
    const { month } = req.query;

    const [year, m] = (month || new Date().toISOString().slice(0, 7)).split("-");
//MongoDB aggregation pipeline
    const summary = await Expense.aggregate([
      {
        //Match user+date range
        $match: {
          userId: new Types.ObjectId(req.user.id), //convert string to OBjectID
          date: {
            $gte: new Date(year, m - 1, 1),
            $lte: new Date(year, m, 0, 23, 59, 59)
          }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const totalSpent = summary.reduce((sum, s) => sum + s.total, 0);

    res.json({
      summary,
      totalSpent,
      month: `${year}-${String(m).padStart(2, "0")}`
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get summary.",
      error: err.message
    });
  }
}

// GET /api/expenses/trends
export async function getMonthlyTrends(req, res) {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const trends = await Expense.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(req.user.id),
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    res.json(trends);
  } catch (err) {
    res.status(500).json({
      message: "Failed to get trends.",
      error: err.message
    });
  }
}

// PUT /api/expenses/:id
export async function updateExpense(req, res) {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found."
      });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update expense.",
      error: err.message
    });
  }
}

// DELETE /api/expenses/:id
export async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found."
      });
    }

    res.json({
      message: "Expense deleted successfully."
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete expense.",
      error: err.message
    });
  }
}