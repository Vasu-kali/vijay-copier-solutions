# Vijay Copier Solutions — Full Stack E-Commerce

> India's premier xerox machine e-commerce platform. Built with Next.js 14, Prisma, NextAuth.js, and Stripe.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ 
- npm 9+

### 1. Clone & Install
```bash
cd project
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and fill in your values:
- `NEXTAUTH_SECRET` — Run `openssl rand -base64 32` to generate one
- `STRIPE_SECRET_KEY` — Get from [stripe.com/dashboard](https://dashboard.stripe.com)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Same Stripe dashboard

### 3. Set Up Database
```bash
npm run db:push    # Create database tables
npm run db:seed    # Seed with demo data and products
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Login Credentials
| Role  | Email                          | Password |
|-------|-------------------------------|----------|
| Admin | admin@vijaycopiersolutions.com  | admin123 |
| User  | demo@example.com              | user123  |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (main)/          # Public-facing pages (Navbar + Footer)
│   │   ├── page.tsx     # Homepage
│   │   ├── products/    # Product catalog + detail
│   │   ├── checkout/    # Checkout flow
│   │   ├── account/     # User dashboard
│   │   └── admin/       # Admin panel
│   ├── auth/            # Login & Register pages
│   └── api/             # API routes
│       ├── auth/        # NextAuth + Register
│       ├── products/    # Products API
│       ├── orders/      # Orders API
│       ├── checkout/    # Stripe checkout
│       ├── webhook/     # Stripe webhook
│       ├── reviews/     # Product reviews
│       ├── addresses/   # User addresses
│       └── admin/       # Admin APIs
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CartDrawer.tsx
│   ├── ProductCard.tsx
│   └── Providers.tsx
├── lib/
│   ├── prisma.ts        # DB client
│   ├── stripe.ts        # Stripe client
│   └── utils.ts         # Helpers
├── store/
│   └── cart.ts          # Zustand cart
└── auth.ts              # NextAuth config
```

---

## 🔐 Security Features

- ✅ **bcrypt** password hashing (12 salt rounds)
- ✅ **JWT sessions** via NextAuth.js
- ✅ **Role-based access control** (USER / ADMIN)
- ✅ **Middleware** route protection
- ✅ **Zod validation** on all API inputs
- ✅ **Prisma ORM** (prevents SQL injection)
- ✅ **Stripe webhook signature** verification
- ✅ **Security HTTP headers** (CSP, HSTS, X-Frame-Options)
- ✅ **HTTPS-ready** (configure in deployment)

---

## 💳 Stripe Test Cards

| Card Number          | Use Case      |
|---------------------|---------------|
| 4242 4242 4242 4242 | Successful    |
| 4000 0000 0000 0002 | Declined      |
| 4000 0025 0000 3155 | 3DS Required  |

Use any future expiry, any 3-digit CVV.

---

## 🌐 Deployment (Vercel)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Set `DATABASE_URL` to a PostgreSQL URL (e.g., [Supabase](https://supabase.com), [Railway](https://railway.app), or [Neon](https://neon.tech))
5. Update `prisma/schema.prisma` datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. Deploy!

### Stripe Webhooks (Production)
Add Stripe webhook endpoint: `https://yourdomain.com/api/webhook/stripe`
Events: `checkout.session.completed`, `checkout.session.expired`

---

## 📊 Admin Panel

Access at `/admin` (login required with ADMIN role).

Features:
- 📈 Dashboard with revenue, orders, users stats
- 🛍️ Product management (Add/Edit/Delete)
- 📦 Order management and status updates

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | SQLite (dev) → PostgreSQL (prod) |
| ORM | Prisma |
| Auth | NextAuth.js v5 |
| Payments | Stripe |
| State | Zustand |
| Styling | Tailwind CSS + Custom CSS |
| Forms | React Hook Form + Zod |

---

Built with ❤️ by Vijay Copier Solutions Team
