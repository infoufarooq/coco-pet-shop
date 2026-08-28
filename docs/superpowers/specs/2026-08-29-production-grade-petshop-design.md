# Production-Grade Architecture Design: CoCo & Candy Pet Shop

- **Date:** 2026-08-29
- **Status:** Approved
- **Target Platform:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase / PostgreSQL, Vitest

---

## 1. Executive Summary

This specification defines the production-grade transformation of the **CoCo & Candy Pet Shop** e-commerce platform. It transitions the application from an initial storefront into an enterprise-ready, fully tested, secure, and observable e-commerce system with dual-mode PostgreSQL/Supabase database persistence, Zod validation, customer reviews and wishlist, real-time inventory management, A4 printable tax invoices, structured logging, health checks, comprehensive Vitest test coverage, and automated GitHub Actions CI/CD workflows.

---

## 2. Architecture & Data Persistence Layer

### 2.1 Dual-Mode Storage Architecture
To support both zero-configuration local development/testing/CI and live production environments, the system abstracts data persistence through `src/lib/db.ts`:

- **Production Mode (Supabase / PostgreSQL):**
  Activated automatically when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured. Communicates directly with PostgreSQL.
- **Graceful Fallback Mode (In-Memory Thread-Safe Store):**
  Activated when database credentials are not present or in CI test environments. Seeded with authentic CoCo & Candy Pakistani pet catalog data, orders, and coupons.

### 2.2 Relational Schema (`supabase/schema.sql`)
1. **`products`**: `id` (UUID/PK), `name` (TEXT), `slug` (TEXT UNIQUE), `category_id` (TEXT), `animal_type` (TEXT), `price` (NUMERIC), `original_price` (NUMERIC), `rating` (NUMERIC DEFAULT 5.0), `reviews_count` (INT DEFAULT 0), `in_stock` (BOOLEAN DEFAULT TRUE), `stock_quantity` (INT DEFAULT 10), `is_featured` (BOOLEAN), `is_flash_sale` (BOOLEAN), `badge` (TEXT), `images` (TEXT[]), `description` (TEXT), `specifications` (JSONB), `variants` (JSONB), `created_at` (TIMESTAMPTZ).
2. **`categories`**: `id` (TEXT PK), `name` (TEXT), `slug` (TEXT UNIQUE), `icon` (TEXT), `image` (TEXT), `count` (INT).
3. **`orders`**: `id` (UUID PK), `order_number` (TEXT UNIQUE), `created_at` (TIMESTAMPTZ), `customer_name` (TEXT), `customer_phone` (TEXT), `customer_whatsapp` (TEXT), `customer_email` (TEXT), `customer_address` (TEXT), `customer_city` (TEXT), `customer_notes` (TEXT), `payment_method` (TEXT), `status` (TEXT: pending, confirmed, dispatched, delivered, cancelled), `subtotal` (NUMERIC), `discount` (NUMERIC), `shipping` (NUMERIC), `total` (NUMERIC), `coupon_code` (TEXT).
4. **`order_items`**: `id` (UUID PK), `order_id` (UUID REFERENCES orders), `product_id` (UUID/TEXT), `product_name` (TEXT), `image` (TEXT), `quantity` (INT), `price` (NUMERIC), `variant_label` (TEXT).
5. **`coupons`**: `code` (TEXT PK), `discount_percent` (INT), `min_spend` (NUMERIC), `is_active` (BOOLEAN), `expires_at` (TIMESTAMPTZ), `usage_count` (INT DEFAULT 0).
6. **`reviews`**: `id` (UUID PK), `product_id` (TEXT), `author_name` (TEXT), `rating` (INT CHECK between 1 and 5), `title` (TEXT), `comment` (TEXT), `is_verified_purchase` (BOOLEAN), `created_at` (TIMESTAMPTZ).

---

## 3. Validation, Security & API Hardening

### 3.1 Zod Request Validation (`src/lib/validations/`)
All incoming API payloads are strictly validated before hitting business logic:
- `orderSchema`: Validates Pakistani phone numbers (`03xx-xxxxxxx` or `+923xxxxxxxxx`), address (min 10 chars), non-empty items array with positive integers, supported payment methods (`cod`, `bank_transfer`, `whatsapp`).
- `productSchema`: Validates price (> 0), stock quantity (>= 0), required name, category, and valid image URLs.
- `couponSchema`: Validates discount percentage (1–100), minimum spend (>= 0), unique alphanumeric code.
- `reviewSchema`: Validates rating (1–5), author name (min 2 chars), comment (min 5 chars, max 1000 chars), sanitizing text against XSS.

### 3.2 Security & Headers
- Standardized API response format: `{ success: boolean, data?: any, error?: string, details?: any }`.
- Role-Based Access Control (RBAC): Admin endpoints (`/api/admin/*`, product mutations, coupon modifications) enforce authorization token header checks for `admin`, `order_taker`, or `packer` roles.
- Next.js security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 4. E-Commerce & Customer Features

### 4.1 Product Reviews & Star Ratings
- Product Detail Page contains a dedicated Reviews section displaying rating distribution (5★ to 1★) and customer testimonials.
- Review submission modal with real-time star rating selector, name, title, comment, and verified customer badge.
- Automatic recalculated average rating and review count per product stored in the database.

### 4.2 Persistent Customer Wishlist
- `WishlistContext.tsx` providing reactive state with localStorage persistence.
- Heart icon toggle on `ProductCard`, Shop catalog grid, and Product detail page.
- Dedicated `/wishlist` route displaying saved items with "Move to Cart", "Move All to Cart", and quick removal.
- Header badge indicator displaying live wishlist count.

### 4.3 Live Stock & Inventory Deduction
- Placing an order automatically deducts `stock_quantity` from each ordered product.
- If `stock_quantity` reaches 0, `in_stock` automatically flips to `false` and "Add to Cart" is disabled with an "Out of Stock" pill.
- Admin dashboard features low-stock indicators (< 5 items) and quick stock increment controls.

### 4.4 Formal Printable / PDF Tax Invoice
- Dedicated route `/orders/[id]/invoice` optimized for standard A4 printing and PDF export via `window.print()`.
- Branded header (CoCo & Candy Pet Accessories Shop, Lahore, Pakistan, NTN / Contact details).
- Itemized breakdown of products, quantity, unit price, applied coupon discount, shipping fee, total PKR, and order barcode representation.

---

## 5. Testing, Observability & CI/CD

### 5.1 Automated Vitest Test Suite
Configured with Vitest and `@testing-library/react`:
1. **Unit Tests**:
   - `src/__tests__/db.test.ts`: Product CRUD, order creation, stock decrement, review rating aggregation, coupon validation.
   - `src/__tests__/validations.test.ts`: Zod schema enforcement for orders, products, reviews, and coupons.
   - `src/__tests__/cart.test.ts`: Cart calculations, discount application, shipping threshold checks.
   - `src/__tests__/rbac.test.ts`: Role permission matrix enforcement.
2. **Component Tests**:
   - `src/__tests__/ProductCard.test.tsx`: Card rendering, pricing, wishlist toggle, and add-to-cart.
   - `src/__tests__/Wishlist.test.tsx`: Wishlist state, addition, removal, and bulk move to cart.

### 5.2 Observability & Error Recovery
- Custom `error.tsx` for client-side boundary recovery.
- Custom `global-error.tsx` for root layout crashes.
- Custom `not-found.tsx` for missing pages and products.
- Structured logger (`src/lib/logger.ts`) with levels `info`, `warn`, and `error`.
- Health check route `/api/health` providing uptime, memory usage, and DB connection diagnostics.

### 5.3 CI/CD Automation
- `.github/workflows/ci.yml` running on push and PR:
  1. `npm run type-check` (TypeScript validation)
  2. `npm run lint` (ESLint verification)
  3. `npm run test:run` (Vitest test suite)
  4. `npm run build` (Next.js production build)
