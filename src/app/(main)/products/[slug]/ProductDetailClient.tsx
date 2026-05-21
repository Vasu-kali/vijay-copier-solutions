"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import ProductCard from "@/components/ProductCard";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Check, Truck, Shield, RotateCcw, Phone } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProductDetailClient({ product, related }: { product: any; related: any[] }) {
  const { data: session } = useSession();
  const addItem = useCartStore(s => s.addItem);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const images = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
  const specs = (() => { try { return JSON.parse(product.specifications); } catch { return {}; } })();
  const displayImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=500&fit=crop"];

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: displayImages[0], stock: product.stock, slug: product.slug });
    }
    toast.success(`${qty}x ${product.name.substring(0, 30)} added to cart!`);
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { toast.error("Please login to submit a review"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reviewForm, productId: product.id }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to submit review"); return; }
      toast.success("Review submitted successfully!");
      setReviewForm({ rating: 5, title: "", comment: "" });
    } finally {
      setSubmitting(false);
    }
  };

  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  const getFirstImage = (images: string) => { try { return JSON.parse(images)[0] || "/placeholder-machine.jpg"; } catch { return "/placeholder-machine.jpg"; } };

  return (
    <div style={{ padding: "2rem 0" }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "2rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--text-muted)" }}>Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" style={{ color: "var(--text-muted)" }}>Products</Link>
          <ChevronRight size={14} />
          <Link href={`/products?category=${product.category?.slug}`} style={{ color: "var(--text-muted)" }}>{product.category?.name}</Link>
          <ChevronRight size={14} />
          <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
        </div>

        {/* Main product section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border-color)", marginBottom: "1rem", position: "relative" }}>
              <img src={displayImages[activeImg]} alt={product.name} style={{ width: "100%", height: 420, objectFit: "cover" }} />
              {displayImages.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i - 1 + displayImages.length) % displayImages.length)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={18} /></button>
                  <button onClick={() => setActiveImg(i => (i + 1) % displayImages.length)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={18} /></button>
                </>
              )}
              {discount > 0 && <span className="badge badge-red" style={{ position: "absolute", top: 12, left: 12 }}>-{discount}% OFF</span>}
            </div>
            {displayImages.length > 1 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {displayImages.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ width: 72, height: 72, borderRadius: "var(--radius-md)", overflow: "hidden", border: `2px solid ${i === activeImg ? "var(--accent-primary)" : "var(--border-color)"}`, cursor: "pointer", background: "none", padding: 0, transition: "var(--transition)" }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ marginBottom: "0.5rem" }}>
              <span className="badge badge-blue">{product.brand}</span>
              <span style={{ marginLeft: "0.5rem" }} className="badge badge-gray">{product.category?.name}</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.3 }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div className="stars" style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= Math.round(product.rating) ? "var(--brand-gold)" : "none"} color={i <= Math.round(product.rating) ? "var(--brand-gold)" : "var(--text-muted)"} />)}
              </div>
              <span style={{ fontWeight: 600, color: "var(--brand-gold)" }}>{product.rating.toFixed(1)}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "1.5rem", padding: "1.25rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "2rem", fontWeight: 900, color: "var(--text-primary)" }}>{formatPrice(product.price)}</span>
                {product.comparePrice && <span style={{ fontSize: "1.1rem", color: "var(--text-muted)", textDecoration: "line-through" }}>{formatPrice(product.comparePrice)}</span>}
              </div>
              {product.comparePrice && <div style={{ color: "var(--success)", fontWeight: 600, marginTop: "0.25rem" }}>You save {formatPrice(product.comparePrice - product.price)} ({discount}% off)</div>}
              <div style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>Price inclusive of 18% GST</div>
            </div>

            {/* Stock */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: product.stock > 0 ? "var(--success)" : "var(--danger)" }} />
              <span style={{ fontWeight: 600, color: product.stock > 0 ? "var(--success)" : "var(--danger)", fontSize: "0.875rem" }}>
                {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left in stock!` : "Out of Stock"}
              </span>
              {product.sku && <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginLeft: "auto" }}>SKU: {product.sku}</span>}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Quantity:</span>
                <div style={{ display: "flex", alignItems: "center", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, border: "none", background: "none", color: "var(--text-primary)", cursor: "pointer", fontSize: "1.25rem" }}>−</button>
                  <span style={{ width: 40, textAlign: "center", fontWeight: 700 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ width: 40, height: 40, border: "none", background: "none", color: "var(--text-primary)", cursor: "pointer", fontSize: "1.25rem" }}>+</button>
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button onClick={() => setWishlisted(!wishlisted)} className="btn btn-secondary" style={{ padding: "0.875rem 1rem" }}>
                <Heart size={18} fill={wishlisted ? "#ef4444" : "none"} color={wishlisted ? "#ef4444" : "var(--text-primary)"} />
              </button>
            </div>

            {/* Benefits */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1.25rem", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              {[
                { icon: Truck, text: `${product.price >= 50000 ? "FREE delivery" : "₹999 delivery"} · 3-7 business days` },
                { icon: Shield, text: "1 Year manufacturer warranty included" },
                { icon: RotateCcw, text: "7-day hassle-free return policy" },
                { icon: Phone, text: "24/7 technical support & AMC available" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  <Icon size={16} style={{ color: "var(--accent-primary)", flexShrink: 0 }} /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", marginBottom: "2rem", gap: "0.25rem", overflowX: "auto" }}>
            {(["description", "specs", "reviews"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "0.75rem 1.5rem", border: "none", background: "none", cursor: "pointer",
                fontWeight: 600, fontSize: "0.9rem", textTransform: "capitalize",
                color: activeTab === tab ? "var(--accent-primary)" : "var(--text-muted)",
                borderBottom: `2px solid ${activeTab === tab ? "var(--accent-primary)" : "transparent"}`,
                transition: "var(--transition)", whiteSpace: "nowrap",
              }}>
                {tab === "reviews" ? `Reviews (${product.reviewCount})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1rem", maxWidth: 800 }}>
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === "specs" && (
            <div style={{ maxWidth: 700 }}>
              {Object.keys(specs).length > 0 ? (
                <table className="table-base">
                  <tbody>
                    {Object.entries(specs).map(([key, val]) => (
                      <tr key={key}>
                        <td style={{ fontWeight: 600, width: "40%", color: "var(--text-secondary)" }}>{key}</td>
                        <td>{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: "var(--text-muted)" }}>No specifications available for this product.</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div style={{ maxWidth: 800 }}>
              {/* Write a review */}
              {session && (
                <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
                  <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Write a Review</h3>
                  <form onSubmit={handleReview} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem", display: "block" }}>Rating</label>
                      <div style={{ display: "flex", gap: "0.375rem" }}>
                        {[1,2,3,4,5].map(i => (
                          <button key={i} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: i }))} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}>
                            <Star size={24} fill={i <= reviewForm.rating ? "var(--brand-gold)" : "none"} color={i <= reviewForm.rating ? "var(--brand-gold)" : "var(--text-muted)"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem", display: "block" }}>Title (optional)</label>
                      <input type="text" className="input" placeholder="Summary of your review" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem", display: "block" }}>Review *</label>
                      <textarea className="input" rows={4} placeholder="Share your experience with this product..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} style={{ resize: "vertical" }} required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={submitting} style={{ alignSelf: "flex-start" }}>
                      {submitting ? <span className="spinner" /> : <Check size={16} />}
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews list */}
              {product.reviews?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {product.reviews.map((r: any) => (
                    <div key={r.id} className="card" style={{ padding: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-primary), #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.875rem" }}>
                            {r.user?.name?.[0] || "U"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{r.user?.name || "Customer"}</div>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{formatDate(r.createdAt)}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= r.rating ? "var(--brand-gold)" : "none"} color={i <= r.rating ? "var(--brand-gold)" : "var(--text-muted)"} />)}
                        </div>
                      </div>
                      {r.title && <p style={{ fontWeight: 600, marginBottom: "0.375rem" }}>{r.title}</p>}
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem" }}>Related Products</h2>
            <div className="product-grid">
              {related.map(p => (
                <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug} price={p.price} comparePrice={p.comparePrice}
                  image={getFirstImage(p.images)} rating={p.rating} reviewCount={p.reviewCount} stock={p.stock} brand={p.brand} featured={p.featured} />
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
