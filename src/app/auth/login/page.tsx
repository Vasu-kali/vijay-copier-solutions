"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Printer, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-primary)" }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, var(--bg-secondary), #071428)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem", position: "relative", overflow: "hidden" }} className="auth-left">
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, var(--accent-primary), #0284c7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px var(--accent-glow)" }}>
            <Printer size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.1rem" }}>Vijay Copier</div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>SOLUTIONS</div>
          </div>
        </Link>
        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, marginBottom: "1rem" }}>
          Welcome <span className="gradient-text">Back!</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 400, marginBottom: "3rem" }}>
          Sign in to access your orders, track deliveries, and manage your account on India's leading xerox machine store.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {["10,000+ Happy Customers", "Nationwide Delivery", "24/7 Expert Support", "100% Genuine Products"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--success)", fontSize: "1.1rem" }}>✓</span> {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", minWidth: 0 }}>
        <div style={{ width: "100%", maxWidth: 420 }} className="animate-fade-in">
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>Sign In</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
            Don't have an account? <Link href="/auth/register" style={{ color: "var(--accent-secondary)", fontWeight: 600 }}>Register</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="email"
                  className={`input ${errors.email ? "input-error" : ""}`}
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                />
              </div>
              {errors.email && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.375rem" }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  className={`input ${errors.password ? "input-error" : ""}`}
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.375rem" }}>{errors.password}</p>}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link href="/auth/forgot-password" style={{ fontSize: "0.8125rem", color: "var(--accent-secondary)" }}>Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? <span className="spinner" /> : <ArrowRight size={18} />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>


        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .auth-left { display: none !important; } }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
