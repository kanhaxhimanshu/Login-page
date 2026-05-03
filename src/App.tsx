import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Types ─── */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; alpha: number;
  color: string;
}

/* ─── Particle Canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const colors = ["#00f5ff", "#b400ff", "#ff0090", "#00ff88", "#0066ff"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn particles
    const spawn = () => {
      const count = Math.floor((canvas.width * canvas.height) / 14000);
      particles.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    };
    spawn();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      const ps = particles.current;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(0,245,255,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      ps.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas id="particle-canvas" ref={canvasRef} />;
}

/* ─── Data Streams ─── */
const STREAM_CHARS = "01アイウエオABCDEF#%$@!";
const rnd = () => STREAM_CHARS[Math.floor(Math.random() * STREAM_CHARS.length)];
const randomStr = (len: number) => Array.from({ length: len }, rnd).join(" ");

function DataStreams() {
  const positions = [5, 12, 22, 35, 50, 65, 78, 88, 95];
  return (
    <>
      {positions.map((left, i) => (
        <div
          key={i}
          className="data-stream"
          style={{ left: `${left}%` }}
        >
          <span
            style={{
              animationDuration: `${8 + i * 2.3}s`,
              animationDelay: `${i * 1.1}s`,
            }}
          >
            {randomStr(20)}
          </span>
        </div>
      ))}
    </>
  );
}

/* ─── SVG Icons ─── */
const IconUser = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLock = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconCheck = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ─── Google Icon ─── */
const IconGoogle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const IconGithub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

/* ─── Main App ─── */
export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [, setTouched] = useState({ email: false, password: false });

  const validate = useCallback(() => {
    if (!email.trim()) return "NEURAL ID IS REQUIRED";
    if (!/\S+@\S+\.\S+/.test(email)) return "INVALID NEURAL ID FORMAT";
    if (!password) return "ACCESS KEY IS REQUIRED";
    if (password.length < 6) return "ACCESS KEY TOO SHORT — MIN 6 CHARS";
    return "";
  }, [email, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2200);
  };

  const handleChange = (field: "email" | "password", val: string) => {
    if (field === "email") setEmail(val);
    else setPassword(val);
    if (error) setError("");
  };

  return (
    <div style={{ position: "relative", minHeight: "100dvh" }}>
      {/* Backgrounds */}
      <ParticleCanvas />
      <div className="grid-floor" />
      <div className="scanlines" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <DataStreams />

      {/* Center Content */}
      <div className="page-center">
        <div className="card">

          {/* ── Success Overlay ── */}
          {success && (
            <div className="success-overlay">
              <div className="success-icon"><IconCheck /></div>
              <div className="success-text">ACCESS GRANTED</div>
              <div className="success-sub">INITIALIZING NEURAL LINK…</div>
              {/* Progress bar */}
              <div style={{
                width: "60%", height: 2,
                background: "rgba(0,255,136,0.15)",
                borderRadius: 2, overflow: "hidden",
                marginTop: 8
              }}>
                <div style={{
                  height: "100%",
                  background: "linear-gradient(90deg,#00ff88,#00f5ff)",
                  borderRadius: 2,
                  animation: "progressFill 1.8s ease forwards"
                }} />
              </div>
              <style>{`
                @keyframes progressFill {
                  from { width: 0; }
                  to   { width: 100%; }
                }
              `}</style>
            </div>
          )}

          {/* ── Header ── */}
          <div style={{ marginBottom: 28 }}>
            <div className="logo-ring">
              {/* Hexagon icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <polygon
                  points="16,2 28,9 28,23 16,30 4,23 4,9"
                  stroke="url(#hexGrad)" strokeWidth="1.5" fill="none"
                />
                <polygon
                  points="16,8 23,12 23,20 16,24 9,20 9,12"
                  fill="url(#hexGrad)" opacity="0.3"
                />
                <circle cx="16" cy="16" r="3" fill="url(#hexGrad)" />
                <defs>
                  <linearGradient id="hexGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00f5ff"/>
                    <stop offset="100%" stopColor="#b400ff"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="nexus-title">NEXUS AUTH</h1>
            <p className="nexus-subtitle">Secure Neural Interface v4.2</p>
          </div>

          {/* ── Divider ── */}
          <div className="cyber-divider">
            <span /><i>INITIALIZE SESSION</i><span />
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="input-group">
              <label className="input-label">Neural ID</label>
              <IconUser />
              <input
                className="cyber-input"
                type="email"
                placeholder="user@nexus.io"
                value={email}
                onChange={e => handleChange("email", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label">Access Key</label>
              <IconLock />
              <input
                className="cyber-input"
                type={showPass ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={e => handleChange("password", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-eye"
                onClick={() => setShowPass(s => !s)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPass ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="error-msg">
                <IconAlert /> {error}
              </div>
            )}

            {/* Remember / Forgot */}
            <div className="row-options">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span className="checkbox-box">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3"/>
                  </svg>
                </span>
                Remember Link
              </label>
              <button type="button" className="forgot-link">Forgot Key?</button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`btn-login${loading ? " loading" : ""}`}
            >
              {loading ? "" : "INITIALIZE →"}
            </button>
          </form>

          {/* ── Divider ── */}
          <div className="cyber-divider" style={{ margin: "18px 0 0" }}>
            <span /><i>OR SYNC VIA</i><span />
          </div>

          {/* ── Social ── */}
          <div className="social-row">
            <button type="button" className="btn-social">
              <IconGoogle /> Google
            </button>
            <button type="button" className="btn-social">
              <IconGithub /> GitHub
            </button>
          </div>

          {/* ── Register ── */}
          <div className="register-row">
            No neural link?&nbsp;
            <button type="button" className="register-link">Register Node</button>
          </div>

          {/* ── Status bar ── */}
          <div className="status-bar">
            <span className="status-dot" />
            <span>SYS ONLINE</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>AES-256</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>TLS 1.3</span>
          </div>

        </div>
      </div>
    </div>
  );
}
