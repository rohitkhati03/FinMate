/**
 * Debt Simplification Algorithm — FinMate
 * Computes minimum transactions to settle debts in a group
 */

export function simplifyDebts(members, expenses) {

  // Step 1 — build net balance map
  const balance = {};
  members.forEach(m => { balance[m.toString()] = 0; });

  expenses.forEach(expense => {
    const payerId = expense.paidBy.toString();

    expense.splits.forEach(split => {
      if (split.settled) return;

      const debtorId = split.userId.toString();
      if (debtorId === payerId) return;

      balance[payerId]  = (balance[payerId]  || 0) + split.amount;
      balance[debtorId] = (balance[debtorId] || 0) - split.amount;
    });
  });

  // Step 2 — separate creditors and debtors
  const creditors = [];
  const debtors   = [];

  Object.entries(balance).forEach(([userId, amount]) => {
    if (amount > 0.01) creditors.push({ userId, amount });
    if (amount < -0.01) debtors.push({ userId, amount: Math.abs(amount) });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // Step 3 — greedy matching
  const transactions = [];
  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {

    const credit = creditors[i];
    const debt   = debtors[j];

    const amount = Math.min(credit.amount, debt.amount);

    if (amount > 0.01) {
      transactions.push({
        from: debt.userId,
        to: credit.userId,
        amount: Math.round(amount * 100) / 100
      });
    }

    credit.amount -= amount;
    debt.amount   -= amount;

    if (credit.amount < 0.01) i++;
    if (debt.amount < 0.01) j++;
  }

  return transactions;
}