import { useState, useEffect } from 'react';
import { getVaults, createVault, depositToVault, withdrawFromVault, deleteVault } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import { Plus, X, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const VAULT_EMOJIS = ['🏦','✈️','📱','🎮','👟','📚','🚗','🏖️','💍','🎓'];

export default function Savings() {
  const { user } = useAuth();
  const [vaults,      setVaults]      = useState([]);
  const [showCreate,  setShowCreate]  = useState(false);
  const [activeVault, setActiveVault] = useState(null);
  const [transType,   setTransType]   = useState('deposit');
  const [transAmount, setTransAmount] = useState('');
  const [form, setForm] = useState({ name: '', targetAmount: '', deadline: '', emoji: '🏦' });

  const fetchVaults = () => getVaults().then(r => setVaults(r.data));
  useEffect(() => { fetchVaults(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createVault({ ...form, targetAmount: parseFloat(form.targetAmount) });
      toast.success('Vault created! 🎉');
      setShowCreate(false);
      setForm({ name: '', targetAmount: '', deadline: '', emoji: '🏦' });
      fetchVaults();
    } catch { toast.error('Failed to create vault'); }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    try {
      if (transType === 'deposit')
        await depositToVault(activeVault._id, { amount: parseFloat(transAmount) });
      else
        await withdrawFromVault(activeVault._id, { amount: parseFloat(transAmount) });
      toast.success(transType === 'deposit' ? 'Deposited! 💰' : 'Withdrawn!');
      setActiveVault(null); setTransAmount('');
      fetchVaults();
    } catch (err) { toast.error(err.response?.data?.message || 'Transaction failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vault?')) return;
    try { await deleteVault(id); toast.success('Vault deleted'); fetchVaults(); }
    catch { toast.error('Failed to delete'); }
  };

  const totalSaved  = vaults.reduce((s, v) => s + v.currentAmount, 0);
  const totalTarget = vaults.reduce((s, v) => s + v.targetAmount,  0);
  const achieved    = vaults.filter(v => v.status === 'achieved').length;

  return (
    <div className="page-container">
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Savings Vault</h1>
          <p className="text-muted">Save toward your goals, one step at a time</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16}/> New Vault</button>
      </div>

      <div className="grid-3 mb-6">
        <div className="card" style={{ borderLeft: '3px solid var(--success)' }}>
          <p className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>Total Saved</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(totalSaved, user?.currency)}</p>
        </div>
        <div className="card" style={{ borderLeft: '3px solid var(--primary)' }}>
          <p className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>Total Target</p>
          <p style={{ fontSize: 24, fontWeight: 800 }}>{formatCurrency(totalTarget, user?.currency)}</p>
        </div>
        <div className="card" style={{ borderLeft: '3px solid var(--warning)' }}>
          <p className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>Goals Achieved</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--warning)' }}>🏆 {achieved}</p>
        </div>
      </div>

      {vaults.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏦</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No savings vaults yet</h3>
          <p className="text-muted" style={{ marginBottom: 24 }}>Create a vault for your next big goal</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16}/> Create First Vault</button>
        </div>
      ) : (
        <div className="grid-3">
          {vaults.map(vault => {
            const pct        = Math.min((vault.currentAmount / vault.targetAmount) * 100, 100);
            const isAchieved = vault.status === 'achieved';
            return (
              <div key={vault._id} className="card" style={{ border: isAchieved ? '2px solid var(--success)' : '1px solid var(--border)', position: 'relative' }}>
                {isAchieved && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--success)', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>🏆 ACHIEVED!</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, background: 'var(--surface2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{vault.emoji}</div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 15 }}>{vault.name}</h3>
                    {vault.deadline && <p className="text-muted" style={{ fontSize: 11 }}>By {new Date(vault.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>}
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div className="flex-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(vault.currentAmount, user?.currency)}</span>
                    <span className="text-muted" style={{ fontSize: 13 }}>of {formatCurrency(vault.targetAmount, user?.currency)}</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: isAchieved ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), var(--success))', borderRadius: 4, transition: 'width 0.5s ease' }}/>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{pct.toFixed(1)}% saved</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px' }}
                    onClick={() => { setActiveVault(vault); setTransType('deposit'); }}>
                    <TrendingUp size={14}/> Deposit
                  </button>
                  <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px' }}
                    onClick={() => { setActiveVault(vault); setTransType('withdraw'); }}>
                    <TrendingDown size={14}/> Withdraw
                  </button>
                  <button onClick={() => handleDelete(vault._id)}
                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Vault Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 style={{ fontWeight: 700 }}>Create Savings Vault</h3>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="label">Pick Emoji</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {VAULT_EMOJIS.map(e => (
                    <button type="button" key={e} onClick={() => setForm({ ...form, emoji: e })}
                      style={{ width: 44, height: 44, fontSize: 22, border: `2px solid ${form.emoji === e ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, background: form.emoji === e ? 'rgba(108,99,255,0.15)' : 'var(--surface2)', cursor: 'pointer' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="label">Vault Name</label>
                <input className="input" placeholder="e.g. Goa Trip 🏖️"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required/>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="label">Target Amount</label>
                  <input className="input" type="number" min="1" placeholder="10000"
                    value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: e.target.value })} required/>
                </div>
                <div className="form-group">
                  <label className="label">Deadline (optional)</label>
                  <input className="input" type="date"
                    value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}/>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Create Vault</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit/Withdraw Modal */}
      {activeVault && (
        <div className="modal-overlay" onClick={() => setActiveVault(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 style={{ fontWeight: 700 }}>
                {transType === 'deposit' ? '💰 Deposit Into' : '💸 Withdraw From'} {activeVault.emoji} {activeVault.name}
              </h3>
              <button onClick={() => setActiveVault(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <p className="text-muted mb-4">
              Balance: <strong style={{ color: 'var(--text)' }}>{formatCurrency(activeVault.currentAmount, user?.currency)}</strong>
            </p>
            <form onSubmit={handleTransaction}>
              <div className="form-group">
                <label className="label">Amount</label>
                <input className="input" type="number" min="1" placeholder="0.00" step="0.01"
                  value={transAmount} onChange={e => setTransAmount(e.target.value)} required/>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setActiveVault(null)}>Cancel</button>
                <button type="submit" className={`btn ${transType === 'deposit' ? 'btn-success' : 'btn-danger'}`} style={{ flex: 2, justifyContent: 'center' }}>
                  {transType === 'deposit' ? 'Deposit' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
