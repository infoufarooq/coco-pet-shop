# 🐾 CoCo & Candy – Pet Accessories Shop

> **Premium Pet Accessories, Nutrition & Care Across Pakistan**

A modern, responsive e-commerce web application built for **CoCo & Candy – Pet Accessories Shop** using **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide React**.

---

## 🌟 Key Features

- **Authoritative Brand Identity:** Built faithfully inspired by the real brand colors (Navy `#093672`, Golden Amber `#ffd21d`, Warm Neutrals), official categories, verified Lahore/Faisalabad distribution details, and genuine store wording.
- **Search & Filterable Catalog (`/shop`):** Real-time product search with autocomplete, category filtering, pet-type selector (🐶 Dogs, 🐱 Cats, All), price range sliders, in-stock/sale toggles, and sorting options.
- **Interactive Product Detail Pages (`/shop/[id]`):** High-resolution image galleries, variant/size/flavor selection with live price recalculations, stock indicators, quantity pickers, and tabbed specifications.
- **Persistent Shopping Bag (`/cart` & Drawer):** Off-canvas slide-out cart and dedicated cart page with `localStorage` persistence, interactive quantity updates, and free shipping progress meter (Threshold: Rs. 3,500).
- **Pakistan-Specific Checkout (`/checkout`):** Localized city picker across major Pakistani cities, Cash on Delivery (COD), Direct Bank Transfer (IBFT), and WhatsApp order validation generating instant Order IDs (`COCO-PK-XXXXXX`) with celebratory confetti.
- **Direct WhatsApp Ordering & Customer Support:** One-click WhatsApp link builder formatting complete order summaries (customer name, items, variants, quantities, total PKR) ready for instant dispatch coordination.
- **Full Static Page Suite:**
  - `Home`: High-impact hero, category grid, deal countdown timer, tabbed featured products, why shop with us pillars, customer testimonials, and newsletter voucher unlock.
  - `About Us (`/about`)`: Real story, animal care promise, and quality standards.
  - `Contact (`/contact`)`: Validated inquiry form, support helpline, WhatsApp direct link, and store center details.
  - `FAQs & Policies (`/faq`, `/policies/shipping`, `/policies/returns`, `/policies/privacy`)`: Transparent shipping timeframes, 7-day exchange guarantees, and privacy terms.
  - `Wishlist (`/wishlist`)`: Client-side saved pet favorites.
- **Technical & SEO Standards:** Dynamic `sitemap.xml`, `robots.txt`, OpenGraph cards, Twitter preview cards, accessibility compliance, and mobile-first responsive design.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v18.18+ or v20+
- **npm** or **pnpm** or **yarn**

### 2. Installation
```bash
git clone <repository-url>
cd pet-shop
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore the store.

### 4. Building for Production
```bash
npm run build
npm start
```

---

## 📁 Project Architecture

```text
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with fonts, providers & header/footer
│   │   ├── page.tsx               # Homepage with hero, flash sale, tabs, testimonials
│   │   ├── globals.css            # Custom scrollbars & Tailwind base
│   │   ├── sitemap.ts             # Dynamic XML sitemap
│   │   ├── robots.ts              # Robots.txt generator
│   │   ├── shop/
│   │   │   ├── page.tsx           # Searchable & filterable shop catalog
│   │   │   └── [id]/page.tsx      # Comprehensive product detail page
│   │   ├── cart/page.tsx          # Full cart & subtotal breakdown
│   │   ├── checkout/page.tsx      # Checkout & confirmation view
│   │   ├── wishlist/page.tsx      # Saved favorites page
│   │   ├── about/page.tsx         # Brand story & values
│   │   ├── contact/page.tsx       # Contact form & location details
│   │   ├── faq/page.tsx           # FAQ accordion
│   │   └── policies/              # Shipping, Returns & Privacy policies
│   ├── components/
│   │   ├── layout/                # Header, Footer, MobileNav
│   │   ├── home/                  # HeroBanner, CategoryGrid, FlashSale, FeaturedTabs...
│   │   ├── product/               # ProductCard, ProductFilters
│   │   ├── cart/                  # CartDrawer, QuickViewModal
│   │   └── common/                # Toast, Breadcrumbs
│   ├── context/
│   │   └── CartContext.tsx        # Persistent cart, wishlist & notification state
│   ├── data/
│   │   ├── categories.ts          # Category definitions & metadata
│   │   └── products.ts            # Verified & curated 16+ pet products
│   ├── lib/
│   │   └── utils.ts               # PKR currency formatter, WhatsApp order builder
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🌐 Deploying to Vercel

### Option 1: Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts to link and deploy the repository.

### Option 2: Vercel Dashboard (Git Integration)
1. Push this repository to GitHub or GitLab.
2. Visit [Vercel Dashboard](https://vercel.com/new).
3. Import the repository and select **Next.js** framework preset.
4. Click **Deploy**.

---

## 🐾 Verified References
- Official Pakistan Store Reference: [cocopetshop.pk](https://cocopetshop.pk)
- Facebook Brand Page: [facebook.com/cocopets](https://web.facebook.com/cocopets)