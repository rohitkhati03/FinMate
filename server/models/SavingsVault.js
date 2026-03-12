import mongoose from "mongoose";

const savingsVaultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  targetAmount: { type: Number, required: true, min: 1 },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date, default: null },
  emoji: { type: String, default: '🏦' },
  status: { type: String, enum: ['active', 'achieved', 'withdrawn'], default: 'active' },
  transactions: [{
    type: { type: String, enum: ['deposit', 'withdrawal'] },
    amount: { type: Number },
    note: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('SavingsVault', savingsVaultSchema);