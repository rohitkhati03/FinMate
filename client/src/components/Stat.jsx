export default function StatCard({ title, value, subtitle, icon, color = 'var(--primary)', trend }) {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: color, opacity: 0.08 }}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{title}</p>
          <p style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-1px' }}>{value}</p>
          {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</p>}
          {trend !== undefined && (
            <p style={{ fontSize: 12, marginTop: 4, color: trend >= 0 ? 'var(--danger)' : 'var(--success)' }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: color, opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          <span style={{ opacity: 6.67 }}>{icon}</span>
        </div>
      </div>
    </div>
  );
}
