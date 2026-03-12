import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import savingsVaultSchema from "../models/SavingsVault.js";

// POST /api/savings — create vault
router.post('/', auth, async (req, res) => {
  try {
    const { name, targetAmount, deadline, emoji } = req.body;
    const vault = await savingsVaultSchema.create({
      userId: req.user.id, name, targetAmount,
      deadline: deadline || null,
      emoji: emoji || '🏦'
    });
    res.status(201).json(vault);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/savings — get all vaults
router.get('/', auth, async (req, res) => {
  try {
    const vaults = await savingsVaultSchema.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(vaults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/savings/:id/deposit
router.post('/:id/deposit', auth, async (req, res) => {
  try {
    const { amount, note } = req.body;
    const vault = await savingsVaultSchema.findOne({ _id: req.params.id, userId: req.user.id });
    if (!vault) return res.status(404).json({ message: 'Vault not found.' });

    vault.currentAmount += Number(amount);
    vault.transactions.push({ type: 'deposit', amount: Number(amount), note: note || '' });
    if (vault.currentAmount >= vault.targetAmount) vault.status = 'achieved';

    await vault.save();
    res.json(vault);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/savings/:id/withdraw
router.post('/:id/withdraw', auth, async (req, res) => {
  try {
    const { amount, note } = req.body;
    const vault = await savingsVaultSchema.findOne({ _id: req.params.id, userId: req.user.id });
    if (!vault) return res.status(404).json({ message: 'Vault not found.' });
    if (vault.currentAmount < amount)
      return res.status(400).json({ message: 'Insufficient vault balance.' });

    vault.currentAmount -= Number(amount);
    vault.transactions.push({ type: 'withdrawal', amount: Number(amount), note: note || '' });
    if (vault.status === 'achieved' && vault.currentAmount < vault.targetAmount)
      vault.status = 'active';

    await vault.save();
    res.json(vault);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/savings/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await savingsVaultSchema.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Vault deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
