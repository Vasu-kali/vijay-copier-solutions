"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, Lock, User, Phone, Eye, EyeOff, Printer, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name || form.name.length < 2) errs.name = "Name must be at least 2 characters";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
    if (!form.password || form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, phone: form.phone }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Registration failed"); return; }
      toast.success("Account created! Please sign in.");
      router.push("/auth/login");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: 480 }} className="animate-fade-in">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, var(--accent-primary), #0284c7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px var(--accent-glow)" }}>
              <Printer size={22} color="#fff" />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.1rem" }}>Vijay Copier</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>SOLUTIONS</div>
            </div>
          </Link>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 800, marginBottom: "0.5rem" }}>Create Account</h1>
          <p style={{ color: "var(--text-muted)" }}>Already have an account? <Link href="/auth/login" style={{ color: "var(--accent-secondary)", fontWeight: 600 }}>Sign In</Link></p>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            {[
              { field: "name", label: "Full Name", type: "text", icon: User, placeholder: "Your full name" },
              { field: "email", label: "Email Address", type: "email", icon: Mail, placeholder: "your@email.com" },
              { field: "phone", label: "Phone Number (Optional)", type: "tel", icon: Phone, placeholder: "+91 98765 43210" },
            ].map(({ field, label, type, icon: Icon, placeholder }) => (
              <div key={field}>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem" }}>{label}</label>
                <div style={{ position: "relative" }}>
                  <Icon size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input type={type} className={`input ${(errors as any)[field] ? "input-error" : ""}`} style={{ paddingLeft: "2.5rem" }} placeholder={placeholder}
                    value={(form as any)[field]}
                    onChange={e => update(field, e.target.value)}
                  />
                </div>
                {(errors as any)[field] && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.375rem" }}>{(errors as any)[field]}</p>}
              </div>
            ))}

            {["password", "confirm"].map((field) => (
              <div key={field}>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem" }}>{field === "password" ? "Password" : "Confirm Password"}</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input type={showPass ? "text" : "password"} className={`input ${(errors as any)[field] ? "input-error" : ""}`}
                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                    placeholder={field === "password" ? "Min. 8 characters" : "Repeat password"}
                    value={(form as any)[field]}
                    onChange={e => update(field, e.target.value)}
                  />
                  {field === "confirm" && (
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                {(errors as any)[field] && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.375rem" }}>{(errors as any)[field]}</p>}
              </div>
            ))}

            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              By creating an account, you agree to our <Link href="/terms" style={{ color: "var(--accent-secondary)" }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: "var(--accent-secondary)" }}>Privacy Policy</Link>.
            </p>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? <span className="spinner" /> : <ArrowRight size={18} />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
