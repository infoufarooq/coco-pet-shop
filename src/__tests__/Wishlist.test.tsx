import React from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WishlistProvider, useWishlist } from "@/context/WishlistContext";
import { CartProvider, useCart } from "@/context/CartContext";
import WishlistPage from "@/app/wishlist/page";
import { PRODUCTS } from "@/data/products";

// Test component to interact with Wishlist context methods
function TestWishlistConsumer() {
  const {
    wishlist,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    moveAllToCart,
  } = useWishlist();

  const { cartCount } = useCart();

  return (
    <div>
      <div data-testid="wishlist-count">{wishlistCount}</div>
      <div data-testid="cart-count">{cartCount}</div>
      <div data-testid="wishlist-items">{wishlist.join(",")}</div>
      <div data-testid="is-in-wishlist-prod-1">
        {isInWishlist("prod-1") ? "yes" : "no"}
      </div>

      <button
        data-testid="add-prod-1"
        onClick={() => addToWishlist("prod-1")}
      >
        Add Prod 1
      </button>
      <button
        data-testid="remove-prod-1"
        onClick={() => removeFromWishlist("prod-1")}
      >
        Remove Prod 1
      </button>
      <button
        data-testid="toggle-prod-1"
        onClick={() => toggleWishlist("prod-1")}
      >
        Toggle Prod 1
      </button>
      <button
        data-testid="toggle-prod-2"
        onClick={() => toggleWishlist("prod-2")}
      >
        Toggle Prod 2
      </button>
      <button data-testid="clear-all" onClick={clearWishlist}>
        Clear
      </button>
      <button data-testid="move-all" onClick={moveAllToCart}>
        Move All
      </button>
    </div>
  );
}

describe("Persistent Wishlist System & Storefront Experience", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("WishlistContext State & Methods", () => {
    it("initializes empty when localStorage is empty", () => {
      render(
        <CartProvider>
          <WishlistProvider>
            <TestWishlistConsumer />
          </WishlistProvider>
        </CartProvider>
      );

      expect(screen.getByTestId("wishlist-count")).toHaveTextContent("0");
      expect(screen.getByTestId("is-in-wishlist-prod-1")).toHaveTextContent("no");
    });

    it("adds and removes items with toggleWishlist and updates isInWishlist", () => {
      render(
        <CartProvider>
          <WishlistProvider>
            <TestWishlistConsumer />
          </WishlistProvider>
        </CartProvider>
      );

      // Toggle Add prod-1
      fireEvent.click(screen.getByTestId("toggle-prod-1"));
      expect(screen.getByTestId("wishlist-count")).toHaveTextContent("1");
      expect(screen.getByTestId("is-in-wishlist-prod-1")).toHaveTextContent("yes");
      expect(screen.getByTestId("wishlist-items")).toHaveTextContent("prod-1");

      // Toggle Remove prod-1
      fireEvent.click(screen.getByTestId("toggle-prod-1"));
      expect(screen.getByTestId("wishlist-count")).toHaveTextContent("0");
      expect(screen.getByTestId("is-in-wishlist-prod-1")).toHaveTextContent("no");
    });

    it("persists wishlist updates to localStorage", async () => {
      render(
        <CartProvider>
          <WishlistProvider>
            <TestWishlistConsumer />
          </WishlistProvider>
        </CartProvider>
      );

      fireEvent.click(screen.getByTestId("add-prod-1"));
      fireEvent.click(screen.getByTestId("toggle-prod-2"));

      await waitFor(() => {
        const stored = localStorage.getItem("coco_petshop_wishlist");
        expect(stored).toBeDefined();
        const parsed = JSON.parse(stored || "[]");
        expect(parsed).toContain("prod-1");
        expect(parsed).toContain("prod-2");
      });
    });

    it("clears wishlist with clearWishlist()", () => {
      render(
        <CartProvider>
          <WishlistProvider>
            <TestWishlistConsumer />
          </WishlistProvider>
        </CartProvider>
      );

      fireEvent.click(screen.getByTestId("add-prod-1"));
      fireEvent.click(screen.getByTestId("toggle-prod-2"));
      expect(screen.getByTestId("wishlist-count")).toHaveTextContent("2");

      fireEvent.click(screen.getByTestId("clear-all"));
      expect(screen.getByTestId("wishlist-count")).toHaveTextContent("0");
    });

    it("moves all wishlist items to Cart with moveAllToCart()", () => {
      render(
        <CartProvider>
          <WishlistProvider>
            <TestWishlistConsumer />
          </WishlistProvider>
        </CartProvider>
      );

      // Add prod-1 (Royal Canin) and prod-2 to wishlist
      fireEvent.click(screen.getByTestId("add-prod-1"));
      fireEvent.click(screen.getByTestId("toggle-prod-2"));
      expect(screen.getByTestId("wishlist-count")).toHaveTextContent("2");
      expect(screen.getByTestId("cart-count")).toHaveTextContent("0");

      // Move All to Cart
      fireEvent.click(screen.getByTestId("move-all"));
      expect(Number(screen.getByTestId("cart-count").textContent)).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Dedicated Wishlist Page Rendering", () => {
    it("renders empty state when wishlist is empty", () => {
      render(
        <CartProvider>
          <WishlistProvider>
            <WishlistPage />
          </WishlistProvider>
        </CartProvider>
      );

      expect(screen.getByTestId("empty-wishlist")).toBeInTheDocument();
      expect(screen.getByText("Your Wishlist is Empty")).toBeInTheDocument();
      expect(screen.getByText("Explore Products")).toBeInTheDocument();
    });

    it("renders wishlisted product cards and bulk action controls when items exist", async () => {
      localStorage.setItem(
        "coco_petshop_wishlist",
        JSON.stringify(["prod-1", "prod-2"])
      );

      render(
        <CartProvider>
          <WishlistProvider>
            <WishlistPage />
          </WishlistProvider>
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("move-all-to-cart-btn")).toBeInTheDocument();
        expect(screen.getByTestId("clear-wishlist-btn")).toBeInTheDocument();
        expect(screen.getByTestId("wishlist-badge-count")).toHaveTextContent("2 items");
      });

      const prod1 = PRODUCTS.find((p) => p.id === "prod-1");
      const prod2 = PRODUCTS.find((p) => p.id === "prod-2");

      if (prod1) {
        expect(screen.getAllByText(prod1.name).length).toBeGreaterThan(0);
      }
      if (prod2) {
        expect(screen.getAllByText(prod2.name).length).toBeGreaterThan(0);
      }
    });
  });
});
