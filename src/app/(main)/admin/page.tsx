"use client";
import { useEffect, useState } from "react";
import { formatPrice, formatDate, getOrderStatusColor } from "@/lib/utils";
import Link from "next/link";
import { BarChart3, Package, Users, ShoppingBag, TrendingUp, Plus, Edit, Trash2, Loader2, Eye, Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [productForm, setProductForm] = useState({
    name: "", slug: "", description: "", price: "", comparePrice: "", stock: "", sku: "",
    brand: "Xerox", categoryId: "", images: "", specifications: "", featured: false, isActive: true,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then(r => r.json()),
      fetch("/api/admin/products").then(r => r.json()),
      fetch("/api/products?limit=100").then(r => r.json()),
    ]).then(([s, p, all]) => {
      setStats(s);
      setProducts(p);
      // Extract unique categories from products
      const cats = [...new Map(all.products?.map((pr: any) => [pr.categoryId, pr.category]).filter(Boolean)).values()];
      setCategories(cats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSaveProduct = async () => {
    const imagesArr = productForm.images ? productForm.images.split("\n").filter(Boolean) : [];
    const specsObj: Record<string, string> = {};
    productForm.specifications.split("\n").forEach(line => {
      const [k, ...v] = line.split(":");
      if (k && v.length) specsObj[k.trim()] = v.join(":").trim();
    });

    const body = {
      ...productForm,
      price: parseFloat(productForm.price),
      comparePrice: productForm.comparePrice ? parseFloat(productForm.comparePrice) : null,
      stock: parseInt(productForm.stock),
      images: imagesArr,
      specifications: specsObj,
      ...(editingProduct ? { id: editingProduct.id } : {}),
    };

    const res = await fetch("/api/admin/products", {
      method: editingProduct ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      toast.success(editingProduct ? "Product updated!" : "Product created!");
      setShowAddProduct(false);
      setEditingProduct(null);
      fetch("/api/admin/products").then(r => r.json()).then(setProducts);
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) { toast.success("Product deactivated"); setProducts(p => p.filter(pr => pr.id !== id)); }
    else toast.error("Failed to delete");
  };

  const startEdit = (product: any) => {
    const images = (() => { try { return JSON.parse(product.images).join("\n"); } catch { return ""; } })();
    const specs = (() => { try { return Object.entries(JSON.parse(product.specifications)).map(([k, v]) => `${k}: ${v}`).join("\n"); } catch { return ""; } })();
    setProductForm({ ...product, price: String(product.price), comparePrice: String(product.comparePrice || ""), stock: String(product.stock), images, specifications: specs });
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "5rem" }}><Loader2 size={36} style={{ color: "var(--accent-primary)", animation: "spin 1s linear infinite" }} /></div>;

  const statCards = [
    { icon: ShoppingBag, label: "Total Orders", value: stats?.totalOrders || 0, color: "var(--accent-primary)" },
    { icon: TrendingUp, label: "Total Revenue", value: formatPrice(stats?.totalRevenue || 0), color: "var(--success)" },
    { icon: Users, label: "Total Users", value: stats?.totalUsers || 0, color: "#818cf8" },
    { icon: Package, label: "Active Products", value: stats?.totalProducts || 0, color: "var(--brand-gold)" },
  ];

  return (
    <div style={{ padding: "2rem 0", minHeight: "80vh" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Admin Dashboard</h1>
            <p style={{ color: "var(--text-muted)" }}>Vijay Copier Solutions — Control Panel</p>
          </div>
          <Link href="/" className="btn btn-secondary btn-sm">← View Store</Link>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", marginBottom: "2rem", gap: "0.25rem" }}>
          {(["overview", "products", "orders"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "0.75rem 1.5rem", border: "none", background: "none", cursor: "pointer", fontWeight: 600,
              color: tab === t ? "var(--accent-primary)" : "var(--text-muted)",
              borderBottom: `2px solid ${tab === t ? "var(--accent-primary)" : "transparent"}`,
              textTransform: "capitalize", transition: "var(--transition)",
            }}>{t}</button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {statCards.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem", marginBottom: "0.5rem" }}>{label}</div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, color }}>{value}</div>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Recent Orders</h3>
              <div style={{ overflowX: "auto" }}>
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentOrders?.map((order: any) => (
                      <tr key={order.id}>
                        <td><span style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>#{order.id.slice(-8).toUpperCase()}</span></td>
                        <td><div style={{ fontWeight: 600 }}>{order.user?.name}</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{order.user?.email}</div></td>
                        <td style={{ fontWeight: 700 }}>{formatPrice(order.total)}</td>
                        <td><span className={`badge ${getOrderStatusColor(order.status)}`}>{order.status}</span></td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>{formatDate(order.createdAt)}</td>
                        <td><Link href={`/account/orders/${order.id}`} className="btn btn-ghost btn-sm"><Eye size={14} /></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Products */}
        {tab === "products" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.25rem" }}>Products ({products.length})</h2>
              <button onClick={() => { setEditingProduct(null); setProductForm({ name: "", slug: "", description: "", price: "", comparePrice: "", stock: "", sku: "", brand: "Xerox", categoryId: categories[0]?.id || "", images: "", specifications: "", featured: false, isActive: true }); setShowAddProduct(true); }} className="btn btn-primary btn-sm">
                <Plus size={16} /> Add Product
              </button>
            </div>

            {showAddProduct && (
              <div className="card animate-fade-in" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <h3 style={{ fontWeight: 700 }}>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                  <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }} className="btn btn-ghost btn-sm"><X size={16} /></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                  {[
                    { f: "name", l: "Product Name *", ph: "Xerox WorkCentre 7845" },
                    { f: "slug", l: "Slug *", ph: "xerox-workcentre-7845" },
                    { f: "brand", l: "Brand", ph: "Xerox" },
                    { f: "sku", l: "SKU", ph: "XWC7845-001" },
                    { f: "price", l: "Price (₹) *", ph: "75000" },
                    { f: "comparePrice", l: "Compare Price (₹)", ph: "90000" },
                    { f: "stock", l: "Stock *", ph: "10" },
                  ].map(({ f, l, ph }) => (
                    <div key={f}>
                      <label style={{ display: "block", fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.375rem" }}>{l}</label>
                      <input type={["price", "comparePrice", "stock"].includes(f) ? "number" : "text"} className="input" placeholder={ph}
                        value={(productForm as any)[f]} onChange={e => setProductForm(p => ({ ...p, [f]: e.target.value }))} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.375rem" }}>Category</label>
                    <select className="input" value={productForm.categoryId} onChange={e => setProductForm(p => ({ ...p, categoryId: e.target.value }))}>
                      <option value="">-- Select Category --</option>
                      {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.375rem" }}>Description *</label>
                    <textarea className="input" rows={4} placeholder="Product description..." value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} style={{ resize: "vertical" }} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.375rem" }}>Image URLs (one per line)</label>
                    <textarea className="input" rows={3} placeholder="https://example.com/image1.jpg" value={productForm.images} onChange={e => setProductForm(p => ({ ...p, images: e.target.value }))} style={{ resize: "vertical" }} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.375rem" }}>Specifications (Key: Value, one per line)</label>
                    <textarea className="input" rows={4} placeholder="Print Speed: 45 ppm&#10;Paper Size: A4, A3&#10;Connectivity: USB, LAN, WiFi" value={productForm.specifications} onChange={e => setProductForm(p => ({ ...p, specifications: e.target.value }))} style={{ resize: "vertical" }} />
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
                      <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm(p => ({ ...p, featured: e.target.checked }))} />
                      Featured Product
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
                      <input type="checkbox" checked={productForm.isActive} onChange={e => setProductForm(p => ({ ...p, isActive: e.target.checked }))} />
                      Active
                    </label>
                  </div>
                </div>
                <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
                  <button onClick={handleSaveProduct} className="btn btn-primary"><Check size={16} /> {editingProduct ? "Update Product" : "Create Product"}</button>
                  <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table className="table-base">
                <thead>
                  <tr><th>Product</th><th>Price</th><th>Stock</th><th>Category</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {products.map((product: any) => {
                    const img = (() => { try { return JSON.parse(product.images)[0]; } catch { return null; } })();
                    return (
                      <tr key={product.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            {img && <img src={img} alt="" style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", objectFit: "cover" }} />}
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{product.name}</div>
                              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 700 }}>{formatPrice(product.price)}</td>
                        <td><span className={`badge ${product.stock > 5 ? "badge-green" : product.stock > 0 ? "badge-gold" : "badge-red"}`}>{product.stock}</span></td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{product.category?.name}</td>
                        <td>
                          {product.isActive ? <span className="badge badge-green">Active</span> : <span className="badge badge-red">Inactive</span>}
                          {product.featured && <span className="badge badge-gold" style={{ marginLeft: "0.375rem" }}>Featured</span>}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button onClick={() => startEdit(product)} className="btn btn-secondary btn-sm" title="Edit"><Edit size={14} /></button>
                            <button onClick={() => handleDeleteProduct(product.id, product.name)} className="btn btn-danger btn-sm" title="Deactivate"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>All Orders</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="table-base">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {stats?.recentOrders?.map((order: any) => (
                    <tr key={order.id}>
                      <td><a href={`/account/orders/${order.id}`} style={{ color: "var(--accent-secondary)", fontFamily: "monospace", fontSize: "0.8rem" }}>#{order.id.slice(-8).toUpperCase()}</a></td>
                      <td><div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{order.user?.name}</div></td>
                      <td>{order.items?.length} item(s)</td>
                      <td style={{ fontWeight: 700 }}>{formatPrice(order.total)}</td>
                      <td><span className={`badge ${order.paymentStatus === "PAID" ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.75rem" }}>{order.paymentStatus}</span></td>
                      <td><span className={`badge ${getOrderStatusColor(order.status)}`} style={{ fontSize: "0.75rem" }}>{order.status}</span></td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

