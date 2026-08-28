# CoCo & Candy Pet Shop: Production-Grade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the CoCo & Candy Pet Shop into a production-grade e-commerce application with dual-mode Supabase/PostgreSQL database persistence, Zod validation, Vitest test suite, customer reviews, persistent wishlist, A4 tax invoice generation, real-time inventory management, error boundaries, and GitHub Actions CI.

**Architecture:** A modular service layer with repository pattern (`src/lib/db.ts`) supporting live PostgreSQL/Supabase and zero-config thread-safe in-memory fallback. Strict Zod schema validation across all API endpoints with RBAC role authorization. Reactive context providers for Cart, Wishlist, and RBAC Auth.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase / PostgreSQL, Vitest, React Testing Library, Zod, Lucide React, Canvas-Confetti.

**Spec:** `docs/superpowers/specs/2026-08-29-production-grade-petshop-design.md`

## Global Constraints
- Framework: Next.js 14 App Router, React 18, TypeScript 5.
- Currency: Pakistani Rupee (`PKR` / `Rs.`).
- Dual-Mode: Must run flawlessly both with and without Supabase credentials.
- Zero Warnings: TypeScript (`tsc --noEmit`), ESLint, and Vitest test suite must pass cleanly.

---

### Task 1: Testing & Tooling Setup (Vitest, React Testing Library, Zod)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/setupTests.ts`
- Test: `src/__tests__/sanity.test.ts`

**Interfaces:**
- Produces: Test runner commands (`npm run test`, `npm run test:run`, `npm run type-check`), `zod` dependency.

- [ ] **Step 1: Install Zod and Vitest dependencies**
Run: `npm install zod; npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`

- [ ] **Step 2: Create Vitest Configuration**
Write `vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Create Test Setup file**
Write `src/setupTests.ts`:
```typescript
import "@testing-library/jest-dom";
```

- [ ] **Step 4: Update scripts in package.json**
Add `"test": "vitest"`, `"test:run": "vitest run"`, `"type-check": "tsc --noEmit"` to `package.json` scripts.

- [ ] **Step 5: Write Sanity Test**
Write `src/__tests__/sanity.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

describe("Vitest Sanity Check", () => {
  it("executes basic assertions", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run test runner to verify setup**
Run: `npm run test:run`
Expected: PASS 1 test

- [ ] **Step 7: Commit**
```bash
git add package.json package-lock.json vitest.config.ts src/setupTests.ts src/__tests__/sanity.test.ts
git commit -m "chore: setup vitest testing framework and zod validation"
```

---

### Task 2: Supabase Schema & Dual-Mode DB Adapter with Inventory & Reviews

**Files:**
- Create: `supabase/schema.sql`
- Modify: `src/types/index.ts`
- Modify: `src/lib/db.ts`
- Test: `src/__tests__/db.test.ts`

**Interfaces:**
- Produces: `Review` interface, `db.getReviews(productId)`, `db.addReview(data)`, `db.createOrder(...)` with stock deduction, `db.getAnalytics()`.

- [ ] **Step 1: Write the failing unit tests for DB layer**
Write `src/__tests__/db.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";

describe("Database Service Layer", () => {
  it("retrieves products list with stock information", () => {
    const products = db.getProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("stockQuantity");
  });

  it("adds and calculates product reviews correctly", () => {
    const products = db.getProducts();
    const targetProduct = products[0];
    const initialReviewsCount = targetProduct.reviewsCount || 0;

    const newReview = db.addReview({
      productId: targetProduct.id,
      authorName: "Ali Khan",
      rating: 5,
      title: "Excellent dog food",
      comment: "My puppy loves this food so much!",
      isVerifiedPurchase: true,
    });

    expect(newReview.id).toBeDefined();
    const reviews = db.getReviews(targetProduct.id);
    expect(reviews.length).toBeGreaterThan(0);
    
    const updatedProduct = db.getProductById(targetProduct.id);
    expect(updatedProduct?.reviewsCount).toBe(initialReviewsCount + 1);
  });

  it("creates order and decrements product inventory", () => {
    const product = db.getProducts()[0];
    const initialStock = product.stockQuantity || 10;

    const order = db.createOrder({
      customerName: "Sara Ahmed",
      customerPhone: "03009988776",
      customerAddress: "Street 4, Gulberg III",
      customerCity: "Lahore",
      paymentMethod: "cod",
      status: "pending",
      items: [
        {
          productId: product.id,
          productName: product.name,
          image: product.images[0],
          quantity: 2,
          price: product.price,
        },
      ],
      subtotal: product.price * 2,
      discount: 0,
      shipping: 0,
      total: product.price * 2,
    });

    expect(order.orderNumber).toMatch(/^COCO-PK-/);
    const updatedProduct = db.getProductById(product.id);
    expect(updatedProduct?.stockQuantity).toBe(initialStock - 2);
  });
});
```

- [ ] **Step 2: Run DB unit tests to verify failure**
Run: `npm run test:run`
Expected: FAIL (missing fields/methods)

- [ ] **Step 3: Create SQL Migration Schema**
Write `supabase/schema.sql`:
```sql
-- CoCo & Candy Pet Shop PostgreSQL Database Schema
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  image TEXT,
  count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  animal_type TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  original_price NUMERIC,
  rating NUMERIC DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
  reviews_count INT DEFAULT 0 CHECK (reviews_count >= 0),
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INT DEFAULT 20 CHECK (stock_quantity >= 0),
  is_featured BOOLEAN DEFAULT FALSE,
  is_flash_sale BOOLEAN DEFAULT FALSE,
  badge TEXT,
  images TEXT[] NOT NULL,
  description TEXT NOT NULL,
  specifications JSONB,
  variants JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  discount_percent INT NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  min_spend NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  usage_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_whatsapp TEXT,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_notes TEXT,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  shipping NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  coupon_code TEXT REFERENCES coupons(code) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  image TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price NUMERIC NOT NULL,
  variant_label TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
```

- [ ] **Step 4: Update Types in `src/types/index.ts`**
Add `Review` type and update `Product` with `stockQuantity`.

- [ ] **Step 5: Refactor `src/lib/db.ts` to implement stock deduction, review methods, and dual-mode store**
Implement `getReviews`, `addReview`, stock decrements on `createOrder`, and `getAnalytics` improvements.

- [ ] **Step 6: Run tests to verify they pass**
Run: `npm run test:run`
Expected: PASS

- [ ] **Step 7: Commit**
```bash
git add supabase/schema.sql src/types/index.ts src/lib/db.ts src/__tests__/db.test.ts
git commit -m "feat: add supabase schema and dual-mode database with stock management & reviews"
```

---

### Task 3: Zod API Validation Layer, Security & Health Diagnostics

**Files:**
- Create: `src/lib/validations/index.ts`
- Create: `src/lib/logger.ts`
- Create: `src/app/api/health/route.ts`
- Modify: `src/app/api/orders/route.ts`
- Modify: `src/app/api/products/route.ts`
- Modify: `src/app/api/coupons/route.ts`
- Test: `src/__tests__/validations.test.ts`
- Test: `src/__tests__/rbac.test.ts`

**Interfaces:**
- Produces: `orderSchema`, `productSchema`, `couponSchema`, `reviewSchema`, `logger`, `/api/health` route.

- [ ] **Step 1: Write failing validation and RBAC tests**
Write `src/__tests__/validations.test.ts` and `src/__tests__/rbac.test.ts`.

- [ ] **Step 2: Run tests to verify failure**
Run: `npm run test:run`
Expected: FAIL

- [ ] **Step 3: Implement Zod validation schemas in `src/lib/validations/index.ts`**
Create strict schemas for Pakistani phone format (`^((\+92)|(0092)|(0))?3[0-9]{9}$`), addresses, positive numbers, and order items.

- [ ] **Step 4: Implement Logger in `src/lib/logger.ts`**
Create structured JSON logger with `info`, `warn`, and `error` formats.

- [ ] **Step 5: Implement `/api/health` route**
Write `src/app/api/health/route.ts` returning system status, DB mode, uptime, timestamp, and version.

- [ ] **Step 6: Integrate Zod schemas into API routes**
Update `src/app/api/orders/route.ts`, `src/app/api/products/route.ts`, `src/app/api/coupons/route.ts` to parse request body with `.safeParse()` and return 400 with details on invalid payloads.

- [ ] **Step 7: Run tests to verify pass**
Run: `npm run test:run`
Expected: PASS

- [ ] **Step 8: Commit**
```bash
git add src/lib/validations/index.ts src/lib/logger.ts src/app/api/health/route.ts src/app/api/orders/route.ts src/app/api/products/route.ts src/app/api/coupons/route.ts src/__tests__/validations.test.ts src/__tests__/rbac.test.ts
git commit -m "feat: add zod validation schemas, structured logger, and health endpoint"
```

---

### Task 4: Customer Reviews & Ratings System

**Files:**
- Create: `src/app/api/reviews/route.ts`
- Create: `src/components/product/ProductReviews.tsx`
- Modify: `src/app/shop/[slug]/page.tsx`
- Test: `src/__tests__/ProductReviews.test.tsx`

**Interfaces:**
- Produces: GET/POST `/api/reviews`, `<ProductReviews productId={...} productName={...} />` component.

- [ ] **Step 1: Write component and API tests for reviews**
Write `src/__tests__/ProductReviews.test.tsx`.

- [ ] **Step 2: Run tests to verify failure**
Run: `npm run test:run`
Expected: FAIL

- [ ] **Step 3: Implement `src/app/api/reviews/route.ts`**
Handle `GET ?productId=...` and `POST` with Zod validation.

- [ ] **Step 4: Implement `src/components/product/ProductReviews.tsx`**
Create interactive star selector, rating breakdown bars (5★ to 1★), verified customer badges, review listing, and submission modal with instant UI update.

- [ ] **Step 5: Embed `ProductReviews` in `src/app/shop/[slug]/page.tsx`**
Add reviews section to Product detail page.

- [ ] **Step 6: Run tests to verify pass**
Run: `npm run test:run`
Expected: PASS

- [ ] **Step 7: Commit**
```bash
git add src/app/api/reviews/route.ts src/components/product/ProductReviews.tsx src/app/shop/[slug]/page.tsx src/__tests__/ProductReviews.test.tsx
git commit -m "feat: add customer product reviews and star rating system"
```

---

### Task 5: Persistent Wishlist Context & Storefront Experience

**Files:**
- Create: `src/context/WishlistContext.tsx`
- Create: `src/app/wishlist/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/product/ProductCard.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/MobileNav.tsx`
- Test: `src/__tests__/Wishlist.test.tsx`

**Interfaces:**
- Produces: `useWishlist()` hook, `/wishlist` route, Heart toggle button on `ProductCard`, Header wishlist badge.

- [ ] **Step 1: Write Wishlist unit and component tests**
Write `src/__tests__/Wishlist.test.tsx`.

- [ ] **Step 2: Run tests to verify failure**
Run: `npm run test:run`
Expected: FAIL

- [ ] **Step 3: Implement `src/context/WishlistContext.tsx`**
Provide `wishlistItems`, `addToWishlist`, `removeFromWishlist`, `isInWishlist`, `clearWishlist`, and `moveAllToCart`.

- [ ] **Step 4: Wrap layout in `WishlistProvider` in `src/app/layout.tsx`**

- [ ] **Step 5: Add Wishlist toggle button to `src/components/product/ProductCard.tsx`**
Add heart button with active state styling and toast alerts.

- [ ] **Step 6: Add live Wishlist count badge to `Header.tsx` and `MobileNav.tsx`**

- [ ] **Step 7: Create Wishlist Page `src/app/wishlist/page.tsx`**
Build responsive wishlist grid with "Move to Cart", "Move All to Cart", empty state with CTA to Shop.

- [ ] **Step 8: Run tests to verify pass**
Run: `npm run test:run`
Expected: PASS

- [ ] **Step 9: Commit**
```bash
git add src/context/WishlistContext.tsx src/app/wishlist/page.tsx src/app/layout.tsx src/components/product/ProductCard.tsx src/components/layout/Header.tsx src/components/layout/MobileNav.tsx src/__tests__/Wishlist.test.tsx
git commit -m "feat: add persistent wishlist system and dedicated wishlist page"
```

---

### Task 6: Formal A4 Printable Tax Invoice & Admin Inventory Management

**Files:**
- Create: `src/app/orders/[id]/invoice/page.tsx`
- Modify: `src/app/checkout/page.tsx`
- Modify: `src/app/admin/orders/page.tsx`
- Modify: `src/app/admin/products/page.tsx`

**Interfaces:**
- Produces: Printable invoice view `/orders/[id]/invoice`, "Print Invoice" action buttons, Low-stock inventory dashboard indicators.

- [ ] **Step 1: Create A4 Printable Tax Invoice page `src/app/orders/[id]/invoice/page.tsx`**
Include CoCo & Candy branding, Pakistani NTN placeholder, verified phone/WhatsApp, itemized totals, discount voucher, shipping note, barcode simulation, and `window.print()` trigger.

- [ ] **Step 2: Link Invoice from Checkout confirmation & Order tracking**
Add "Download / Print Tax Invoice" button on order completion in `src/app/checkout/page.tsx` and in `/admin/orders/page.tsx`.

- [ ] **Step 3: Enhance Admin Product Catalog with Stock Management & Low-Stock Alerts**
Highlight low stock items in `src/app/admin/products/page.tsx` with quick +10 inventory replenishment buttons.

- [ ] **Step 4: Verify invoice layout and print styles**
Run type-check and ensure clean compilation.

- [ ] **Step 5: Commit**
```bash
git add src/app/orders/[id]/invoice/page.tsx src/app/checkout/page.tsx src/app/admin/orders/page.tsx src/app/admin/products/page.tsx
git commit -m "feat: add A4 printable tax invoice and admin stock management"
```

---

### Task 7: Error Boundaries, SEO/JSON-LD & GitHub Actions CI Workflow

**Files:**
- Create: `src/app/error.tsx`
- Create: `src/app/global-error.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/components/common/JsonLd.tsx`
- Create: `.github/workflows/ci.yml`
- Modify: `src/app/page.tsx`
- Modify: `src/app/shop/[slug]/page.tsx`

**Interfaces:**
- Produces: Root & child error boundaries, 404 page, Schema.org JSON-LD, GitHub Actions CI workflow.

- [ ] **Step 1: Implement `src/app/error.tsx`, `global-error.tsx`, and `not-found.tsx`**
Create friendly, brand-styled error recovery pages with "Try Again" and "Back to Home" CTAs.

- [ ] **Step 2: Implement Schema.org JSON-LD structured data in `src/components/common/JsonLd.tsx`**
Add Organization and Product JSON-LD schemas.

- [ ] **Step 3: Implement GitHub Actions CI workflow in `.github/workflows/ci.yml`**
Configure steps: Checkout, Node.js setup, `npm ci`, `npm run type-check`, `npm run lint`, `npm run test:run`, and `npm run build`.

- [ ] **Step 4: Run full verification suite**
Run: `npm run type-check`, `npm run test:run`, `npm run build`.
Expected: All pass with 0 errors.

- [ ] **Step 5: Commit**
```bash
git add src/app/error.tsx src/app/global-error.tsx src/app/not-found.tsx src/components/common/JsonLd.tsx .github/workflows/ci.yml src/app/page.tsx src/app/shop/[slug]/page.tsx
git commit -m "feat: add error boundaries, json-ld structured data, and GitHub Actions CI workflow"
```
