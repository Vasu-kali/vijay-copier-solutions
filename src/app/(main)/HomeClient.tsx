"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Shield, Truck, Headphones, Award, ChevronRight, Star, Zap } from "lucide-react";

interface Product {
  id: string; name: string; slug: string; price: number; comparePrice: number | null;
  images: string; rating: number; reviewCount: number; stock: number; brand: string;
  featured: boolean; category: { name: string };
}
interface Category { id: string; name: string; slug: string; image: string | null; description: string | null; }

export default function HomeClient({ featuredProducts, categories, recentProducts }: {
  featuredProducts: Product[];
  categories: Category[];
  recentProducts: Product[];
}) {
  const getFirstImage = (images: string) => {
    try { const arr = JSON.parse(images); return arr[0] || "/placeholder-machine.jpg"; }
    catch { return "/placeholder-machine.jpg"; }
  };

  const stats = [
    { value: "10,000+", label: "Happy Customers" },
    { value: "500+", label: "Products" },
    { value: "15+", label: "Years Experience" },
    { value: "99%", label: "Satisfaction Rate" },
  ];

  const features = [
    { icon: Shield, title: "Genuine Products", desc: "100% authentic Xerox machines with manufacturer warranty" },
    { icon: Truck, title: "Pan India Delivery", desc: "Free shipping on orders above ₹50,000. Express delivery available" },
    { icon: Headphones, title: "24/7 Support", desc: "Expert technical support and after-sales service nationwide" },
    { icon: Award, title: "Best Price Guarantee", desc: "Competitive prices with EMI options and bulk discounts" },
  ];

  const testimonials = [
    { name: "Rajesh Kumar", role: "Office Manager, TechCorp", rating: 5, text: "Vijay Copier Solutions delivered our Xerox machine within 2 days. Excellent quality and the setup team was very professional." },
    { name: "Priya Sharma", role: "Director, EduPlus Schools", rating: 5, text: "We ordered 5 commercial copiers for our school chain. The pricing was unbeatable and service has been phenomenal." },
    { name: "Mohammed Ali", role: "Owner, Print Hub", rating: 5, text: "Best xerox machine dealer in India. Fast delivery, genuine products, and amazing after-sales support." },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section style={{
        background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, #071428 100%)",
        position: "relative", overflow: "hidden", padding: "5rem 0 4rem"
      }}>
        {/* Background decoration */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
        </div>

        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div className="animate-fade-in">
              <div className="badge badge-blue" style={{ marginBottom: "1.5rem", padding: "0.4rem 1rem" }}>
                <Zap size={12} style={{ marginRight: 4 }} /> India's #1 Xerox Machine Store
              </div>
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem" }}>
                Premium <span className="gradient-text">Xerox Machines</span> for Every Business
              </h1>
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 500 }}>
                From compact office copiers to high-speed industrial printers — Vijay Copier Solutions brings you the best Xerox machines at unbeatable prices with nationwide delivery and expert support.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/products" className="btn btn-primary btn-lg">
                  Shop All Machines <ArrowRight size={18} />
                </Link>
                <Link href="/products?featured=true" className="btn btn-secondary btn-lg">
                  View Deals
                </Link>
              </div>
              {/* Trust badges */}
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
                {["🔒 Secure Payment", "🚚 Free Delivery", "⭐ 5-Star Rated"].map(item => (
                  <span key={item} style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>{item}</span>
                ))}
              </div>
            </div>
            <div className="animate-slide-right" style={{ position: "relative" }}>
              <div style={{
                borderRadius: "var(--radius-xl)", overflow: "hidden",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-glow), var(--shadow-card)",
                background: "var(--bg-card)",
              }}>
                <img
                  src="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=450&fit=crop"
                  alt="Premium Xerox Machine"
                  style={{ width: "100%", height: 380, objectFit: "cover" }}
                />
              </div>
              {/* Floating card */}
              <div style={{
                position: "absolute", bottom: -20, left: -20,
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)", padding: "1rem 1.25rem",
                boxShadow: "var(--shadow-card)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "1.1rem" }}>✓</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>Order Delivered!</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Xerox WorkCentre 7845</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginTop: "4rem" }}>
            {stats.map(({ value, label }) => (
              <div key={label} style={{ textAlign: "center", padding: "1.5rem", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
                <div className="gradient-text" style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Outfit" }}>{value}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section-sm">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Find the perfect machine for your needs</p>
            </div>
            <Link href="/products" className="btn btn-ghost" style={{ gap: "0.5rem", flexShrink: 0 }}>View All <ChevronRight size={16} /></Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
            {categories.length > 0 ? categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)", padding: "1.5rem 1rem", textAlign: "center",
                transition: "var(--transition)", display: "block"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🖨️</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{cat.name}</div>
                {cat.description && <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{cat.description}</div>}
              </Link>
            )) : (
              [
                { emoji: "🖨️", label: "Office Machines", desc: "Compact & efficient" },
                { emoji: "📠", label: "Commercial", desc: "High volume printing" },
                { emoji: "🏭", label: "Industrial", desc: "Large scale printing" },
                { emoji: "✨", label: "All-in-One", desc: "Print, scan & fax" },
                { emoji: "🎨", label: "Color Copiers", desc: "Vibrant color output" },
                { emoji: "♻️", label: "Eco Range", desc: "Energy efficient" },
              ].map(({ emoji, label, desc }) => (
                <Link key={label} href={`/products?search=${label}`} style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)", padding: "1.5rem 1rem", textAlign: "center",
                  transition: "var(--transition)", display: "block"
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{label}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{desc}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      {featuredProducts.length > 0 && (
        <section className="section-sm" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
              <div>
                <h2 className="section-title">⭐ Featured Machines</h2>
                <p className="section-subtitle">Hand-picked best sellers at special prices</p>
              </div>
              <Link href="/products?featured=true" className="btn btn-ghost" style={{ gap: "0.5rem", flexShrink: 0 }}>See All <ChevronRight size={16} /></Link>
            </div>
            <div className="product-grid">
              {featuredProducts.map(p => (
                <ProductCard key={p.id}
                  id={p.id} name={p.name} slug={p.slug} price={p.price} comparePrice={p.comparePrice}
                  image={getFirstImage(p.images)} rating={p.rating} reviewCount={p.reviewCount}
                  stock={p.stock} brand={p.brand} featured={p.featured} category={p.category.name}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PROMO BANNER ===== */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, #0c2a4a 0%, #051828 100%)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)", padding: "3rem 2.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "2rem", position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "40%", background: "radial-gradient(circle at right, rgba(14,165,233,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div>
              <div className="badge badge-gold" style={{ marginBottom: "1rem" }}>🔥 Limited Time Offer</div>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, marginBottom: "0.75rem" }}>
                Get Up to <span className="gradient-text-gold">40% OFF</span> on Commercial Copiers
              </h2>
              <p style={{ color: "var(--text-secondary)", maxWidth: 480 }}>
                Upgrade your business with our range of high-speed commercial copiers. Limited stock — offer valid while supplies last!
              </p>
            </div>
            <Link href="/products?category=commercial" className="btn btn-gold btn-lg" style={{ flexShrink: 0 }}>
              Grab the Deal <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== RECENT PRODUCTS ===== */}
      {recentProducts.length > 0 && (
        <section className="section-sm" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
              <div>
                <h2 className="section-title">🆕 Latest Arrivals</h2>
                <p className="section-subtitle">Freshly added to our catalog</p>
              </div>
              <Link href="/products" className="btn btn-ghost" style={{ gap: "0.5rem", flexShrink: 0 }}>See All <ChevronRight size={16} /></Link>
            </div>
            <div className="product-grid">
              {recentProducts.map(p => (
                <ProductCard key={p.id}
                  id={p.id} name={p.name} slug={p.slug} price={p.price} comparePrice={p.comparePrice}
                  image={getFirstImage(p.images)} rating={p.rating} reviewCount={p.reviewCount}
                  stock={p.stock} brand={p.brand} featured={p.featured} category={p.category.name}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURES ===== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 className="section-title">Why Choose Vijay Copier Solutions?</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>We go beyond just selling machines — we build lasting partnerships</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.5rem" }}>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: "var(--radius-lg)", background: "rgba(14,165,233,0.1)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <Icon size={26} style={{ color: "var(--accent-primary)" }} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "1rem" }}>{title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-sm" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {testimonials.map(({ name, role, rating, text }) => (
              <div key={name} className="card" style={{ padding: "1.75rem" }}>
                <div className="stars" style={{ marginBottom: "1rem" }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="var(--brand-gold)" color="var(--brand-gold)" />)}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>"{text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-primary), #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>
                    {name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "1rem" }}>
            Ready to Upgrade Your Printing Setup?
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto 2rem", fontSize: "1.0625rem" }}>
            Browse our complete catalog of Xerox machines and find the perfect fit for your business needs.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="btn btn-primary btn-lg">
              Explore All Products <ArrowRight size={18} />
            </Link>
            <a href="tel:+919876543210" className="btn btn-secondary btn-lg">
              Call: +91 98765 43210
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}

