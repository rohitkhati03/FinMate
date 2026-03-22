import express from "express";
const router = express.Router();
import groupSchema from "../models/Group.model.js";
import groupExpenseSchema from "../models/GroupExpense.model.js"
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import {simplifyDebts } from "../utils/debtSimplifier.js";
// POST /api/groups — create group

router.post('/', auth, async (req, res) => {
  try {
    const { name, description, emoji } = req.body;
    const group = await groupSchema.create({
      name, description, emoji: emoji || '👥',
      createdBy: req.user.id,
      members: [req.user.id]
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/groups — get user's groups
router.get('/', auth, async (req, res) => {
  try {
    const groups = await groupSchema.find({ members: req.user.id })
      .populate('members',   'name email avatar')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/groups/:id — single group
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await groupSchema.findById(req.params.id)
      .populate('members',   'name email avatar')
      .populate('createdBy', 'name');
    if (!group) return res.status(404).json({ message: 'Group not found.' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/groups/:id/members — add member by email
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user found with that email.' });

    const group = await groupSchema.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: user._id } },
      { new: true }
    ).populate('members', 'name email avatar');

    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/groups/:id/expenses — add group expense
router.post('/:id/expenses', auth, async (req, res) => {
  try {
    const { amount, description, category, splitType, participants, splits: customSplits, date } = req.body;

    // ✅ FIXED HERE
    const group = await groupSchema.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const memberIds = participants || group.members.map(m => m.toString());
    let splits = [];

    if (splitType === 'equal') {
      const share = amount / memberIds.length;
      splits = memberIds.map(userId => ({
        userId,
        amount: Math.round(share * 100) / 100,
        settled: false
      }));
    } else if (splitType === 'custom' && customSplits) {
      splits = customSplits;
    }

    const expense = await groupExpenseSchema.create({
      groupId: req.params.id,
      paidBy: req.user.id,
      amount,
      description,
      category,
      splitType,
      splits,
      date: date || new Date()
    });

    res.status(201).json(expense);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/groups/:id/expenses — get all expenses in group
router.get('/:id/expenses', auth, async (req, res) => {
  try {
    const expenses = await groupExpenseSchema.find({ groupId: req.params.id })
      .populate('paidBy',        'name avatar')
      .populate('splits.userId', 'name avatar')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/groups/:id/balances — simplified settlement plan
router.get('/:id/balances', auth, async (req, res) => {
  try {
    const group    = await groupSchema.findById(req.params.id);
    const expenses = await groupExpenseSchema.find({ groupId: req.params.id });
    if (!group) return res.status(404).json({ message: 'Group not found.' });

    const transactions = simplifyDebts(group.members, expenses);
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/groups/:id/settle — mark a split as settled
router.post('/:id/settle', auth, async (req, res) => {
  try {
    const { expenseId, userId } = req.body;
    const expense = await groupExpenseSchema.findOneAndUpdate(
      { _id: expenseId, groupId: req.params.id, 'splits.userId': userId },
      { $set: { 'splits.$.settled': true } },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense or split not found.' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default  router;
