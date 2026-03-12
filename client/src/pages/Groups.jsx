import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGroups, createGroup } from '../api';
import { Plus, X, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const EMOJIS = ['👥','✈️','🍕','🎉','🏕️','🎮','🚗','🏖️'];

export default function Groups() {
  const [groups,    setGroups]    = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [form,      setForm]      = useState({ name: '', description: '', emoji: '👥' });

  useEffect(() => {
    getGroups().then(r => setGroups(r.data)).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createGroup(form);
      setGroups([res.data, ...groups]);
      toast.success('Group created! 🎉');
      setShowModal(false);
      setForm({ name: '', description: '', emoji: '👥' });
    } catch { toast.error('Failed to create group'); }
  };

  return (
    <div className="page-container">
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Groups</h1>
          <p className="text-muted">Split expenses with friends</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16}/> New Group</button>
      </div>

      {loading ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: 40 }}>Loading groups...</p>
      ) : groups.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>👥</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No groups yet</h3>
          <p className="text-muted" style={{ marginBottom: 24 }}>Create a group for your next trip or dinner</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16}/> Create First Group</button>
        </div>
      ) : (
        <div className="grid-3">
          {groups.map(group => (
            <Link key={group._id} to={`/groups/${group._id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, background: 'var(--surface2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{group.emoji}</div>
                  <ArrowRight size={16} color="var(--text-muted)"/>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{group.name}</h3>
                {group.description && <p className="text-muted" style={{ marginBottom: 12 }}>{group.description}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                  <Users size={14}/> {group.members.length} members
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 style={{ fontWeight: 700, fontSize: 18 }}>Create Group</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="label">Choose Emoji</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {EMOJIS.map(e => (
                    <button type="button" key={e} onClick={() => setForm({ ...form, emoji: e })}
                      style={{ width: 44, height: 44, fontSize: 22, border: `2px solid ${form.emoji === e ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, background: form.emoji === e ? 'rgba(108,99,255,0.15)' : 'var(--surface2)', cursor: 'pointer' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="label">Group Name</label>
                <input className="input" placeholder="e.g. Goa Trip 2025"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required/>
              </div>
              <div className="form-group">
                <label className="label">Description (optional)</label>
                <input className="input" placeholder="e.g. Friends trip to Goa"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
