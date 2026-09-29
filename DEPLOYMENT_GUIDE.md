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

## ⚙️ Step 4: Live Backend Cloud Hosting (Render / Railway / Docker)

Since GitHub Pages only hosts static web applications, your Node.js + Express + Prisma Backend server can be hosted for free on **Render**:

### Deploying on Render (Free 1-Click Deployment):
1. Sign up/Log in at [Render.com](https://render.com) using your GitHub account (`TIRTHMEVADA24`).
2. Click **New +** -> **Blueprint**.
3. Connect your **`TIRTHMEVADA24/Nirmaan`** repository.
4. Render will automatically detect the `render.yaml` file added to the project and deploy the backend service (`nirmaan-backend`).
5. Copy your live backend service URL (e.g. `https://nirmaan-backend.onrender.com`).

---

## 🔗 Step 5: Connecting Frontend to Backend

In your GitHub repository (`https://github.com/TIRTHMEVADA24/Nirmaan`):
1. Go to **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret**.
3. Set **Name**: `VITE_API_BASE_URL`
4. Set **Value**: `https://<your-render-backend-url>/api/v1`
5. Re-run the GitHub Actions workflow to update the frontend.

---

## 🐳 Step 6: Docker Container Hosting (Optional Alternative)

You can also run both Frontend & Backend anywhere using Docker Compose:
```bash
docker compose up --build
```
- **Frontend**: `http://localhost:80`
- **Backend API**: `http://localhost:5000`
