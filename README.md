# 🏭 Nirmaan — B2B Sourcing & Manufacturing Platform for D2C Brands

> **"From Product Idea to Ready-to-Sell Business."**

**Nirmaan** is an end-to-end B2B sourcing, custom manufacturing, and packaging platform tailored for emerging D2C brands, Instagram stores, Shopify merchants, and online entrepreneurs (starting with fashion jewellery, accessories, and custom brand packaging).

---

## 🌟 Key Highlights & Architecture

- **Frontend**: React 19, TypeScript, Vite 8, TailwindCSS v4, Framer Motion, Lucide Icons, Recharts.
- **Backend API**: Node.js (ES Modules), TypeScript, Express.js REST API with Zod validation, JWT authentication, and Helmet security.
- **Database & ORM**: PostgreSQL hosted on **Supabase**, modeled with **Prisma ORM** (16 tables covering all core B2B domains).
- **High-Availability Architecture**: Dual-mode data gateway that supports pooled transactions (`Port 6543`), direct migrations (`Port 5432`), and automatic Supabase REST fallback.
- **Hosting**:
  - **Backend API**: [Render Cloud Web Service](https://nirmaan-backend-61wm.onrender.com) (Node 20 runtime)
  - **Frontend Client**: [Vercel](https://vercel.com) & [GitHub Pages](https://tirthmevada24.github.io/NIRMAN/)
  - **Database**: [Supabase PostgreSQL (AWS ap-northeast-1)](https://supabase.com)

---

## 🚀 Live Deployments & Endpoints

| Component | Platform | Live URL / Endpoint | Status |
| :--- | :--- | :--- | :---: |
| **Backend API** | Render | [`https://nirmaan-backend-61wm.onrender.com`](https://nirmaan-backend-61wm.onrender.com) | 🟢 Live |
| **Health Check** | Render | [`/api/health`](https://nirmaan-backend-61wm.onrender.com/api/health) | 🟢 200 OK |
| **Products API** | Render / Supabase | [`/api/v1/products`](https://nirmaan-backend-61wm.onrender.com/api/v1/products) | 🟢 200 OK |
| **Manufacturers API**| Render / Supabase | [`/api/v1/manufacturers`](https://nirmaan-backend-61wm.onrender.com/api/v1/manufacturers) | 🟢 200 OK |
| **Frontend Web App** | GitHub Pages / Vercel | [`https://tirthmevada24.github.io/NIRMAN/`](https://tirthmevada24.github.io/NIRMAN/) | 🟢 Deployed |
| **Database** | Supabase | Project `NIRMAN` (`dylqlvwshrywdxzhdobe`) | 🟢 Active |

---

## 📦 Features & Capabilities

### 1. 🔐 Multi-Role Authentication & Security
- Distinct roles: `BUYER`, `MANUFACTURER`, and `ADMIN`.
- JWT session management, bcrypt password hashing, and role-based route protection.

### 2. 💎 Product Catalog & Smart Sourcing
- 20 seeded catalog products across 8 categories (Earrings, Necklaces, Rings, Packaging, Kundan & Bridal, Waterproof Everyday, Chains & Findings, Bracelets).
- Low MOQ discovery (order as low as 15–50 pieces).
- Debounced search, category filters, price sorting, and verified supplier filters.

### 3. 🏭 Manufacturer Verification & Directory
- Directory of 8 verified Indian factories across Jaipur, Rajkot, Ahmedabad, Greater Noida, Hyderabad, and Bengaluru.
- Factory details: Production capacities (up to 50,000 units/mo), minimum order quantities, review counts, and verified certifications (BIS Hallmark, ISO 9001, FSC Certified).

### 4. 📝 RFQ (Request for Quote) System
- Buyers can post detailed custom manufacturing requirements with target pricing and required deadlines.
- Manufacturers can review open RFQs and submit itemized quotations.
- Side-by-side quote comparison and one-click quote acceptance.

### 5. 📦 Order Lifecycle & Production Milestones
- Seamless transition from accepted quotes to production orders.
- Milestone tracking: *Raw Material Procurement* → *Casting & Polishing* → *Quality Audit* → *Shipping*.
- Packaging customization module with brand logo stamping.

---

## 🛠️ Tech Stack & Directory Structure

```text
NIRMAN/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Prisma Schema with dual-connection URLs
│   │   ├── initial_schema.sql    # Base PostgreSQL DDL migration
│   │   ├── seed.sql              # Core seeded platform users & sample data
│   │   └── expand_catalog.sql    # Expanded manufacturers, categories & products
│   ├── src/
│   │   ├── config/               # Database and Zod environment loaders
│   │   ├── controllers/          # Express route controllers
│   │   ├── middleware/           # Auth, error, and validation middlewares
│   │   ├── routes/               # Modular REST routes
│   │   ├── schemas/              # Zod input validation schemas
│   │   ├── services/             # Business logic & dual-mode data gateway
│   │   └── server.ts             # Express entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/client.ts         # Axios client with automated Supabase fallback
│   │   ├── components/           # Reusable UI components
│   │   ├── contexts/             # Auth and global state contexts
│   │   ├── pages/                # Discover, Manufacturers, Orders, Admin, etc.
│   │   └── main.tsx
│   ├── vercel.json               # SPA routing rewrite configuration for Vercel
│   ├── Dockerfile
│   └── package.json
│
├── .github/workflows/
│   ├── backend-ci.yml            # Automated Prisma & TypeScript build CI
│   └── deploy-frontend.yml       # GitHub Pages deployment pipeline
├── docker-compose.yml            # Multi-container local orchestration
├── render.yaml                   # Infrastructure-as-code Blueprint for Render
└── DEPLOYMENT_GUIDE.md           # Step-by-step deployment guide
```

---

## ⚙️ How It's Deployed

### 1. Database Deployment (Supabase PostgreSQL)
The database is hosted on Supabase (Tokyo region `ap-northeast-1`):
1. Tables were provisioned using Prisma migrations (`schema.prisma` targeting PostgreSQL).
2. Connected via dual-connection architecture:
   - **Transaction Pooler (`Port 6543`)**: Handles high-concurrency queries from the Express server.
   - **Direct Session (`Port 5432`)**: Used for DDL schema pushes and migrations.
3. Seeded with 8 manufacturers, 8 categories, 20 products, sample RFQs, quotes, and active orders.

### 2. Backend Deployment (Render)
The backend is deployed on Render as a Node.js Web Service using `render.yaml`:
- **Build Command**: `npm install && npm run prisma:generate && npm run build`
- **Start Command**: `node dist/server.js`
- **Environment Variables**:
  - `DATABASE_URL`: Supabase transaction pooler URI
  - `DIRECT_URL`: Supabase direct connection URI
  - `JWT_SECRET`: Production cryptographic key
  - `PORT`: `5000`

### 3. Frontend Deployment (Vercel & GitHub Actions)
- **Vercel**: Configured with `frontend/vercel.json` providing single-page application (SPA) routing rewrites so client-side routes (like `/discover`, `/manufacturers`, `/orders`) resolve cleanly without 404s.
- **GitHub Pages**: Automated on push to `main` via `.github/workflows/deploy-frontend.yml`.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm / pnpm / git

### 1. Clone the repository
```bash
git clone https://github.com/TIRTHMEVADA24/NIRMAN.git
cd NIRMAN
```

### 2. Setup & Run Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npm run dev
```
Backend runs at: `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)

### 3. Setup & Run Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173` (or the port specified by Vite).

---

## 🔑 Demo Login Accounts

All pre-seeded demo accounts use password: **`password123`**

| Role | Email | Name / Company |
| :--- | :--- | :--- |
| **Admin** | `admin@nirmaan.com` | Super Admin (Nirmaan Ops) |
| **Buyer** | `buyer@d2c.com` | Riya Sharma (Lumina Jewels) |
| **Buyer** | `founder@aesthetic.com` | Kabir Singh (Aesthetic Aura) |
| **Manufacturer** | `mfr@factory.com` | Amit Patel (Artisan Metals Co. - Verified 4.8★) |
| **Manufacturer** | `kundan@heritagecrafts.in` | Vikramaditya Rathore (Heritage Kundan - Verified 4.9★) |

---

## 📄 License
This project is proprietary and built for the Nirmaan Platform.
