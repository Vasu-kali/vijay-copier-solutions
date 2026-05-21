"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Package, MapPin, Heart, Settings, ChevronRight, User } from "lucide-react";

export default function AccountPage() {
  const { data: session } = useSession();

  const links = [
    { href: "/account/orders", icon: Package, label: "My Orders", desc: "Track and manage your purchases" },
    { href: "/account/wishlist", icon: Heart, label: "Wishlist", desc: "Your saved products" },
    { href: "/account/addresses", icon: MapPin, label: "Addresses", desc: "Manage delivery addresses" },
    { href: "/account/settings", icon: Settings, label: "Account Settings", desc: "Update profile and password" },
  ];

  return (
    <div style={{ padding: "2rem 0", minHeight: "60vh" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Profile header */}
        <div className="card" style={{ padding: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-primary), #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "1.5rem" }}>{session?.user?.name}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{session?.user?.email}</p>
            {(session?.user as any)?.role === "ADMIN" && <span className="badge badge-gold" style={{ marginTop: "0.5rem" }}>Admin</span>}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {links.map(({ href, icon: Icon, label, desc }) => (
            <Link key={href} href={href} className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "rgba(14,165,233,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={20} style={{ color: "var(--accent-primary)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{label}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>{desc}</div>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-muted)", marginTop: 2 }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

