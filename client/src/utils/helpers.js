export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const CATEGORY_COLORS = {
  Food:          '#F59E0B',
  Transport:     '#3B82F6',
  Clothing:      '#EC4899',
  Outing:        '#8B5CF6',
  Groceries:     '#22C55E',
  Entertainment: '#EF4444',
  Health:        '#14B8A6',
  Miscellaneous: '#94A3B8'
};

export const CATEGORY_EMOJIS = {
  Food:          '🍕',
  Transport:     '🚗',
  Clothing:      '👗',
  Outing:        '🎉',
  Groceries:     '🛒',
  Entertainment: '🎬',
  Health:        '💊',
  Miscellaneous: '📦'
};

export const CATEGORIES = Object.keys(CATEGORY_COLORS);

export const getSpendingGrade = (spent, budget) => {
  if (!budget || budget === 0) return { grade: 'N/A', color: '#94A3B8' };
  const ratio = spent / budget;
  if (ratio <= 0.6)  return { grade: 'A+', color: '#22C55E' };
  if (ratio <= 0.8)  return { grade: 'A',  color: '#22C55E' };
  if (ratio <= 0.95) return { grade: 'B',  color: '#F59E0B' };
  if (ratio <= 1.0)  return { grade: 'C',  color: '#F59E0B' };
  return { grade: 'F', color: '#EF4444' };
};
