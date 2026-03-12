import mongoose from "mongoose";

const groupExpenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Dining', 'Travel', 'Trip', 'Entertainment', 'Groceries', 'Other'],
    default: 'Other'
  },
  splitType: { type: String, enum: ['equal', 'percentage', 'custom'], default: 'equal' },
  splits: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, default: 0 },
    settled: { type: Boolean, default: false }
  }],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('GroupExpense.model', groupExpenseSchema);
