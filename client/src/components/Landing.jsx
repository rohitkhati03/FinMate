import { useState, useEffect,  } from "react";
import { useNavigate } from "react-router-dom";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0d1117;
    --surface:   #161b27;
    --card:      #1c2333;
    --card-hover:#212940;
    --border:    rgba(255,255,255,0.07);
    --purple:    #6c63ff;
    --purple-d:  #5a52e0;
    --purple-g:  rgba(108,99,255,0.15);
    --purple-glow: rgba(108,99,255,0.25);
    --text:      #ffffff;
    --muted:     #8892a4;
    --muted2:    #4a5568;
    --green:     #34d399;
    --red:       #f87171;
    --gold:      #fbbf24;
  }

  html { scroll-behavior: smooth; }
  body {
    background: var(--bg); color: var(--text);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden; -webkit-font-smoothing: antialiased;
  }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 5%;
    background: rgba(13,17,23,0.85); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border); transition: box-shadow 0.3s;
  }
  nav.scrolled { box-shadow: 0 4px 32px rgba(0,0,0,0.4); }
  .logo { display: flex; align-items: center; gap: 0.65rem; }
  .logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #7c6fff, #5a52e0);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; box-shadow: 0 4px 14px rgba(108,99,255,0.45);
  }
  .logo-name { font-size: 1.2rem; font-weight: 700; letter-spacing: -0.02em; }
  .nav-links { display: flex; align-items: center; gap: 2rem; }
  .nav-links a {
    font-size: 0.85rem; color: var(--muted); text-decoration: none;
    font-weight: 500; transition: color 0.2s; cursor: pointer;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-btn {
    background: var(--purple); color: #fff;
    padding: 0.55rem 1.3rem; border-radius: 8px; border: none;
    font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; box-shadow: 0 0 20px var(--purple-glow);
  }
  .nav-btn:hover { background: var(--purple-d); transform: translateY(-1px); }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; align-items: center;
    padding: 7rem 5% 5rem; position: relative; overflow: hidden; gap: 4rem;
  }
  .hero-glow {
    position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 600px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(108,99,255,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-left { flex: 1; max-width: 560px; position: relative; z-index: 1; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--purple-g); border: 1px solid rgba(108,99,255,0.3);
    color: #a5a0ff; padding: 0.35rem 0.9rem; border-radius: 100px;
    font-size: 0.75rem; font-weight: 500; margin-bottom: 1.8rem;
    animation: fadeUp 0.6s ease both;
  }
  .hero-badge span { width: 6px; height: 6px; background: var(--purple); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  .hero h1 {
    font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800;
    line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1.2rem;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero h1 .accent { color: var(--purple); }
  .hero > .hero-left > p {
    font-size: 1rem; line-height: 1.75; color: var(--muted);
    max-width: 440px; margin-bottom: 2.2rem;
    animation: fadeUp 0.6s 0.2s ease both;
  }
  .hero-actions { display: flex; gap: 0.8rem; align-items: center; animation: fadeUp 0.6s 0.3s ease both; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  .btn-primary {
    background: var(--purple); color: #fff;
    padding: 0.8rem 1.8rem; border-radius: 10px; border: none;
    font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; box-shadow: 0 0 28px var(--purple-glow);
  }
  .btn-primary:hover { background: var(--purple-d); transform: translateY(-2px); box-shadow: 0 8px 32px var(--purple-glow); }
  .btn-ghost {
    background: transparent; color: var(--muted);
    padding: 0.8rem 1.5rem; border-radius: 10px; border: 1px solid var(--border);
    font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }

  /* Dashboard card */
  .hero-right { flex: 1; max-width: 460px; position: relative; z-index: 1; animation: fadeUp 0.7s 0.15s ease both; }
  .dash-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 1.6rem;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px var(--border);
  }
  .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }
  .dash-title { font-size: 0.72rem; color: var(--muted); font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
  .dash-tag { font-size: 0.68rem; background: rgba(52,211,153,0.12); color: var(--green); border: 1px solid rgba(52,211,153,0.2); padding: 0.2rem 0.55rem; border-radius: 6px; font-weight: 600; }
  .dash-balance { font-size: 2.4rem; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 0.2rem; }
  .dash-sub { font-size: 0.72rem; color: var(--muted); margin-bottom: 1.2rem; }
  .mini-bars { display: flex; align-items: flex-end; gap: 5px; height: 56px; margin-bottom: 1.2rem; }
  .mbar { border-radius: 4px 4px 0 0; flex: 1; background: rgba(108,99,255,0.2); }
  .mbar.hi { background: var(--purple); }
  .dash-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.8rem; }
  .dstat { background: var(--surface); border-radius: 10px; padding: 0.75rem; }
  .dstat-label { font-size: 0.62rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.3rem; }
  .dstat-val { font-size: 1.1rem; font-weight: 700; }
  .dstat-val.g { color: var(--green); }
  .dstat-val.r { color: var(--red); }

  /* STATS STRIP */
  .stats-strip {
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    background: var(--surface);
    display: grid; grid-template-columns: repeat(4,1fr); padding: 2.5rem 5%;
  }
  .sstat { text-align: center; }
  .sstat-n {
    font-size: 2.4rem; font-weight: 800; letter-spacing: -0.03em;
    background: linear-gradient(135deg,#fff,#a5a0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .sstat-d { font-size: 0.75rem; color: var(--muted); font-weight: 500; margin-top: 0.3rem; }

  /* FEATURES */
  .features { padding: 6rem 5%; }
  .sec-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--purple); margin-bottom: 0.8rem; }
  .sec-title { font-size: clamp(1.8rem,3.5vw,2.6rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 0.8rem; }
  .sec-sub { font-size: 0.95rem; color: var(--muted); line-height: 1.75; max-width: 400px; }
  .features-layout { display: grid; grid-template-columns: 1fr 1.4fr; gap: 5rem; align-items: center; }
  .feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .feat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 1.4rem; transition: all 0.25s;
  }
  .feat-card:hover { background: var(--card-hover); border-color: rgba(108,99,255,0.3); transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .feat-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--purple-g); border: 1px solid rgba(108,99,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; margin-bottom: 0.9rem;
  }
  .feat-name { font-size: 0.88rem; font-weight: 600; margin-bottom: 0.4rem; }
  .feat-desc { font-size: 0.76rem; color: var(--muted); line-height: 1.65; }

  /* HOW */
  .how { padding: 6rem 5%; background: var(--surface); }
  .steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; margin-top: 4rem; position: relative; }
  .steps::before {
    content:''; position: absolute; top: 28px; left: 15%; right: 15%;
    height: 1px; background: linear-gradient(90deg, transparent, rgba(108,99,255,0.4), transparent);
  }
  .step { text-align: center; padding: 1.5rem; }
  .step-circle {
    width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 1.2rem;
    background: var(--purple-g); border: 1px solid rgba(108,99,255,0.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; font-weight: 800; color: var(--purple);
  }
  .step-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.6rem; }
  .step-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.7; }

  /* TESTIMONIALS */
  .testimonials { padding: 6rem 5%; }
  .tgrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; margin-top: 4rem; }
  .tcard {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 1.6rem; transition: all 0.25s;
  }
  .tcard:hover { border-color: rgba(108,99,255,0.3); transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .stars { color: var(--gold); font-size: 0.82rem; margin-bottom: 1rem; letter-spacing: 2px; }
  .ttext { font-size: 0.82rem; color: var(--muted); line-height: 1.75; margin-bottom: 1.4rem; }
  .tauthor { display: flex; align-items: center; gap: 0.75rem; }
  .tavatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, var(--purple), #9c8fff);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.9rem;
  }
  .tname { font-size: 0.82rem; font-weight: 600; }
  .trole { font-size: 0.7rem; color: var(--muted); }

  /* PRICING */
  .pricing { padding: 6rem 5%; background: var(--surface); }
  .pgrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; margin-top: 4rem; }
  .pcard {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 2rem; position: relative; transition: all 0.25s;
  }
  .pcard:hover:not(.featured) { border-color: rgba(108,99,255,0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .pcard.featured {
    border-color: rgba(108,99,255,0.5);
    box-shadow: 0 0 0 1px rgba(108,99,255,0.2), 0 24px 64px rgba(108,99,255,0.15);
    background: linear-gradient(160deg,#1e2440,#1c2333);
  }
  .pbadge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: var(--purple); color:#fff; border-radius:100px;
    font-size:0.65rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
    padding:0.25rem 0.9rem; white-space:nowrap;
  }
  .ptier { font-size:0.72rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); margin-bottom:0.8rem; }
  .pamount { font-size:2.8rem; font-weight:800; letter-spacing:-0.04em; line-height:1; margin-bottom:0.25rem; }
  .pdesc { font-size:0.75rem; color:var(--muted); margin-bottom:1.6rem; }
  .pfeatures { list-style:none; margin-bottom:2rem; }
  .pfeat { display:flex; align-items:center; gap:0.6rem; font-size:0.8rem; color:var(--muted); padding:0.45rem 0; border-bottom:1px solid var(--border); }
  .pdot { width:6px; height:6px; border-radius:50%; background:var(--purple); flex-shrink:0; }
  .pbtn {
    width:100%; padding:0.8rem; border-radius:10px;
    font-family:'Inter',sans-serif; font-size:0.85rem; font-weight:600; cursor:pointer; transition:all 0.2s;
  }
  .pbtn-o { background:transparent; border:1px solid var(--border); color:var(--text); }
  .pbtn-o:hover { border-color:rgba(108,99,255,0.5); color:var(--purple); }
  .pbtn-s { background:var(--purple); border:1px solid var(--purple); color:#fff; box-shadow:0 0 24px var(--purple-glow); }
  .pbtn-s:hover { background:var(--purple-d); transform:translateY(-1px); }

  /* CTA */
  .cta { padding: 7rem 5%; text-align: center; position: relative; overflow: hidden; }
  .cta-glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(108,99,255,0.1) 0%, transparent 70%);
  }
  .cta-inner { position: relative; max-width: 540px; margin: 0 auto; }
  .cta-inner h2 { font-size: clamp(2rem,4vw,3rem); font-weight:800; letter-spacing:-0.03em; margin-bottom:1rem; }
  .cta-inner p { font-size:0.95rem; color:var(--muted); line-height:1.75; margin-bottom:2.5rem; }
  .cta-btns { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }

  /* FOOTER */
  footer { border-top:1px solid var(--border); background:var(--surface); padding:4rem 5% 2rem; }
  .footer-top { display:grid; grid-template-columns:1.6fr 1fr 1fr 1fr; gap:3rem; margin-bottom:3rem; }
  .fbrand p { font-size:0.8rem; color:var(--muted); line-height:1.75; margin-top:0.9rem; max-width:220px; }
  .fcol h4 { font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:1rem; }
  .fcol a { display:block; font-size:0.8rem; color:var(--muted); text-decoration:none; margin-bottom:0.55rem; transition:color 0.2s; cursor:pointer; }
  .fcol a:hover { color:var(--text); }
  .footer-bottom {
    border-top:1px solid var(--border); padding-top:1.5rem;
    display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;
  }
  .footer-bottom p { font-size:0.75rem; color:var(--muted2); }
  .footer-bottom span { color:var(--purple); }

  @media (max-width: 900px) {
    .nav-links a { display:none; }
    .hero { flex-direction:column; padding:6rem 5% 3rem; gap:2.5rem; }
    .hero-right { max-width:100%; }
    .stats-strip { grid-template-columns:repeat(2,1fr); }
    .features-layout { grid-template-columns:1fr; gap:2.5rem; }
    .steps { grid-template-columns:1fr; }
    .steps::before { display:none; }
    .tgrid,.pgrid { grid-template-columns:1fr; }
    .footer-top { grid-template-columns:1fr 1fr; }
    .footer-bottom { flex-direction:column; text-align:center; }
    .cta-btns { flex-direction:column; align-items:center; }
  }
`;

const bars = [35, 58, 42, 72, 50, 88, 65, 95, 55, 80, 70, 100];

const features = [
  { icon: "📊", name: "Smart Budgeting", desc: "AI adapts your budget based on real spending patterns each month." },
  { icon: "⚡", name: "Auto Tracking", desc: "Every transaction auto-categorized — zero manual entry required." },
  { icon: "🎯", name: "Goal Planner", desc: "Set milestones. Get smart projections. Hit targets faster." },
  { icon: "📈", name: "Investment Watch", desc: "Monitor your portfolio, returns, and market pulse in one place." },
  { icon: "🔔", name: "Bill Alerts", desc: "Smart reminders so you never pay a late fee again." },
  { icon: "🔐", name: "Bank-grade Security", desc: "256-bit encryption with biometric authentication on every login." },
];

const testimonials = [
  { text: "Finmate is the only finance app I've actually kept using. Clean, fast, and just works. Paid off my card in 4 months.", name: "Priya S.", role: "Freelance Designer", init: "P" },
  { text: "The investment tracker syncs everything and gives me a clear picture without drowning me in data. Exactly what I needed.", name: "Rahul M.", role: "Software Engineer", init: "R" },
  { text: "I've tried six finance apps. This is the first one that felt built for someone like me. Simple, powerful, no fluff.", name: "Ananya K.", role: "Product Manager", init: "A" },
];

const plans = [
  { tier:"Starter", price:"₹0", desc:"Free forever", feats:["3 accounts linked","Basic expense tracking","Monthly summary report","Email support"], pBtn:"pbtn-o", label:"Get Started" },
  { tier:"Pro", price:"₹49", desc:"/ month · billed monthly", feats:["Unlimited accounts"," Budget suggestions","Goal & investment tracking","Priority support","Export reports"], pBtn:"pbtn-s", label:"Start Free Trial", featured:true },
  { tier:"Family", price:"₹99", desc:"/ month · up to 5 members", feats:["Everything in Pro","5 member profiles","Shared budget boards","Family spending insights","Dedicated advisor"], pBtn:"pbtn-o", label:"Start Free Trial" },
];

export default function FinmateLanding() {
  const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="logo">
          <div className="logo-icon">💰</div>
          <span className="logo-name">FinMate</span>
        </div>
        <div className="nav-links">
          <a onClick={() => go("features")}>Features</a>
          <a onClick={() => go("how")}>How it works</a>
          <a onClick={() => go("pricing")}>Pricing</a>
          <button className="nav-btn"  onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-left">
          <div className="hero-badge"><span />Now in beta · 12,000+ users joined</div>
          <h1>Your smart<br /><span className="accent">finance</span> companion</h1>
          <p>Finmate tracks your spending, manages budgets, and grows your savings — beautifully, automatically, and securely.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => go("cta")}>Start for free</button>
            <button className="btn-ghost" onClick={() => go("features")}>See features →</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="dash-card">
            <div className="dash-header">
              <span className="dash-title">Total Balance</span>
              <span className="dash-tag">↑ +8.4% this month</span>
            </div>
            <div className="dash-balance">₹2,48,650</div>
            <div className="dash-sub">Across 4 linked accounts</div>
            <div className="mini-bars">
              {bars.map((h, i) => <div key={i} className={`mbar${i === bars.length - 1 ? " hi" : ""}`} style={{ height: `${h}%` }} />)}
            </div>
            <div className="dash-stats">
              <div className="dstat"><div className="dstat-label">Income</div><div className="dstat-val g">+₹85K</div></div>
              <div className="dstat"><div className="dstat-label">Expenses</div><div className="dstat-val r">−₹36K</div></div>
              <div className="dstat"><div className="dstat-label">Saved</div><div className="dstat-val">₹48K</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-strip">
        {[["12K+","Active users"],["₹4.2Cr","Tracked monthly"],["98%","Uptime SLA"],["4.9★","User rating"]].map(([n,d],i)=>(
          <div className="sstat" key={i}><div className="sstat-n">{n}</div><div className="sstat-d">{d}</div></div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" className="features">
        <div className="features-layout">
          <div>
            <div className="sec-label">Features</div>
            <h2 className="sec-title">Everything you need.<br />Nothing you don't.</h2>
            <p className="sec-sub">Built for clarity over complexity. Every feature earns its place in your financial life.</p>
          </div>
          <div className="feat-grid">
            {features.map((f,i)=>(
              <div className="feat-card" key={i}>
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-name">{f.name}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="how">
        <div className="sec-label">Process</div>
        <h2 className="sec-title">Up and running in minutes.</h2>
        <div className="steps">
          {[
            {n:"01",t:"Connect Accounts",d:"Link your bank accounts, cards, and wallets securely via 256-bit encryption. Done in under 2 minutes."},
            {n:"02",t:"Set Your Goals",d:"Tell Finmate what you're saving for. We'll build a smart plan and adjust it as your life changes."},
            {n:"03",t:"Watch It Work",d:"Automated tracking, smart nudges, and real-time insights — all without lifting a finger."},
          ].map((s,i)=>(
            <div className="step" key={i}>
              <div className="step-circle">{s.n}</div>
              <div className="step-title">{s.t}</div>
              <div className="step-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="testimonials">
        <div className="sec-label">Testimonials</div>
        <h2 className="sec-title">People who made the switch.</h2>
        <div className="tgrid">
          {testimonials.map((t,i)=>(
            <div className="tcard" key={i}>
              <div className="stars">★★★★★</div>
              <p className="ttext">"{t.text}"</p>
              <div className="tauthor">
                <div className="tavatar">{t.init}</div>
                <div><div className="tname">{t.name}</div><div className="trole">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing">
        <div className="sec-label">Pricing</div>
        <h2 className="sec-title">Simple, honest pricing.</h2>
        <p className="sec-sub">No hidden fees. Cancel anytime. Start free and upgrade when ready.</p>
        <div className="pgrid">
          {plans.map((p,i)=>(
            <div className={`pcard${p.featured?" featured":""}`} key={i}>
              {p.featured && <span className="pbadge">Most Popular</span>}
              <div className="ptier">{p.tier}</div>
              <div className="pamount">{p.price}</div>
              <div className="pdesc">{p.desc}</div>
              <ul className="pfeatures">
                {p.feats.map((f,j)=><li className="pfeat" key={j}><span className="pdot"/>{f}</li>)}
              </ul>
              <button className={`pbtn ${p.pBtn}`}>{p.label}</button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="cta">
        <div className="cta-glow"/>
        <div className="cta-inner">
          <div className="sec-label">Get Started</div>
          <h2>Take control of your finances today.</h2>
          <p>Join thousands who've simplified their financial life with Finmate. No credit card required to start.</p>
          <div className="cta-btns">
            <button className="btn-primary"  onClick={() => navigate("/register")}>Create free account</button>
            <button className="btn-ghost">Book a demo →</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div className="fbrand">
            <div className="logo"><div className="logo-icon">💰</div><span className="logo-name">FinMate</span></div>
            <p>A minimal finance companion built for clarity, control, and confidence.</p>
          </div>
          {[
            {h:"Product",links:["Features","Pricing","Changelog","Roadmap"]},
            {h:"Company",links:["About","Blog","Careers","Press"]},
            {h:"Legal",links:["Privacy","Terms","Security","Cookies"]},
          ].map((col,i)=>(
            <div className="fcol" key={i}>
              <h4>{col.h}</h4>
              {col.links.map((l,j)=><a key={j}>{l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© 2025 FinMate. All rights reserved.</p>
          <p>Made with <span>♥</span> in Dehradun, India</p>
        </div>
      </footer>
    </>
  );
}
