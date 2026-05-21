"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { MapPin, CreditCard, Package, Plus, Check, Loader2, Smartphone, Truck, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

const STEPS = ["Cart Review", "Delivery Address", "Payment"];

const PAYMENT_OPTIONS = [
  {
    id: "RAZORPAY",
    label: "Pay Online",
    sub: "UPI, PhonePe, GPay, Cards, Net Banking",
    icon: "💳",
    badge: "Most Popular",
  },
  {
    id: "UPI",
    label: "Pay via UPI QR Code",
    sub: "Scan QR with any UPI app — instant payment",
    icon: "📲",
    badge: "",
  },
  {
    id: "COD",
    label: "Cash on Delivery",
    sub: "Pay when product arrives at your door",
    icon: "💵",
    badge: "",
  },
];

declare global {
  interface Window { Razorpay: any; }
}

function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [upiResult, setUpiResult] = useState<any>(null);
  const [newAddr, setNewAddr] = useState({ fullName: "", phone: "", street: "", city: "", state: "", zip: "", country: "India", isDefault: false });

  const subtotal = total();
  const shipping = subtotal >= 50000 ? 0 : 999;
  const tax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + shipping + tax;

  useEffect(() => {
    if (!session) { router.push("/auth/login?callbackUrl=/checkout"); return; }
    if (items.length === 0) { router.push("/products"); return; }
    fetchAddresses();
  }, [session]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses");
      const data = await res.json();
      setAddresses(data || []);
      const def = data.find((a: any) => a.isDefault);
      if (def) setSelectedAddress(def.id);
    } catch {}
  };

  const addAddress = async () => {
    if (!newAddr.fullName || !newAddr.phone || !newAddr.street || !newAddr.city || !newAddr.state || !newAddr.zip) {
      toast.error("Please fill all address fields"); return;
    }
    const res = await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newAddr) });
    const data = await res.json();
    if (!res.ok) { toast.error("Failed to save address"); return; }
    setAddresses(prev => [...prev, data]);
    setSelectedAddress(data.id);
    setShowAddrForm(false);
    toast.success("Address saved!");
  };

  const handleCheckout = async () => {
    if (!selectedAddress) { toast.error("Please select a delivery address"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
          addressId: selectedAddress,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Checkout failed"); setLoading(false); return; }

      // UPI — show QR
      if (paymentMethod === "UPI" || data.paymentMethod === "UPI") {
        setUpiResult(data); setLoading(false); return;
      }

      // COD
      if (paymentMethod === "COD" || data.paymentMethod === "COD") {
        clearCart();
        toast.success("Order placed! Pay on delivery.");
        router.push(`/account/orders/${data.orderId}?success=1`);
        return;
      }

      // Razorpay
      if (data.razorpayOrderId) {
        const rzp = new window.Razorpay({
          key: data.razorpayKey,
          amount: Math.round(grandTotal * 100),
          currency: "INR",
          name: "Vijay Copier Solutions",
          description: "Xerox Machine Purchase",
          order_id: data.razorpayOrderId,
          prefill: {
            name: session?.user?.name,
            email: session?.user?.email,
            contact: "9951487200",
          },
          theme: { color: "#0ea5e9" },
          handler: async (response: any) => {
            const verifyRes = await fetch("/api/checkout", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, orderId: data.orderId }),
            });
            if (verifyRes.ok) {
              clearCart();
              toast.success("Payment successful! 🎉");
              router.push(`/account/orders/${data.orderId}?success=1`);
            } else {
              toast.error("Payment verification failed. Contact support.");
            }
          },
        });
        rzp.open();
        setLoading(false);
        return;
      }

      // Fallback COD
      clearCart();
      router.push(`/account/orders/${data.orderId}?success=1`);
    } catch (e) {
      toast.error("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  // UPI Success confirmation
  const confirmUpiPayment = async () => {
    toast.success("Order confirmed! We'll verify your payment and process the order.");
    clearCart();
    router.push(`/account/orders/${upiResult.orderId}?success=1`);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div style={{ padding: "2rem 0", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>Checkout</h1>

          {/* Steps */}
          <div style={{ display: "flex", gap: "0", marginBottom: "2.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i <= step ? "var(--accent-primary)" : "var(--bg-elevated)", color: i <= step ? "#fff" : "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700 }}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span style={{ fontSize: "0.875rem", fontWeight: i === step ? 700 : 400, color: i <= step ? "var(--text-primary)" : "var(--text-muted)", whiteSpace: "nowrap" }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 32, height: 1, background: "var(--border-color)", margin: "0 0.75rem" }} />}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem" }}>
            {/* Main Content */}
            <div>
              {/* Step 0 — Cart Review */}
              {step === 0 && (
                <div>
                  <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}><Package size={20} style={{ color: "var(--accent-primary)" }} /> Your Cart</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                    {items.map(item => (
                      <div key={item.id} className="card" style={{ display: "flex", gap: "1rem", padding: "1rem", alignItems: "center" }}>
                        <img src={item.image} alt={item.name} style={{ width: 72, height: 72, borderRadius: "var(--radius-md)", objectFit: "cover" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} className="btn btn-primary btn-lg">Continue to Address →</button>
                </div>
              )}

              {/* Step 1 — Address */}
              {step === 1 && (
                <div>
                  <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}><MapPin size={20} style={{ color: "var(--accent-primary)" }} /> Delivery Address</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                    {addresses.map(addr => (
                      <div key={addr.id} onClick={() => setSelectedAddress(addr.id)} style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)", cursor: "pointer", border: `2px solid ${selectedAddress === addr.id ? "var(--accent-primary)" : "var(--border-color)"}`, background: selectedAddress === addr.id ? "rgba(14,165,233,0.05)" : "var(--bg-card)", transition: "var(--transition)" }}>
                        <div style={{ fontWeight: 700 }}>{addr.fullName} — {addr.phone}</div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>{addr.street}, {addr.city}, {addr.state} — {addr.zip}</div>
                        {addr.isDefault && <span className="badge badge-blue" style={{ marginTop: "0.5rem" }}>Default</span>}
                      </div>
                    ))}
                    <button onClick={() => setShowAddrForm(!showAddrForm)} className="btn btn-secondary" style={{ alignSelf: "flex-start" }}><Plus size={16} /> Add New Address</button>
                  </div>

                  {showAddrForm && (
                    <div className="card animate-fade-in" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                      <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>New Delivery Address</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        {[
                          { f: "fullName", l: "Full Name", ph: "Recipient name" },
                          { f: "phone", l: "Phone", ph: "+91 99514 87200" },
                          { f: "street", l: "Street Address", ph: "Area / Colony / Street" },
                          { f: "city", l: "City", ph: "Hyderabad" },
                          { f: "state", l: "State", ph: "Telangana" },
                          { f: "zip", l: "Pincode", ph: "500072" },
                        ].map(({ f, l, ph }) => (
                          <div key={f} style={f === "street" ? { gridColumn: "1 / -1" } : {}}>
                            <label style={{ display: "block", fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.375rem" }}>{l}</label>
                            <input type="text" className="input" placeholder={ph} value={(newAddr as any)[f]} onChange={e => setNewAddr(a => ({ ...a, [f]: e.target.value }))} />
                          </div>
                        ))}
                      </div>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", cursor: "pointer", fontSize: "0.875rem" }}>
                        <input type="checkbox" checked={newAddr.isDefault} onChange={e => setNewAddr(a => ({ ...a, isDefault: e.target.checked }))} /> Set as default
                      </label>
                      <button onClick={addAddress} className="btn btn-primary" style={{ marginTop: "1rem" }}><Check size={16} /> Save Address</button>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={() => setStep(0)} className="btn btn-secondary">← Back</button>
                    <button onClick={() => { if (!selectedAddress) { toast.error("Select an address"); return; } setStep(2); }} className="btn btn-primary btn-lg">Continue to Payment →</button>
                  </div>
                </div>
              )}

              {/* Step 2 — Payment */}
              {step === 2 && !upiResult && (
                <div>
                  <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}><CreditCard size={20} style={{ color: "var(--accent-primary)" }} /> Choose Payment Method</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                    {PAYMENT_OPTIONS.map(opt => (
                      <div key={opt.id} onClick={() => setPaymentMethod(opt.id)} style={{ padding: "1.25rem 1.5rem", borderRadius: "var(--radius-lg)", cursor: "pointer", border: `2px solid ${paymentMethod === opt.id ? "var(--accent-primary)" : "var(--border-color)"}`, background: paymentMethod === opt.id ? "rgba(14,165,233,0.05)" : "var(--bg-card)", transition: "var(--transition)", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ fontSize: "2rem" }}>{opt.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {opt.label}
                            {opt.badge && <span className="badge badge-gold" style={{ fontSize: "0.7rem" }}>{opt.badge}</span>}
                          </div>
                          <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{opt.sub}</div>
                        </div>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${paymentMethod === opt.id ? "var(--accent-primary)" : "var(--border-color)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {paymentMethod === opt.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent-primary)" }} />}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Security note */}
                  <div style={{ padding: "1rem 1.25rem", background: "rgba(34,197,94,0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(34,197,94,0.2)", marginBottom: "1.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                    🔒 All payments are 100% secure. Your payment goes directly to <strong>Vijay Copier Solutions</strong>.
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={() => setStep(1)} className="btn btn-secondary">← Back</button>
                    <button onClick={handleCheckout} disabled={loading} className="btn btn-gold btn-lg" style={{ flex: 1 }}>
                      {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <span>💰</span>}
                      {loading ? "Processing..." : paymentMethod === "COD" ? `Place Order (COD) — ${formatPrice(grandTotal)}` : `Pay ${formatPrice(grandTotal)}`}
                    </button>
                  </div>
                </div>
              )}

              {/* UPI Payment Screen */}
              {upiResult && (
                <div className="animate-fade-in">
                  <h2 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>📲 Pay via UPI</h2>
                  <div className="card" style={{ padding: "2rem", textAlign: "center", marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>UPI ID</div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--accent-primary)", marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
                      {upiResult.upiId}
                    </div>
                    <div style={{ marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>Name: {upiResult.upiName}</div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--brand-gold)" }}>Amount: {formatPrice(upiResult.total)}</div>
                    </div>

                    {/* QR Code via Google Charts API */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiResult.upiId}&pn=Vijay+Copier+Solutions&am=${upiResult.total}&cu=INR`}
                        alt="UPI QR Code"
                        style={{ width: 200, height: 200, borderRadius: "var(--radius-lg)", border: "4px solid var(--accent-primary)", background: "#fff" }}
                      />
                    </div>

                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                      Open <strong>PhonePe</strong>, <strong>Google Pay</strong>, <strong>Paytm</strong>, or any UPI app →<br />
                      Scan QR code <strong>OR</strong> send to UPI ID above →<br />
                      Then click <strong>"I've Paid"</strong> below
                    </p>

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                      <button onClick={confirmUpiPayment} className="btn btn-primary btn-lg"><Check size={18} /> I've Paid — Confirm Order</button>
                    </div>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", textAlign: "center" }}>
                    Order ID: <code>{upiResult.orderId}</code>. Keep this for reference.
                    Our team will verify and process your order within 1 hour.
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="card" style={{ padding: "1.5rem", position: "sticky", top: "6rem" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Order Summary</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "var(--text-secondary)" }}>{item.name.substring(0, 22)}... ×{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <hr className="divider" />
                {[
                  { label: "Subtotal", value: formatPrice(subtotal) },
                  { label: "Shipping", value: shipping === 0 ? "FREE" : formatPrice(shipping) },
                  { label: "GST (18%)", value: formatPrice(tax) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ color: value === "FREE" ? "var(--success)" : undefined }}>{value}</span>
                  </div>
                ))}
                <hr className="divider" />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1.1rem" }}>
                  <span>Total</span>
                  <span style={{ color: "var(--accent-primary)" }}>{formatPrice(grandTotal)}</span>
                </div>
                {shipping === 0 && <div style={{ marginTop: "0.75rem", color: "var(--success)", fontSize: "0.8125rem", fontWeight: 600 }}>🎉 FREE Delivery!</div>}

                <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", fontSize: "0.8rem" }}>
                  <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Accepted Payments:</div>
                  <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                    {["PhonePe", "GPay", "Paytm", "UPI", "Cards", "COD"].map(p => (
                      <span key={p} className="badge badge-blue" style={{ fontSize: "0.7rem" }}>{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media(max-width:768px){.checkout-grid{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: "8rem 0" }}><Loader2 size={40} style={{ color: "var(--accent-primary)", animation: "spin 1s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}>
      <CheckoutPage />
    </Suspense>
  );
}
