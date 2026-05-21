"use client";
import Link from "next/link";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  featured?: boolean;
  category?: string;
}

export default function ProductCard({
  id, name, slug, price, comparePrice, image, rating, reviewCount, stock, brand, featured, category
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const discount = comparePrice ? calculateDiscount(price, comparePrice) : 0;

  const handleAddToCart = async () => {
    setAddingToCart(true);
    addItem({ id, name, price, image, stock, slug });
    toast.success(`${name.substring(0, 30)}... added to cart!`);
    setTimeout(() => setAddingToCart(false), 600);
  };

  const handleWishlist = () => {
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      transition: "var(--transition)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-glow)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Badges */}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, display: "flex", flexDirection: "column", gap: 6 }}>
        {featured && <span className="badge badge-gold">⭐ Featured</span>}
        {discount > 0 && <span className="badge badge-red">-{discount}% OFF</span>}
        {stock === 0 && <span className="badge badge-gray">Out of Stock</span>}
        {stock > 0 && stock <= 3 && <span className="badge badge-red">Only {stock} left!</span>}
      </div>

      {/* Wishlist */}
      <button onClick={handleWishlist} style={{
        position: "absolute", top: 12, right: 12, zIndex: 2,
        width: 36, height: 36, borderRadius: "50%",
        background: "rgba(5,11,24,0.8)", border: "1px solid var(--border-color)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "var(--transition)",
        color: wishlisted ? "#ef4444" : "var(--text-muted)",
      }}>
        <Heart size={16} fill={wishlisted ? "#ef4444" : "none"} />
      </button>

      {/* Image */}
      <Link href={`/products/${slug}`}>
        <div style={{ position: "relative", paddingBottom: "70%", background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-secondary))", overflow: "hidden" }}>
          <img
            src={image}
            alt={name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.07)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
          />
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
        {category && <span style={{ fontSize: "0.75rem", color: "var(--accent-secondary)", fontWeight: 500, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{brand} · {category}</span>}

        <Link href={`/products/${slug}`}>
          <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.5rem", lineHeight: 1.3, color: "var(--text-primary)" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent-secondary)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"}
          >{name}</h3>
        </Link>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.75rem" }}>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={13} fill={i <= Math.round(rating) ? "var(--brand-gold)" : "none"} color={i <= Math.round(rating) ? "var(--brand-gold)" : "var(--text-muted)"} />
            ))}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>({reviewCount})</span>
        </div>

        {/* Price */}
        <div style={{ marginBottom: "1rem", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>{formatPrice(price)}</span>
            {comparePrice && <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", textDecoration: "line-through" }}>{formatPrice(comparePrice)}</span>}
          </div>
          {comparePrice && <span style={{ fontSize: "0.75rem", color: "var(--success)" }}>Save {formatPrice(comparePrice - price)}</span>}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleAddToCart}
            disabled={stock === 0 || addingToCart}
            className="btn btn-primary"
            style={{ flex: 1, fontSize: "0.8125rem", padding: "0.625rem" }}
          >
            {addingToCart ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <ShoppingCart size={15} />}
            {stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <Link href={`/products/${slug}`} className="btn btn-secondary" style={{ padding: "0.625rem 0.75rem" }} title="View Details">
            <Eye size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
