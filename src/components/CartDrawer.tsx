"use client";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="overlay animate-fade-in" onClick={closeCart} />}

      {/* Drawer */}
      <div style={{
        position: "fixed", right: 0, top: 0, height: "100dvh", width: "min(420px, 100vw)",
        background: "var(--bg-secondary)",
        borderLeft: "1px solid var(--border-color)",
        zIndex: 60, display: "flex", flexDirection: "column",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "-4px 0 40px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ShoppingBag size={20} style={{ color: "var(--accent-primary)" }} />
            <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Your Cart</span>
            {items.length > 0 && <span className="badge badge-blue">{items.length}</span>}
          </div>
          <button onClick={closeCart} className="btn btn-ghost" style={{ padding: "0.375rem", borderRadius: "50%" }}>
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem", color: "var(--text-muted)" }}>
              <ShoppingBag size={56} style={{ opacity: 0.3 }} />
              <p style={{ fontWeight: 600, fontSize: "1rem" }}>Your cart is empty</p>
              <p style={{ fontSize: "0.875rem", textAlign: "center" }}>Explore our range of premium xerox machines</p>
              <Link href="/products" onClick={closeCart} className="btn btn-primary">Browse Products</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map((item) => (
                <div key={item.id} className="card animate-fade-in" style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-elevated)", flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/products/${item.slug}`} onClick={closeCart} style={{ fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.25rem" }} className="hover-text-primary">
                      {item.name}
                    </Link>
                    <div style={{ color: "var(--accent-secondary)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>
                      {formatPrice(item.price)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: "0.2rem" }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", border: "none", transition: "var(--transition)" }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ width: 24, textAlign: "center", fontWeight: 600, fontSize: "0.875rem" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", border: "none", transition: "var(--transition)" }}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="btn btn-danger btn-sm" style={{ padding: "0.3rem" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
              <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{formatPrice(total())}</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Shipping & GST calculated at checkout
            </p>
            <Link href="/checkout" onClick={closeCart} className="btn btn-gold btn-lg btn-full">
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
            <button onClick={closeCart} className="btn btn-ghost btn-full" style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
