import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import "../style/register.css"
export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', currency: 'INR' });
  const [loading, setLoading] = useState(false);
  // const { login }  = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      const res = await registerUser(form);
      toast.success('OTP sent to your email and phone ');

      navigate('/verify-otp', { state: { email: res.data.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ position: "relative", overflow: "hidden" }}>

  {/* 🔥 BACKGROUND STICKERS */}
  <div className="bg-sticker blue"></div>
  <div className="bg-sticker purple"></div>
  <div className="bg-sticker center"></div>

  <div style={{ width: '100%', maxWidth: 420, position: "relative", zIndex: 2 }}>

    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      <div className="auth-logo" onClick={() => navigate("/")}>💰</div>

      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Join FinMate</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
        Track smarter, save better
      </p>
    </div>

    <div className="card">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
        Create your account
      </h2>
          {/* FORM SAME AS YOUR CODE */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Full Name</label>
              <input className="input" placeholder="Arjun Sharma"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="label">Phone Number</label>
              <input
                className="input"
                type="tel"
                placeholder="+91XXXXXXXXXX"  // ✅ reminds user to add +91
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="label">Currency</label>
              <select className="input" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                <option value="INR">🇮🇳 Indian Rupee (INR)</option>
                <option value="USD">🇺🇸 US Dollar (USD)</option>
                <option value="EUR">🇪🇺 Euro (EUR)</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
         <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
        Already have an account?{" "}
        <Link to="/login" className="auth-link">Log in</Link>
      </p>
    </div>

  </div>
</div>
  );
}
