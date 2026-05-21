"use client";
import { useEffect, useState } from "react";
import { formatPrice, formatDate, getOrderStatusColor } from "@/lib/utils";
import Link from "next/link";
import { Loader2, Package, Truck, Check, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    params.then(({ id }) => {
      setOrderId(id);
      if (success) toast.success("Payment successful! Your order is confirmed.");
      fetch(`/api/orders/${id}`).then(r => r.json()).then(data => { setOrder(data); setLoading(false); }).catch(() => setLoading(false));
    });
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "5rem" }}><Loader2 size={36} style={{ color: "var(--accent-primary)", animation: "spin 1s linear infinite" }} /></div>;
  if (!order || order.error) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Order not found.</div>;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div style={{ padding: "2rem 0" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Order #{order.id.slice(-8).toUpperCase()}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <span className={`badge ${getOrderStatusColor(order.status)}`}>{order.status}</span>
            <span className={`badge ${order.paymentStatus === "PAID" ? "badge-green" : "badge-red"}`}>{order.paymentStatus}</span>
          </div>
        </div>

        {/* Progress tracker */}
        {order.status !== "CANCELLED" && (
          <div className="card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>Order Progress</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0", overflowX: "auto" }}>
              {STATUS_STEPS.map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 80 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: i <= currentStep ? "var(--accent-primary)" : "var(--bg-elevated)",
                      border: `2px solid ${i <= currentStep ? "var(--accent-primary)" : "var(--border-color)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: i <= currentStep ? "#fff" : "var(--text-muted)",
                    }}>
                      {i < currentStep ? <Check size={16} /> : i === 0 ? <Clock size={16} /> : i === 3 ? <Truck size={16} /> : i === 4 ? <Package size={16} /> : <span style={{ fontSize: "0.75rem" }}>{i + 1}</span>}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: i <= currentStep ? "var(--text-primary)" : "var(--text-muted)", textAlign: "center", textTransform: "capitalize" }}>{step.toLowerCase()}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < currentStep ? "var(--accent-primary)" : "var(--border-color)", margin: "0 0.25rem", marginBottom: "1.25rem" }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem" }}>
          {/* Items */}
          <div>
            <div className="card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Items Ordered</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {order.items?.map((item: any) => {
                  const img = item.image || (item.product ? (() => { try { return JSON.parse(item.product.images)[0]; } catch { return null; } })() : null);
                  return (
                    <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      {img && <img src={img} alt={item.name} style={{ width: 64, height: 64, borderRadius: "var(--radius-md)", objectFit: "cover" }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Qty: {item.quantity} × {formatPrice(item.price)}</div>
                      </div>
                      <div style={{ fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery address */}
            {order.address && (
              <div className="card" style={{ padding: "1.5rem" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Delivery Address</h3>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{order.address.fullName}</div>
                  <div>{order.address.street}</div>
                  <div>{order.address.city}, {order.address.state} — {order.address.zip}</div>
                  <div>{order.address.country}</div>
                  <div style={{ marginTop: "0.25rem", color: "var(--text-muted)" }}>📞 {order.address.phone}</div>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="card" style={{ padding: "1.5rem", alignSelf: "flex-start" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Order Summary</h3>
            {[
              { label: "Subtotal", value: formatPrice(order.subtotal) },
              { label: "Shipping", value: order.shipping === 0 ? "FREE" : formatPrice(order.shipping) },
              { label: "GST", value: formatPrice(order.tax) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span style={{ color: value === "FREE" ? "var(--success)" : "inherit" }}>{value}</span>
              </div>
            ))}
            <hr className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1.1rem" }}>
              <span>Total</span>
              <span style={{ color: "var(--accent-primary)" }}>{formatPrice(order.total)}</span>
            </div>
            {order.stripePaymentId && (
              <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--text-muted)", wordBreak: "break-all" }}>
                Payment ID: {order.stripePaymentId}
              </div>
            )}
            <div style={{ marginTop: "1.25rem" }}>
              <Link href="/account/orders" className="btn btn-secondary btn-full">← All Orders</Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
