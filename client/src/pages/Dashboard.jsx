import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSummary, getMonthlyTrends, getGroups, getVaults } from '../api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/Stat';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, getCurrentMonth, CATEGORY_COLORS, getSpendingGrade } from '../utils/helpers';
import { ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ summary: [], totalSpent: 0 });
  const [trends,  setTrends]  = useState([]);
  const [groups,  setGroups]  = useState([]);
  const [vaults,  setVaults]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSummary({ month: getCurrentMonth() }),
      getMonthlyTrends(),
      getGroups(),
      getVaults()
    ]).then(([s, t, g, v]) => {
      setSummary(s.data);
      setTrends(t.data.map(item => ({
        name: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
        amount: item.total
      })));
      setGroups(g.data.slice(0, 3));
      setVaults(v.data.filter(v => v.status === 'active').slice(0, 3));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const grade = getSpendingGrade(summary.totalSpent, summary.totalSpent * 1.2);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) return (
    <div className="page-container">
      <p className="text-muted" style={{ marginTop: 40, textAlign: 'center' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>{greeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-muted mt-1">Here's your financial overview</p>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        <StatCard title="Spent This Month" value={formatCurrency(summary.totalSpent, user?.currency)} icon="💸" color="var(--danger)"/>
        <StatCard title="Categories Used"  value={summary.summary.length} subtitle="out of 8 categories" icon="📊" color="var(--primary)"/>
        <StatCard title="Active Groups"    value={groups.length} icon="👥" color="var(--warning)"/>
        <StatCard title="Saving Goals"     value={vaults.length} icon="🎯" color="var(--success)"/>
      </div>

      {/* Charts */}
      <div className="grid-2 mb-6">
        <div className="card">
          <div className="flex-between mb-4">
            <h3 style={{ fontWeight: 700 }}>Spending Breakdown</h3>
            <span style={{ background: grade.color + '20', color: grade.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              Grade: {grade.grade}
            </span>
          </div>
          {summary.summary.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No expenses this month yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={summary.summary} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={80}>
                    {summary.summary.map(entry => (
                      <Cell key={entry._id} fill={CATEGORY_COLORS[entry._id] || '#94A3B8'}/>
                    ))}
                  </Pie>
                  <Tooltip formatter={v => formatCurrency(v, user?.currency)}
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {summary.summary.map(s => (
                  <span key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[s._id], display: 'inline-block' }}/>
                    {s._id}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Monthly Trends</h3>
          {trends.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Not enough data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trends}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}/>
                <Tooltip formatter={v => formatCurrency(v, user?.currency)}
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}/>
                <Bar dataKey="amount" fill="var(--primary)" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Groups + Vaults */}
      <div className="grid-2">
        <div className="card">
          <div className="flex-between mb-4">
            <h3 style={{ fontWeight: 700 }}>Your Groups</h3>
            <Link to="/groups" style={{ color: 'var(--primary)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              View all <ArrowRight size={14}/>
            </Link>
          </div>
          {groups.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: '24px 0' }}>No groups yet. Create one!</p>
          ) : groups.map(group => (
            <Link key={group._id} to={`/groups/${group._id}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 40, height: 40, background: 'var(--surface2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{group.emoji}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{group.name}</p>
                  <p className="text-muted">{group.members.length} members</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="card">
          <div className="flex-between mb-4">
            <h3 style={{ fontWeight: 700 }}>Savings Vaults</h3>
            <Link to="/savings" style={{ color: 'var(--primary)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              View all <ArrowRight size={14}/>
            </Link>
          </div>
          {vaults.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: '24px 0' }}>No active savings goals.</p>
          ) : vaults.map(vault => {
            const pct = Math.min((vault.currentAmount / vault.targetAmount) * 100, 100);
            return (
              <div key={vault._id} style={{ marginBottom: 16 }}>
                <div className="flex-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{vault.emoji} {vault.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct.toFixed(0)}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--success)', borderRadius: 3, transition: 'width 0.5s ease' }}/>
                </div>
                <div className="flex-between" style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatCurrency(vault.currentAmount)}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatCurrency(vault.targetAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
