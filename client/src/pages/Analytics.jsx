import { useState, useEffect } from 'react';
import { getSummary, getMonthlyTrends } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getCurrentMonth, CATEGORY_COLORS, CATEGORY_EMOJIS, getSpendingGrade } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';

export default function Analytics() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ summary: [], totalSpent: 0 });
  const [trends,  setTrends]  = useState([]);
  const [month,   setMonth]   = useState(getCurrentMonth());

  useEffect(() => {
    Promise.all([getSummary({ month }), getMonthlyTrends()])
      .then(([s, t]) => {
        setSummary(s.data);
        setTrends(t.data.map(item => ({
          name: new Date(item._id.year, item._id.month - 1)
            .toLocaleString('default', { month: 'short', year: '2-digit' }),
          amount: item.total
        })));
      });
  }, [month]);

  const grade = getSpendingGrade(summary.totalSpent, summary.totalSpent * 1.2);

  const ttStyle = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 };

  return (
    <div className="page-container">
      <div className="flex-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Analytics</h1>
          <p className="text-muted">Understand your spending patterns</p>
        </div>
        <input type="month" className="input" style={{ width: 180 }} value={month}
          onChange={e => setMonth(e.target.value)}/>
      </div>

      {/* Report Card */}
      <div className="card mb-6" style={{ background: `linear-gradient(135deg, var(--surface), ${grade.color}15)`, border: `1px solid ${grade.color}40` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="text-muted" style={{ marginBottom: 4 }}>Monthly Spending Report Card</p>
            <h2 style={{ fontSize: 32, fontWeight: 800 }}>
              Grade: <span style={{ color: grade.color }}>{grade.grade}</span>
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              Spent {formatCurrency(summary.totalSpent, user?.currency)} across {summary.summary.length} categories
            </p>
          </div>
          <div style={{ fontSize: 72 }}>
            {['A+','A'].includes(grade.grade) ? '🌟' : grade.grade === 'B' ? '👍' : grade.grade === 'C' ? '⚠️' : grade.grade === 'F' ? '🚨' : '📊'}
          </div>
        </div>
      </div>

      <div className="grid-2 mb-6">
        {/* Pie */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Category Breakdown</h3>
          {summary.summary.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: 40 }}>No data for this month</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={summary.summary} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={80}>
                    {summary.summary.map(entry => (
                      <Cell key={entry._id} fill={CATEGORY_COLORS[entry._id] || '#94A3B8'}/>
                    ))}
                  </Pie>
                  <Tooltip formatter={v => formatCurrency(v, user?.currency)} contentStyle={ttStyle}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 12 }}>
                {summary.summary.map(s => (
                  <div key={s._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <span style={{ fontSize: 16 }}>{CATEGORY_EMOJIS[s._id]}</span>{s._id}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{formatCurrency(s.total, user?.currency)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Line chart */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>6-Month Trend</h3>
          {trends.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: 40 }}>Not enough history</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false}/>
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}/>
                <Tooltip formatter={v => formatCurrency(v, user?.currency)} contentStyle={ttStyle}/>
                <Line type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)', r: 4 }}/>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bar */}
      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Monthly Spending Comparison</h3>
        {trends.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', padding: 40 }}>Add expenses to see trends</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v => formatCurrency(v, user?.currency)} contentStyle={ttStyle}/>
              <Bar dataKey="amount" fill="var(--primary)" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
