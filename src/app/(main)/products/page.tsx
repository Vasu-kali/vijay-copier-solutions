"use client";
import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, ChevronDown, X, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

const CATEGORIES = [
  { slug: "office", label: "Office Machines" },
  { slug: "commercial", label: "Commercial Copiers" },
  { slug: "industrial", label: "Industrial Printers" },
  { slug: "all-in-one", label: "All-in-One" },
  { slug: "color", label: "Color Copiers" },
  { slug: "eco", label: "Eco Range" },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    featured: searchParams.get("featured") === "true",
  });

  const getFirstImage = (images: string) => {
    try { return JSON.parse(images)[0] || "/placeholder-machine.jpg"; } catch { return "/placeholder-machine.jpg"; }
  };

  const fetchProducts = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.featured) params.set("featured", "true");
      params.set("page", String(pg));
      params.set("limit", "12");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setPage(pg);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(1); }, [fetchProducts]);

  const clearFilter = (key: string) => setFilters(f => ({ ...f, [key]: key === "featured" ? false : "" }));
  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== "sort").length;

  return (
    <div style={{ padding: "2rem 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, marginBottom: "0.5rem" }}>
            {filters.search ? `Search: "${filters.search}"` : filters.category ? CATEGORIES.find(c => c.slug === filters.category)?.label || "Products" : filters.featured ? "⭐ Featured Deals" : "All Xerox Machines"}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>{loading ? "Loading..." : `${total} products found`}</p>
        </div>

        {/* Search + Sort bar */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="search"
              className="input"
              style={{ paddingLeft: "2.5rem" }}
              placeholder="Search machines..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>

          <select
            className="input"
            style={{ width: "auto", minWidth: 180 }}
            value={filters.sort}
            onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn btn-secondary" style={{ position: "relative" }}>
            <SlidersHorizontal size={16} />
            Filters
            {activeFilters > 0 && <span className="badge badge-blue" style={{ position: "absolute", top: -8, right: -8 }}>{activeFilters}</span>}
          </button>
        </div>

        {/* Active filters */}
        {activeFilters > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {filters.search && <span className="badge badge-blue" style={{ cursor: "pointer", gap: 4 }} onClick={() => clearFilter("search")}>
              Search: {filters.search} <X size={12} />
            </span>}
            {filters.category && <span className="badge badge-blue" style={{ cursor: "pointer", gap: 4 }} onClick={() => clearFilter("category")}>
              Category: {CATEGORIES.find(c => c.slug === filters.category)?.label} <X size={12} />
            </span>}
            {filters.featured && <span className="badge badge-gold" style={{ cursor: "pointer", gap: 4 }} onClick={() => clearFilter("featured")}>
              Featured only <X size={12} />
            </span>}
            <button onClick={() => setFilters({ search: "", category: "", sort: "newest", minPrice: "", maxPrice: "", featured: false })} className="btn btn-ghost btn-sm" style={{ fontSize: "0.75rem" }}>
              Clear All
            </button>
          </div>
        )}

        {/* Filters panel */}
        {filtersOpen && (
          <div className="card animate-fade-in" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.75rem", display: "block" }}>Category</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <button onClick={() => setFilters(f => ({ ...f, category: "" }))} className={`btn btn-sm ${!filters.category ? "btn-primary" : "btn-ghost"}`} style={{ justifyContent: "flex-start" }}>All Categories</button>
                  {CATEGORIES.map(cat => (
                    <button key={cat.slug} onClick={() => setFilters(f => ({ ...f, category: cat.slug }))} className={`btn btn-sm ${filters.category === cat.slug ? "btn-primary" : "btn-ghost"}`} style={{ justifyContent: "flex-start" }}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.75rem", display: "block" }}>Price Range (₹)</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input type="number" className="input" placeholder="Min" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                  <input type="number" className="input" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.75rem", display: "block" }}>Special</label>
                <button onClick={() => setFilters(f => ({ ...f, featured: !f.featured }))} className={`btn btn-sm ${filters.featured ? "btn-gold" : "btn-secondary"}`}>
                  ⭐ Featured Only
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "5rem 0" }}>
            <Loader2 size={40} style={{ color: "var(--accent-primary)", animation: "spin 1s linear infinite" }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>No products found</h3>
            <p style={{ marginBottom: "1.5rem" }}>Try adjusting your search or filters</p>
            <button onClick={() => setFilters({ search: "", category: "", sort: "newest", minPrice: "", maxPrice: "", featured: false })} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {products.map(p => (
                <ProductCard key={p.id}
                  id={p.id} name={p.name} slug={p.slug} price={p.price} comparePrice={p.comparePrice}
                  image={getFirstImage(p.images)} rating={p.rating} reviewCount={p.reviewCount}
                  stock={p.stock} brand={p.brand} featured={p.featured} category={p.category?.name}
                />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem", flexWrap: "wrap" }}>
                <button onClick={() => fetchProducts(page - 1)} disabled={page === 1} className="btn btn-secondary btn-sm">← Prev</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => fetchProducts(p)} className={`btn btn-sm ${p === page ? "btn-primary" : "btn-secondary"}`}>{p}</button>
                ))}
                <button onClick={() => fetchProducts(page + 1)} disabled={page === pages} className="btn btn-secondary btn-sm">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

