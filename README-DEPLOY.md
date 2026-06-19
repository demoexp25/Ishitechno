# Ishi Techno Projects — Website

A scalable, multi-page, framework-free enterprise website (pure HTML/CSS/JS) ready for free GitHub Pages hosting.

## 📁 Folder Structure
```
/
├── index.html
├── about.html
├── services.html        ← includes pricing + Razorpay payment buttons
├── projects.html         ← 20+ filterable project cards
├── gallery.html
├── technologies.html
├── contact.html          ← enquiry form + Razorpay payment
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
└── README-DEPLOY.md
```

## 🚀 Deploy to GitHub Pages (free hosting, scales automatically)

1. **Create a GitHub repository** (e.g. `ishi-techno-projects`).
2. Push this folder's contents to the repo root:
   ```bash
   cd ishi
   git init
   git add .
   git commit -m "Launch Ishi Techno Projects website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ishi-techno-projects.git
   git push -u origin main
   ```
3. In GitHub: **Settings → Pages → Source → Deploy from branch → `main` / `(root)`** → Save.
4. Your site goes live at `https://YOUR_USERNAME.github.io/ishi-techno-projects/`.
5. **Custom domain (ishitechnoprojects.in):**
   - Add a file named `CNAME` to the repo root containing exactly: `ishitechnoprojects.in`
   - In your domain registrar's DNS, add:
     - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     - `CNAME` record for `www` → `YOUR_USERNAME.github.io`
   - Back in GitHub Pages settings, enter the custom domain and enable **Enforce HTTPS**.

Because this is a 100% static site (no build step, no server), every push to `main` redeploys automatically — it scales to any traffic level GitHub Pages allows at no extra cost, and you can move it to any other static host (Netlify, Vercel, Cloudflare Pages) at any time by copying the same folder.

## 💳 Payment Setup — Razorpay (no backend required)

This site uses **Razorpay Checkout** in client-side mode, which works on static hosting like GitHub Pages.

### Quick setup (current implementation)
1. Create a free account at [razorpay.com](https://razorpay.com) and complete KYC.
2. Go to **Dashboard → Settings → API Keys** and generate a **Key ID** (use the Test key first).
3. Open `assets/js/main.js` and replace:
   ```js
   const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';
   ```
   with your real Key ID, e.g. `rzp_live_xxxxxxxxxxxx`.
4. That's it — the **Pay Now / Pay Advance** buttons on `services.html` and `contact.html` will open the Razorpay checkout popup.

### ⚠️ Important security note
Client-side-only Checkout (used here) is the simplest way to accept payments on a static site, but it does **not verify payment server-side** — a user could close the popup before paying and you'd want to manually confirm payment IDs, or a malicious user could attempt to forge a success state in the browser. For low-to-medium value advance payments this is commonly acceptable (you always reconcile against your Razorpay Dashboard before starting work), but for production/high-value transactions, consider one of these upgrades:

- **Razorpay Payment Pages / Payment Buttons** (created free in the Dashboard, no code/key needed) — generate a hosted payment link per package and simply link/embed it. Most secure option for a static site with zero backend.
- **A small serverless function** (e.g. a free Cloudflare Worker or Vercel Function) to create orders and verify payment signatures server-side, if you later want fully verified, automatic order confirmation.

Either way, always reconcile incoming payments against your Razorpay Dashboard and confirm orders with customers via WhatsApp/email before beginning work — the contact form and WhatsApp button are designed to make that handoff easy.

## ✉️ Contact Form

The enquiry form on `contact.html` opens the visitor's email client with a pre-filled message to `ishitharoy.mi@gmail.com` (works on any static host, no backend needed). If you'd like form submissions to land in an inbox or spreadsheet without opening the user's mail app, connect a service like **Formspree**, **Web3Forms**, or **Google Forms** by pointing the `<form>` at their endpoint — ask if you'd like this wired up.

## 🛠 Editing Content
- All page copy is plain HTML — edit directly in each `.html` file.
- Colors, type and spacing are controlled via CSS variables at the top of `assets/css/style.css` (`:root`) — change once, updates everywhere.
- To add a new project card, copy a `.project-card` block in `projects.html` and set the right `data-category`.
- Replace placeholder images in `assets/images/` (`favicon.png`, `logo-mark.png`, `og-cover.jpg`) with your real logo/branding.

## ✅ SEO Included
- Unique meta titles/descriptions per page
- Open Graph + Twitter Card tags
- `Organization` and `ContactPage` Schema.org JSON-LD
- Semantic headings, alt text on all images, canonical URLs
