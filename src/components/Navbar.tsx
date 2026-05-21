"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import CartDrawer from "./CartDrawer";
import {
  ShoppingCart, Search, Menu, X, User, Package,
  LayoutDashboard, LogOut, Heart, ChevronDown, Phone, Mail
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const cartCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <>
      {/* Top bar */}
      <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <a href="tel:+919951487200" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Phone size={12} /> +91 99514 87200</a>
            <a href="mailto:mallepally.vijay@gmail.com" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Mail size={12} /> mallepally.vijay@gmail.com</a>
          </div>
          <span>Free Delivery on orders above ₹50,000 | Nationwide Service</span>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(5,11,24,0.95)" : "var(--bg-primary)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: "1px solid var(--border-color)",
        transition: "all 0.3s ease",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1rem" }}>
          
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent-primary), #0284c7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px var(--accent-glow)", fontWeight: 900, fontSize: "1.1rem", color: "#fff"
            }}>S</div>
            <div>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1 }}>Vijay Copier</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>SOLUTIONS</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: "flex", gap: "0.25rem", marginLeft: "1.5rem", flex: 1 }} className="desktop-nav">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "All Machines" },
              { href: "/products?category=office", label: "Office" },
              { href: "/products?category=commercial", label: "Commercial" },
              { href: "/products?category=industrial", label: "Industrial" },
              { href: "/products?featured=true", label: "Deals" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                padding: "0.5rem 0.875rem", borderRadius: "var(--radius-md)",
                color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500,
                transition: "var(--transition)", whiteSpace: "nowrap"
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = "var(--text-primary)"; (e.target as HTMLElement).style.background = "var(--bg-elevated)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = "var(--text-secondary)"; (e.target as HTMLElement).style.background = "transparent"; }}
              >{label}</Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="btn btn-ghost btn-sm" title="Search" style={{ borderRadius: "50%", padding: "0.5rem" }}>
              <Search size={18} />
            </button>

            {/* Cart */}
            <button onClick={openCart} className="btn btn-ghost btn-sm" title="Cart" style={{ position: "relative", borderRadius: "50%", padding: "0.5rem" }}>
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  background: "var(--accent-primary)", color: "#fff",
                  fontSize: "0.65rem", fontWeight: 700,
                  width: 18, height: 18, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>{cartCount > 9 ? "9+" : cartCount}</span>
              )}
            </button>

            {/* Wishlist */}
            {session && (
              <Link href="/account/wishlist" className="btn btn-ghost btn-sm" title="Wishlist" style={{ borderRadius: "50%", padding: "0.5rem" }}>
                <Heart size={18} />
              </Link>
            )}

            {/* User menu */}
            {session ? (
              <div style={{ position: "relative" }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="btn btn-secondary btn-sm" style={{ gap: "0.5rem" }}>
                  <User size={15} />
                  <span className="desktop-nav" style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {session.user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <>
                    <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setUserMenuOpen(false)} />
                    <div style={{
                      position: "absolute", right: 0, top: "calc(100% + 8px)",
                      background: "var(--bg-card)", border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-lg)", padding: "0.5rem", width: 200,
                      boxShadow: "var(--shadow-card)", zIndex: 50,
                    }} className="animate-scale-in">
                      <div style={{ padding: "0.5rem 1rem 0.75rem", borderBottom: "1px solid var(--border-color)", marginBottom: "0.25rem" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{session.user?.name}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{session.user?.email}</div>
                      </div>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="sidebar-link" style={{ fontSize: "0.875rem" }}>
                          <LayoutDashboard size={15} /> Admin Panel
                        </Link>
                      )}
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} className="sidebar-link" style={{ fontSize: "0.875rem" }}>
                        <User size={15} /> My Account
                      </Link>
                      <Link href="/account/orders" onClick={() => setUserMenuOpen(false)} className="sidebar-link" style={{ fontSize: "0.875rem" }}>
                        <Package size={15} /> My Orders
                      </Link>
                      <hr className="divider" style={{ margin: "0.25rem 0" }} />
                      <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="sidebar-link btn-full" style={{ fontSize: "0.875rem", color: "var(--danger)" }}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link href="/auth/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm desktop-nav">Register</Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost btn-sm mobile-only" style={{ borderRadius: "50%", padding: "0.5rem" }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ borderTop: "1px solid var(--border-color)", padding: "0.75rem 1rem" }} className="animate-fade-in">
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", maxWidth: 600, margin: "0 auto" }}>
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search xerox machines, models, brands..."
                className="input"
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ borderTop: "1px solid var(--border-color)", padding: "1rem", background: "var(--bg-secondary)" }} className="animate-fade-in">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "All Machines" },
              { href: "/products?category=office", label: "Office Machines" },
              { href: "/products?category=commercial", label: "Commercial" },
              { href: "/products?category=industrial", label: "Industrial" },
              { href: "/products?featured=true", label: "Deals & Offers" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                display: "block", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)",
                color: "var(--text-secondary)", fontWeight: 500, marginBottom: "0.25rem"
              }}>{label}</Link>
            ))}
            {!session && (
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <Link href="/auth/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)} style={{ flex: 1 }}>Login</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)} style={{ flex: 1 }}>Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <CartDrawer />

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
      `}</style>
    </>
  );
}
