"use client";
import Link from "next/link";
import { Phone, Mail, MapPin, Globe, MessageCircle, Camera, Video, Share2, Printer } from "lucide-react";

const footerLinks = {
  products: [
    { label: "Office Xerox Machines", href: "/products?category=office" },
    { label: "Commercial Copiers", href: "/products?category=commercial" },
    { label: "Industrial Printers", href: "/products?category=industrial" },
    { label: "All-in-One Machines", href: "/products?category=all-in-one" },
    { label: "Special Deals", href: "/products?featured=true" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Track Your Order", href: "/account/orders" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Service Centers", href: "/service" },
    { label: "Contact Us", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Warranty Policy", href: "/warranty" },
  ],
};

const SOCIALS = [
  { icon: Globe, href: "#", title: "Website" },
  { icon: MessageCircle, href: "#", title: "Twitter" },
  { icon: Camera, href: "#", title: "Instagram" },
  { icon: Video, href: "#", title: "YouTube" },
  { icon: Share2, href: "#", title: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", marginTop: "auto" }}>
      <div className="container" style={{ padding: "4rem 1rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem" }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "linear-gradient(135deg, var(--accent-primary), #0284c7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px var(--accent-glow)"
              }}>
                <Printer size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.1rem" }}>Vijay Copier</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>SOLUTIONS</div>
              </div>
            </Link>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              India's premier destination for high-quality Xerox and copier machines. Trusted by 10,000+ businesses nationwide since 2010.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {SOCIALS.map(({ icon: Icon, href, title }) => (
                <a key={title} href={href} title={title} className="footer-social">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Products", links: footerLinks.products },
            { title: "Company", links: footerLinks.company },
            { title: "Support", links: footerLinks.support },
            { title: "Legal", links: footerLinks.legal },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9375rem" }}>{title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="footer-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {[
            { icon: Phone, label: "+91 99514 87200", href: "tel:+919951487200" },
            { icon: Mail, label: "mallepally.vijay@gmail.com", href: "mailto:mallepally.vijay@gmail.com" },
            { icon: MapPin, label: "Kukatpally Housing Board Colony, Hyderabad - 500072, Telangana", href: "https://maps.google.com/?q=Kukatpally+Housing+Board+Colony+Hyderabad" },
          ].map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} className="footer-contact">
              <Icon size={16} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border-color)", padding: "1.25rem 1rem" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
          <span>© {new Date().getFullYear()} Vijay Copier Solutions. All rights reserved.</span>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span>🔒 SSL Secured</span>
            <span>💳 Secure Payments</span>
            <span>🚚 Pan India Delivery</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: var(--text-muted);
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: var(--text-primary); }
        .footer-social {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--bg-elevated); border: 1px solid var(--border-color);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); transition: var(--transition);
        }
        .footer-social:hover { background: var(--accent-primary); color: #fff; border-color: var(--accent-primary); }
        .footer-contact {
          display: flex; align-items: center; gap: 0.75rem;
          color: var(--text-secondary); font-size: 0.875rem; transition: color 0.2s ease;
        }
        .footer-contact:hover { color: var(--text-primary); }
      `}</style>
    </footer>
  );
}
