import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function VerifyOTP() {
  const [otp, setOtp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer]     = useState(300); // 5 min countdown
  const [canResend, setCanResend] = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const email      = location.state?.email; // passed from Register.jsx

  // redirect away if no email in state
  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  // countdown timer
  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Please enter a 6-digit OTP');
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp });
      login(res.data.token, res.data.user);         // ✅ token issued only after OTP
      toast.success(`Welcome to FinMate, ${res.data.user.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email });
      toast.success('New OTP sent!');
      setTimer(300);
      setCanResend(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 60, height: 60, background: 'var(--primary)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>🔐</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>Verify OTP</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Sent to <strong>{email}</strong></p>
        </div>
        <div className="card">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Enter your OTP</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
            Check your email and phone for a 6-digit code.
          </p>
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label className="label">6-Digit OTP</label>
              <input
                className="input"
                placeholder="••••••"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} // numbers only
                style={{ letterSpacing: 8, fontSize: 24, textAlign: 'center' }}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8 }}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          {/* Timer + Resend */}
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
            {canResend ? (
              <button onClick={handleResend}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                Resend OTP
              </button>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>
                Resend OTP in <strong style={{ color: 'var(--primary)' }}>{formatTime(timer)}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}