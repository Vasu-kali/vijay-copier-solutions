"use client";
import { useEffect, useState } from "react";
import { formatPrice, formatDate, getOrderStatusColor } from "@/lib/utils";
import Link from "next/link";
import { Package, ChevronRight, Loader2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(data => { setOrders(data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "5rem" }}><Loader2 size={36} style={{ color: "var(--accent-primary)", animation: "spin 1s linear infinite" }} /></div>;

  return (
    <div style={{ padding: "2rem 0", minHeight: "60vh" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>My Orders</h1>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
            <Package size={56} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>No orders yet</h3>
            <p style={{ marginBottom: "1.5rem" }}>When you place orders, they'll appear here.</p>
            <Link href="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map((order: any) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", textDecoration: "none" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-muted)", fontFamily: "monospace" }}>#{order.id.slice(-8).toUpperCase()}</span>
                    <span className={`badge ${getOrderStatusColor(order.status)}`} style={{ fontSize: "0.75rem" }}>{order.status}</span>
                    {order.paymentStatus === "PAID" && <span className="badge badge-green" style={{ fontSize: "0.75rem" }}>PAID</span>}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                    {order.items?.slice(0,2).map((i: any) => i.name).join(", ")}{order.items?.length > 2 ? ` +${order.items.length - 2} more` : ""}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{formatDate(order.createdAt)} · {order.items?.length} item(s)</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{formatPrice(order.total)}</div>
                  <ChevronRight size={16} style={{ color: "var(--text-muted)", marginTop: "0.25rem" }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

