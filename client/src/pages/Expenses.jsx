import { useState, useEffect } from 'react';
import { getExpenses, addExpense, deleteExpense, getSummary } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getCurrentMonth, CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORIES } from '../utils/helpers';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Expenses() {
  const { user } = useAuth();
  const [expenses,  setExpenses]  = useState([]);
  const [summary,   setSummary]   = useState({ summary: [], totalSpent: 0 });
  const [showModal, setShowModal] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState({ month: getCurrentMonth(), category: '' });
  const [form,      setForm]      = useState({
    amount: '', category: 'Food', note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { month: filter.month };
      if (filter.category) params.category = filter.category;
      const [expRes, sumRes] = await Promise.all([
        getExpenses(params),
        getSummary({ month: filter.month })
      ]);
      setExpenses(expRes.data);
      setSummary(sumRes.data);
    } catch { toast.error('Failed to load expenses'); }
    finally   { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filter.month, filter.category]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addExpense({ ...form, amount: parseFloat(form.amount) });
      toast.success('Expense added! 💸');
      setShowModal(false);
      setForm({ amount: '', category: 'Food', note: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch { toast.error('Failed to add expense'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      toast.success('Expense deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="page-container">
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Expenses</h1>
          <p className="text-muted">Track your daily spending</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16}/> Add Expense
        </button>
      </div>

      {summary.summary.length > 0 && (
        <div className="grid-4 mb-6">
          {summary.summary.slice(0, 4).map(s => (
            <div key={s._id} className="card" style={{ borderLeft: `3px solid ${CATEGORY_COLORS[s._id] || '#94A3B8'}` }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{CATEGORY_EMOJIS[s._id]} {s._id}</p>
              <p style={{ fontSize: 20, fontWeight: 700 }}>{formatCurrency(s.total, user?.currency)}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.count} transactions</p>
            </div>
          ))}
        </div>
      )}

      <div className="card mb-4" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Month</label>
            <input type="month" className="input" value={filter.month}
              onChange={e => setFilter({ ...filter, month: e.target.value })}/>
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Category</label>
            <select className="input" value={filter.category}
              onChange={e => setFilter({ ...filter, category: e.target.value })}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex-between mb-4">
          <h3 style={{ fontWeight: 700 }}>{loading ? 'Loading...' : `${expenses.length} transactions`}</h3>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger)' }}>
            Total: {formatCurrency(summary.totalSpent, user?.currency)}
          </span>
        </div>
        {loading ? (
          <p className="text-muted" style={{ textAlign: 'center', padding: 40 }}>Loading...</p>
        ) : expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No expenses found</p>
            <p className="text-muted">Add your first expense to get started</p>
          </div>
        ) : expenses.map(exp => (
          <div key={exp._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, fontSize: 18, background: (CATEGORY_COLORS[exp.category] || '#94A3B8') + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {CATEGORY_EMOJIS[exp.category] || '📦'}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{exp.note || exp.category}</p>
                <p className="text-muted">{formatDate(exp.date)} · {exp.category}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 700, color: 'var(--danger)' }}>-{formatCurrency(exp.amount, user?.currency)}</span>
              <button onClick={() => handleDelete(exp._id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <Trash2 size={16}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 style={{ fontWeight: 700, fontSize: 18 }}>Add Expense</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="label">Amount</label>
                <input className="input" type="number" placeholder="0.00" step="0.01" min="1"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required/>
              </div>
              <div className="form-group">
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Note (optional)</label>
                <input className="input" placeholder="e.g. Lunch at college canteen"
                  value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}/>
              </div>
              <div className="form-group">
                <label className="label">Date</label>
                <input className="input" type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} required/>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
