import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroup, getGroupExpenses, addGroupExpense, getGroupBalances, addMember } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Plus, X, UserPlus, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GroupDetail() {
  const { id }     = useParams();
  const { user }   = useAuth();
  const [group,    setGroup]    = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [showExpModal,  setShowExpModal]  = useState(false);
  const [showMemModal,  setShowMemModal]  = useState(false);
  const [memberEmail,   setMemberEmail]   = useState('');
  const [expForm, setExpForm] = useState({
    amount: '', description: '', category: 'Dining',
    splitType: 'equal', date: new Date().toISOString().split('T')[0]
  });

  const fetchAll = async () => {
    try {
      const [grpRes, expRes, balRes] = await Promise.all([
        getGroup(id), getGroupExpenses(id), getGroupBalances(id)
      ]);
      setGroup(grpRes.data);
      setExpenses(expRes.data);
      setBalances(balRes.data.transactions);
    } catch { toast.error('Failed to load group'); }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await addGroupExpense(id, { ...expForm, amount: parseFloat(expForm.amount) });
      toast.success('Expense added!');
      setShowExpModal(false);
      fetchAll();
    } catch { toast.error('Failed to add expense'); }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await addMember(id, memberEmail);
      toast.success('Member added!');
      setShowMemModal(false);
      setMemberEmail('');
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add member'); }
  };

  if (!group) return <div className="page-container"><p className="text-muted" style={{ marginTop: 40 }}>Loading group...</p></div>;

  return (
    <div className="page-container">
      <div className="flex-between mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/groups" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}><ArrowLeft size={20}/></Link>
          <div style={{ fontSize: 40 }}>{group.emoji}</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>{group.name}</h1>
            {group.description && <p className="text-muted">{group.description}</p>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowMemModal(true)}><UserPlus size={16}/> Add Member</button>
          <button className="btn btn-primary" onClick={() => setShowExpModal(true)}><Plus size={16}/> Add Expense</button>
        </div>
      </div>

      <div className="grid-2">
        {/* Expenses */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Expenses ({expenses.length})</h3>
          {expenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🧾</div>
              <p className="text-muted">No expenses yet. Add the first one!</p>
            </div>
          ) : expenses.map(exp => (
            <div key={exp._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="flex-between">
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{exp.description}</p>
                  <p className="text-muted">Paid by {exp.paidBy?.name} · {formatDate(exp.date)}</p>
                </div>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{formatCurrency(exp.amount)}</span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {exp.splits?.map((split, i) => (
                  <span key={i} style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 20,
                    background: split.settled ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: split.settled ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {split.userId?.name}: {formatCurrency(split.amount)} {split.settled ? '✓' : '⏳'}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Balances */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>💸 Who Owes Whom</h3>
            {balances.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <p style={{ fontWeight: 600 }}>All settled up!</p>
                <p className="text-muted">No pending dues</p>
              </div>
            ) : balances.map((t, i) => {
              const from = group.members?.find(m => m._id === t.from);
              const to   = group.members?.find(m => m._id === t.to);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{from?.name || 'Member'}</span>
                  <ArrowRight size={14} color="var(--danger)"/>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{to?.name || 'Member'}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--danger)' }}>{formatCurrency(t.amount)}</span>
                </div>
              );
            })}
          </div>

          {/* Members */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Members ({group.members?.length})</h3>
            {group.members?.map(member => (
              <div key={member._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                  {member.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{member.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{member.email}</p>
                </div>
                {member._id === group.createdBy?._id && (
                  <span style={{ marginLeft: 'auto', fontSize: 10, background: 'rgba(108,99,255,0.15)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 20 }}>Admin</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showExpModal && (
        <div className="modal-overlay" onClick={() => setShowExpModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 style={{ fontWeight: 700 }}>Add Group Expense</h3>
              <button onClick={() => setShowExpModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label className="label">Amount</label>
                <input className="input" type="number" placeholder="0.00" min="1" step="0.01"
                  value={expForm.amount} onChange={e => setExpForm({ ...expForm, amount: e.target.value })} required/>
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <input className="input" placeholder="e.g. Dinner at Barbeque Nation"
                  value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} required/>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="label">Category</label>
                  <select className="input" value={expForm.category} onChange={e => setExpForm({ ...expForm, category: e.target.value })}>
                    {['Dining','Travel','Trip','Entertainment','Groceries','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Split Type</label>
                  <select className="input" value={expForm.splitType} onChange={e => setExpForm({ ...expForm, splitType: e.target.value })}>
                    <option value="equal">Equal Split</option>
                    <option value="custom">Custom Split</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="label">Date</label>
                <input className="input" type="date" value={expForm.date} onChange={e => setExpForm({ ...expForm, date: e.target.value })}/>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowExpModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemModal && (
        <div className="modal-overlay" onClick={() => setShowMemModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 style={{ fontWeight: 700 }}>Add Member</h3>
              <button onClick={() => setShowMemModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label className="label">Friend's Email</label>
                <input className="input" type="email" placeholder="friend@example.com"
                  value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required/>
                <p className="text-muted" style={{ marginTop: 6 }}>They must have a FinMate account</p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowMemModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
