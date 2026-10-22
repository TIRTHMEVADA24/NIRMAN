# 🚀 Complete GitHub & Cloud Deployment Guide for `TIRTHMEVADA24`

This guide explains how to push and deploy the **Nirmaan Sourcing & Manufacturing Platform** (Frontend + Backend) to your GitHub account: **`TIRTHMEVADA24`**.

---

## 📌 Step 1: Remote Repository Configuration

The repository remote URL has been updated to your GitHub account:

```bash
git remote set-url origin https://github.com/TIRTHMEVADA24/Nirmaan.git
```

---

## 🔑 Step 2: Push Code to GitHub

### Option A: Push via Personal Access Token (PAT)
If you have a GitHub Personal Access Token with `repo` permissions:
```bash
git push https://<YOUR_PAT_TOKEN>@github.com/TIRTHMEVADA24/Nirmaan.git main
```

### Option B: Push directly via Terminal (Recommended)
Run the following in VS Code terminal or Git Bash (Windows Git Credential Manager will prompt you to log into GitHub as `TIRTHMEVADA24`):
```bash
git push -u origin main
```

---

## 🌐 Step 3: Frontend Deployment on GitHub Pages (Automated)

We have created an automated **GitHub Actions Workflow** at `.github/workflows/deploy-frontend.yml`.

### Enable GitHub Pages in your Repository:
1. Go to your GitHub Repository: `https://github.com/TIRTHMEVADA24/Nirmaan`
2. Click **Settings** ⚙️ -> **Pages**.
3. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. Push your code. The workflow will automatically build and publish your Vite React Frontend at:
   👉 **`https://TIRTHMEVADA24.github.io/Nirmaan/`**

---

## ⚙️ Step 4: Connecting Backend to Supabase PostgreSQL & Hosting on Render / Railway

The backend is configured with **Prisma ORM** specifically tuned for **Supabase PostgreSQL** using connection pooling and direct migration URLs.

### 4.1. Set Up Your Free Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project** (Name: `Nirmaan`, choose the closest region to your users).
3. Set a strong database password and save it securely.
4. Once created, go to **Project Settings** (gear icon) ⚙️ -> **Database**.
5. Under **Connection string**:
   - Select **URI** mode and check **Mode: Transaction** (Port `6543`). Copy this as your `DATABASE_URL`:
     ```env
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - Uncheck "Use connection pooling" or select **Mode: Session** (Port `5432`). Copy this as your `DIRECT_URL`:
     ```env
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
     ```

### 4.2. Push Database Schema to Supabase
You can initialize and push the tables to Supabase directly from your terminal:
```bash
cd backend
npx prisma db push
```
*(All 13 domain models: users, buyer_profiles, manufacturer_profiles, products, rfqs, quotes, orders, milestones, sample_requests, payments, reviews, packaging_products/orders, and messages will be created in your Supabase database).*

### 4.3. Deploy Backend API to Cloud (Render / Railway)
#### On Render:
1. Log in at [Render.com](https://render.com) using your GitHub account (`TIRTHMEVADA24`).
2. Click **New +** -> **Web Service** (or use the Blueprint from `render.yaml`).
3. Connect your **`TIRTHMEVADA24/Nirmaan`** repository.
4. Set root directory to `backend`.
5. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your Supabase transaction pooler URI (Port 6543)
   - `DIRECT_URL`: Your Supabase direct connection URI (Port 5432)
   - `JWT_SECRET`: A secure random secret string
   - `NODE_ENV`: `production`
6. Deploy! Render will build and start your Express server.
7. Copy your live backend service URL (e.g. `https://nirmaan-backend.onrender.com`).

---

## 🔗 Step 5: Connecting Frontend to Backend

In your GitHub repository (`https://github.com/TIRTHMEVADA24/Nirmaan`):
1. Go to **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret**.
3. Set **Name**: `VITE_API_BASE_URL`
4. Set **Value**: `https://<your-render-backend-url>/api/v1`
5. Re-run the GitHub Actions workflow to update the frontend.

---

## ⚡ Step 6: Deploy Frontend to Vercel (Recommended 1-Click)

A pre-configured [`vercel.json`](file:///c:/Users/RAHUL/OneDrive/Documents/NIRMAN/vercel.json) has been added to root with automatic SPA routing rewrites.

### Steps to Deploy on Vercel:
1. Log in to [Vercel](https://vercel.com) using your GitHub account (`TIRTHMEVADA24`).
2. Click **Add New...** -> **Project**.
3. Import the repository: **`TIRTHMEVADA24/NIRMAN`**.
4. In the Project Configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or leave default, `vercel.json` automatically builds `frontend`)
5. Under **Environment Variables**, add:
   | Variable | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | Your Render / Railway backend URL (e.g. `https://nirmaan-backend.onrender.com/api/v1`) |
   | `VITE_SUPABASE_URL` | `https://dylqlvwshrywdxzhdobe.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHFsdndzaHJ5d2R4emhkb2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NTgwMjUsImV4cCI6MjEwODIzNDAyNX0.RFPXrFIJRXXyHxeqIklttjnnUD4dqrYq4HWr0JlvqhM` |
6. Click **Deploy**. Vercel will build and assign you a fast global edge domain (e.g. `https://nirman.vercel.app`).

---

## 🔑 Supabase Live API Reference Summary (Project: NIRMAN)

- **Supabase Project URL**: `https://dylqlvwshrywdxzhdobe.supabase.co`
- **Publishable / Anon Key**:
  ```text
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHFsdndzaHJ5d2R4emhkb2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NTgwMjUsImV4cCI6MjEwODIzNDAyNX0.RFPXrFIJRXXyHxeqIklttjnnUD4dqrYq4HWr0JlvqhM
  ```
- **PostgreSQL Pooler Host**: `aws-0-ap-northeast-1.pooler.supabase.com:6543`
- **PostgreSQL Direct Host**: `db.dylqlvwshrywdxzhdobe.supabase.co:5432`
