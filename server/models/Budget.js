import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    month: {
      type: String,
      required: true
    },

    limit: {
      Food: { type: Number, default: 0 },
      Transport: { type: Number, default: 0 },
      Clothing: { type: Number, default: 0 },
      Outing: { type: Number, default: 0 },
      Groceries: { type: Number, default: 0 },
      Entertainment: { type: Number, default: 0 },
      Health: { type: Number, default: 0 },
      Miscellaneous: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

// prevent duplicate budget for same user + month
budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

export default mongoose.model("Budget", budgetSchema);