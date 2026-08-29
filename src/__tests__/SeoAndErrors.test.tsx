import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RootError from "@/app/error";
import GlobalError from "@/app/global-error";
import NotFoundPage from "@/app/not-found";
import {
  OrganizationJsonLd,
  ProductJsonLd,
  BreadcrumbJsonLd,
} from "@/components/common/JsonLd";
import { PRODUCTS } from "@/data/products";

describe("Error Boundaries, SEO/JSON-LD & Production Resilience", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Schema.org JSON-LD Structured Data", () => {
    it("renders valid Organization & Store Schema.org JSON-LD script", () => {
      const { container } = render(<OrganizationJsonLd />);
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();

      const json = JSON.parse(script?.textContent || "{}");
      expect(json["@context"]).toBe("https://schema.org");
      expect(json["@type"]).toContain("PetStore");
      expect(json.name).toContain("CoCo & Candy");
      expect(json.address.addressCountry).toBe("PK");
      expect(json.address.addressLocality).toBe("Lahore");
      expect(json.currenciesAccepted).toBe("PKR");
    });

    it("renders valid Product Schema.org JSON-LD with PKR offers and rating", () => {
      const sampleProduct = PRODUCTS[0];
      const { container } = render(<ProductJsonLd product={sampleProduct} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();

      const json = JSON.parse(script?.textContent || "{}");
      expect(json["@context"]).toBe("https://schema.org");
      expect(json["@type"]).toBe("Product");
      expect(json.name).toBe(sampleProduct.name);
      expect(json.offers.priceCurrency).toBe("PKR");
      expect(json.offers.price).toBe(sampleProduct.price);
      expect(json.offers.availability).toBe("https://schema.org/InStock");
      expect(json.brand.name).toBe("CoCo & Candy");
    });

    it("renders valid BreadcrumbList Schema.org JSON-LD", () => {
      const items = [
        { label: "Dog Accessories", href: "/shop?petType=dog" },
        { label: "Orthopedic Bed" },
      ];
      const { container } = render(<BreadcrumbJsonLd items={items} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();

      const json = JSON.parse(script?.textContent || "{}");
      expect(json["@context"]).toBe("https://schema.org");
      expect(json["@type"]).toBe("BreadcrumbList");
      expect(json.itemListElement.length).toBe(3); // Home + 2 items
      expect(json.itemListElement[0].name).toBe("Home");
      expect(json.itemListElement[1].name).toBe("Dog Accessories");
    });
  });

  describe("Root & Global Error Boundaries", () => {
    it("renders RootError with message and invokes reset() on Try Again click", () => {
      const resetMock = vi.fn();
      const mockError = new Error("Database network timeout") as Error & {
        digest?: string;
      };
      mockError.digest = "ERR_DB_TIMEOUT_408";

      render(<RootError error={mockError} reset={resetMock} />);

      expect(screen.getByText("Oops! An Unexpected Hiccup Occurred")).toBeInTheDocument();
      expect(screen.getByText(/Database network timeout/)).toBeInTheDocument();
      expect(screen.getByText(/ERR_DB_TIMEOUT_408/)).toBeInTheDocument();

      const tryAgainBtn = screen.getByTestId("try-again-btn");
      fireEvent.click(tryAgainBtn);
      expect(resetMock).toHaveBeenCalledTimes(1);
    });

    it("renders GlobalError fallback and triggers reset() callback", () => {
      const resetMock = vi.fn();
      const mockError = new Error("Root layout crash");

      render(<GlobalError error={mockError} reset={resetMock} />);

      expect(screen.getByText("Application Critical Recovery")).toBeInTheDocument();
      expect(screen.getByText(/Root layout crash/)).toBeInTheDocument();

      const resetBtn = screen.getByTestId("global-try-again-btn");
      fireEvent.click(resetBtn);
      expect(resetMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Not Found 404 Experience", () => {
    it("renders 404 page with navigation links and search suggestion", () => {
      render(<NotFoundPage />);

      expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
      expect(screen.getByText("This Treat Went Missing!")).toBeInTheDocument();
      expect(screen.getByText("Dog Supplies")).toBeInTheDocument();
      expect(screen.getByText("Cat Essentials")).toBeInTheDocument();
      expect(screen.getByText("Browse All Pet Products")).toBeInTheDocument();
      expect(screen.getByText("Return to Home")).toBeInTheDocument();
    });
  });
});
