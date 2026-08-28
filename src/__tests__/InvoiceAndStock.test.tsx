import React from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OrderInvoicePage from "@/app/orders/[id]/invoice/page";
import AdminProductsPage from "@/app/admin/products/page";
import { db } from "@/lib/db";
import { OrderRecord, Product } from "@/types";

describe("A4 Printable Tax Invoice & Admin Inventory Stock Management", () => {
  beforeEach(() => {
    if (typeof db.reset === "function") {
      db.reset();
    }
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Tax Invoice Page (src/app/orders/[id]/invoice/page.tsx)", () => {
    const mockOrder: OrderRecord = {
      id: "ord-test-1",
      orderNumber: "COCO-PK-98214",
      createdAt: "2026-08-28T14:30:00.000Z",
      customerName: "Ayesha Malik",
      customerPhone: "03001234567",
      customerWhatsApp: "03001234567",
      customerEmail: "ayesha.m@gmail.com",
      customerAddress: "House 45, Street 12, Phase 5 DHA",
      customerCity: "Lahore",
      customerNotes: "Please ring the bell twice",
      paymentMethod: "cod",
      status: "delivered",
      items: [
        {
          productId: "prod-4",
          productName: "Orthopedic Memory Foam Pet Lounger Bed",
          image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0",
          quantity: 2,
          price: 5865,
          variantLabel: "Medium (Beige)",
        },
      ],
      subtotal: 11730,
      discount: 1173,
      shipping: 250,
      total: 10807,
      couponCode: "PETLOVE",
    };

    it("renders official company details, NTN, DHA Lahore address, and helpline", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockOrder,
        }),
      });

      render(<OrderInvoicePage params={{ id: "COCO-PK-98214" }} />);

      await waitFor(() => {
        expect(screen.getByTestId("invoice-document")).toBeInTheDocument();
      });

      // Verify Official Business Details
      expect(
        screen.getAllByText("CoCo & Candy Pet Accessories (Pvt) Ltd.").length
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/8492018-7/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/DHA Phase 6/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/0345-7913191/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Official Tax Invoice")).toBeInTheDocument();
    });

    it("renders customer invoice info, order date, order number, and payment method", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockOrder,
        }),
      });

      render(<OrderInvoicePage params={{ id: "ord-test-1" }} />);

      await waitFor(() => {
        expect(screen.getByTestId("invoice-document")).toBeInTheDocument();
      });

      expect(screen.getByText("COCO-PK-98214")).toBeInTheDocument();
      expect(screen.getByText("Ayesha Malik")).toBeInTheDocument();
      expect(screen.getByText(/House 45, Street 12, Phase 5 DHA/)).toBeInTheDocument();
      expect(screen.getByText(/Lahore, Pakistan/)).toBeInTheDocument();
      expect(screen.getAllByText("03001234567").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/ayesha\.m@gmail\.com/)).toBeInTheDocument();
      expect(screen.getByText(/Please ring the bell twice/)).toBeInTheDocument();
      expect(screen.getAllByText(/Cash on Delivery \(COD\)/i).length).toBeGreaterThanOrEqual(1);
    });

    it("renders itemized table with products, quantities, prices, and line totals", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockOrder,
        }),
      });

      render(<OrderInvoicePage params={{ id: "COCO-PK-98214" }} />);

      await waitFor(() => {
        expect(screen.getByTestId("invoice-document")).toBeInTheDocument();
      });

      expect(
        screen.getByText("Orthopedic Memory Foam Pet Lounger Bed")
      ).toBeInTheDocument();
      expect(screen.getByText(/Variant: Medium \(Beige\)/)).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument(); // Qty
      expect(screen.getByText("Rs. 5,865")).toBeInTheDocument(); // Unit price
      expect(screen.getAllByText("Rs. 11,730").length).toBeGreaterThanOrEqual(1); // Line total & subtotal
    });

    it("correctly displays subtotal, discount, shipping, and grand total calculations", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockOrder,
        }),
      });

      render(<OrderInvoicePage params={{ id: "COCO-PK-98214" }} />);

      await waitFor(() => {
        expect(screen.getByTestId("invoice-document")).toBeInTheDocument();
      });

      expect(screen.getAllByText("Rs. 11,730").length).toBeGreaterThanOrEqual(1); // Subtotal
      expect(screen.getByText("-Rs. 1,173")).toBeInTheDocument(); // Discount
      expect(screen.getByText("Coupon Discount (PETLOVE):")).toBeInTheDocument();
      expect(screen.getByText("Rs. 250")).toBeInTheDocument(); // Shipping
      expect(screen.getByText("Rs. 10,807")).toBeInTheDocument(); // Grand total
    });

    it("renders tax disclaimer and computer-generated receipt signature block", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockOrder,
        }),
      });

      render(<OrderInvoicePage params={{ id: "COCO-PK-98214" }} />);

      await waitFor(() => {
        expect(screen.getByTestId("invoice-document")).toBeInTheDocument();
      });

      expect(screen.getByText(/Tax & Legal Disclaimer/i)).toBeInTheDocument();
      expect(
        screen.getByText(/This is an official computer-generated Tax Invoice issued by CoCo & Candy/i)
      ).toBeInTheDocument();
      expect(screen.getByText("Authorized Signatory")).toBeInTheDocument();
    });

    it("triggers window.print() on Print Invoice button click", async () => {
      const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockOrder,
        }),
      });

      render(<OrderInvoicePage params={{ id: "COCO-PK-98214" }} />);

      await waitFor(() => {
        expect(screen.getByTestId("print-invoice-btn")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("print-invoice-btn"));
      expect(printSpy).toHaveBeenCalledTimes(1);
    });

    it("renders not found state when order cannot be located", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          error: "Order not found",
        }),
      });

      render(<OrderInvoicePage params={{ id: "INVALID-ORDER-ID" }} />);

      await waitFor(() => {
        expect(screen.getByText("Invoice Not Found")).toBeInTheDocument();
      });

      expect(screen.getByText("Track Order")).toBeInTheDocument();
    });
  });

  describe("Admin Products Inventory Management (src/app/admin/products/page.tsx)", () => {
    const mockProducts: Product[] = [
      {
        id: "prod-high-stock",
        name: "Cat Tree Scratching Post",
        slug: "cat-tree-post",
        category: "Cat Accessories",
        categorySlug: "cat-accessories",
        price: 8500,
        inStock: true,
        stockQuantity: 25,
        stockCount: 25,
        petType: "cat",
        images: ["https://images.unsplash.com/photo-1545249390-6bdfa286032f"],
        description: "Sturdy multi-level cat tree.",
        features: ["Sisal posts", "Plush perches"],
        sku: "SKU-CAT-TREE",
      },
      {
        id: "prod-low-stock",
        name: "Winter Puffer Dog Jacket",
        slug: "winter-puffer-jacket",
        category: "Dog Accessories",
        categorySlug: "dog-accessories",
        price: 3200,
        inStock: true,
        stockQuantity: 3,
        stockCount: 3,
        petType: "dog",
        images: ["https://images.unsplash.com/photo-1548767797-d8c844163c4c"],
        description: "Warm fleece lined dog coat.",
        features: ["Waterproof", "Reflective"],
        sku: "SKU-DOG-JACKET",
      },
      {
        id: "prod-out-stock",
        name: "Orthopedic Memory Foam Bed",
        slug: "orthopedic-bed",
        category: "Dog Accessories",
        categorySlug: "dog-accessories",
        price: 5865,
        inStock: false,
        stockQuantity: 0,
        stockCount: 0,
        petType: "dog",
        images: ["https://images.unsplash.com/photo-1541599540903-216a46ca1dc0"],
        description: "Luxury orthopedic bed for joints.",
        features: ["Memory foam", "Washable cover"],
        sku: "SKU-DOG-BED",
      },
    ];

    it("displays In Stock badge with quantity for stock > 5", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockProducts,
        }),
      });

      render(<AdminProductsPage />);

      await waitFor(() => {
        expect(screen.getByTestId("stock-badge-prod-high-stock")).toBeInTheDocument();
      });

      const highStockBadge = screen.getByTestId("stock-badge-prod-high-stock");
      expect(highStockBadge).toHaveTextContent("In Stock (25 units)");
      expect(highStockBadge.className).toContain("bg-emerald-50");
    });

    it("displays Low Stock warning badge when stockQuantity <= 5", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockProducts,
        }),
      });

      render(<AdminProductsPage />);

      await waitFor(() => {
        expect(screen.getByTestId("stock-badge-prod-low-stock")).toBeInTheDocument();
      });

      const lowStockBadge = screen.getByTestId("stock-badge-prod-low-stock");
      expect(lowStockBadge).toHaveTextContent("Low Stock (3 left)");
      expect(lowStockBadge.className).toContain("bg-amber-50");
    });

    it("displays Out of Stock badge when product is out of stock or stock is 0", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockProducts,
        }),
      });

      render(<AdminProductsPage />);

      await waitFor(() => {
        expect(screen.getByTestId("stock-badge-prod-out-stock")).toBeInTheDocument();
      });

      const outStockBadge = screen.getByTestId("stock-badge-prod-out-stock");
      expect(outStockBadge).toHaveTextContent("Out of Stock (0)");
      expect(outStockBadge.className).toContain("bg-rose-50");
    });

    it("triggers quick replenishment action to increase inventory", async () => {
      const putSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { ...mockProducts[1], stockQuantity: 13, inStock: true },
        }),
      });

      global.fetch = vi.fn().mockImplementation((url, options) => {
        if (options && options.method === "PUT") {
          return putSpy(url, options);
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: mockProducts,
          }),
        });
      });

      render(<AdminProductsPage />);

      await waitFor(() => {
        expect(screen.getByTestId("replenish-btn-prod-low-stock")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("replenish-btn-prod-low-stock"));

      await waitFor(() => {
        expect(putSpy).toHaveBeenCalled();
      });

      const putBody = JSON.parse(putSpy.mock.calls[0][1].body);
      expect(putBody.stockQuantity).toBe(13); // 3 + 10 = 13
      expect(putBody.inStock).toBe(true);
    });
  });
});
