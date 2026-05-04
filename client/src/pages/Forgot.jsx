import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api"; //  use your API file
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await forgotPassword({ email });

      toast.success(res.data.message || "Reset link generated (check console)");

      //  Optional: redirect to login
      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 16
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 60,
              height: 60,
              background: "var(--primary)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              margin: "0 auto 16px",
              cursor: "pointer"
            }}
            onClick={() => navigate("/")}
          >
            💰
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Forgot Password</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
            Enter your email to reset your password
          </p>
        </div>

        {/* CARD */}
        <div className="card">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
            Reset your password
          </h2>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="form-group">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* BUTTON */}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "12px", marginTop: 8 }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

          </form>

          {/* BACK TO LOGIN */}
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}