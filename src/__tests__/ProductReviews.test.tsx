import React from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductReviews } from "@/components/product/ProductReviews";
import { GET, POST } from "@/app/api/reviews/route";
import { db } from "@/lib/db";
import { Review } from "@/types";

describe("Customer Reviews API & Interactive Component", () => {
  beforeEach(() => {
    if (typeof db.reset === "function") {
      db.reset();
    }
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("API Route: /api/reviews", () => {
    it("GET: retrieves reviews filtered by productId", async () => {
      const request = new Request("http://localhost:3000/api/reviews?productId=prod-4");
      const response = await GET(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.count).toBe(json.data.length);
      expect(json.data.every((r: Review) => r.productId.toLowerCase() === "prod-4")).toBe(true);
    });

    it("GET: retrieves all reviews when no productId is specified", async () => {
      const request = new Request("http://localhost:3000/api/reviews");
      const response = await GET(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.count).toBeGreaterThanOrEqual(1);
    });

    it("POST: rejects invalid review payload with 400 status and error details", async () => {
      const invalidPayload = {
        productId: "",
        authorName: "",
        rating: 6, // invalid
        title: "",
        comment: "Bad", // too short (< 5 chars)
      };

      const request = new Request("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidPayload),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("Invalid review data.");
      expect(json.details).toBeDefined();
    });

    it("POST: successfully creates a review with 201 status and updates product rating", async () => {
      const product = db.getProducts()[0];
      const initialReviewsCount = product.reviewsCount || 0;

      const validPayload = {
        productId: product.id,
        authorName: "Sarah Mansoor",
        rating: 5,
        title: "Incredible Quality and Fast Shipping",
        comment: "Our cat loves this so much! Delivered within 24 hours in Lahore.",
        city: "Lahore",
        petName: "Oliver (Persian)",
        isVerifiedPurchase: true,
      };

      const request = new Request("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toMatch(/^rev-/);
      expect(json.data.authorName).toBe("Sarah Mansoor");
      expect(json.data.rating).toBe(5);
      expect(json.data.city).toBe("Lahore");
      expect(json.data.petName).toBe("Oliver (Persian)");

      const updatedProduct = db.getProductById(product.id);
      expect(updatedProduct?.reviewsCount).toBe(initialReviewsCount + 1);
    });
  });

  describe("ProductReviews Component", () => {
    const mockReviews: Review[] = [
      {
        id: "rev-1",
        productId: "prod-test-1",
        authorName: "Zainab Malik",
        rating: 5,
        title: "Outstanding Orthopedic Bed!",
        comment: "The memory foam bed is pure luxury! Milo sleeps peacefully.",
        isVerifiedPurchase: true,
        createdAt: "2026-08-14T10:00:00.000Z",
        city: "Lahore",
        petName: "Milo (Golden Retriever)",
      },
      {
        id: "rev-2",
        productId: "prod-test-1",
        authorName: "Bilal Farooq",
        rating: 4,
        title: "Great product, fast delivery",
        comment: "Extremely pleased with the overall experience and quality.",
        isVerifiedPurchase: true,
        createdAt: "2026-08-18T10:00:00.000Z",
        city: "Islamabad",
        petName: "Luna",
      },
      {
        id: "rev-3",
        productId: "prod-test-1",
        authorName: "Ahmed Raza",
        rating: 5,
        title: "Superb durability",
        comment: "Held up nicely after weeks of heavy use by my two dogs.",
        isVerifiedPurchase: true,
        createdAt: "2026-08-20T10:00:00.000Z",
        city: "Karachi",
      },
    ];

    it("renders reviews and calculates star distribution accurately", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          count: mockReviews.length,
          data: mockReviews,
        }),
      });

      render(
        <ProductReviews
          productId="prod-test-1"
          productName="Orthopedic Pet Bed"
          initialRating={4.8}
          initialReviewsCount={3}
        />
      );

      // Verify loading disappears and reviews load
      await waitFor(() => {
        expect(screen.getByTestId("average-rating")).toHaveTextContent("4.7");
      });

      // Verify distribution breakdown
      // Total 3 reviews: 2 five-star (67%), 1 four-star (33%), 0 three-star (0%), 0 two-star (0%), 0 one-star (0%)
      const bar5 = screen.getByTestId("breakdown-bar-5");
      expect(bar5).toHaveStyle({ width: "67%" });

      const bar4 = screen.getByTestId("breakdown-bar-4");
      expect(bar4).toHaveStyle({ width: "33%" });

      const bar3 = screen.getByTestId("breakdown-bar-3");
      expect(bar3).toHaveStyle({ width: "0%" });

      // Check review items
      expect(screen.getByText("Zainab Malik")).toBeInTheDocument();
      expect(screen.getByText("Outstanding Orthopedic Bed!")).toBeInTheDocument();
      expect(screen.getByText(/Milo \(Golden Retriever\)/)).toBeInTheDocument();
      expect(screen.getByText("Lahore, PK")).toBeInTheDocument();

      expect(screen.getByText("Bilal Farooq")).toBeInTheDocument();
      expect(screen.getByText("Great product, fast delivery")).toBeInTheDocument();
    });

    it("renders friendly empty state when no reviews exist", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          count: 0,
          data: [],
        }),
      });

      render(
        <ProductReviews
          productId="prod-empty"
          productName="Brand New Collar"
          initialRating={5}
          initialReviewsCount={0}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("No customer reviews yet")).toBeInTheDocument();
      });

      expect(screen.getByText("Write the First Review")).toBeInTheDocument();
    });

    it("toggles the review form on 'Write a Review' button click", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          count: 0,
          data: [],
        }),
      });

      render(
        <ProductReviews
          productId="prod-test-1"
          productName="Orthopedic Pet Bed"
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("write-review-btn")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("review-form")).not.toBeInTheDocument();

      // Open form
      fireEvent.click(screen.getByTestId("write-review-btn"));
      expect(screen.getByTestId("review-form")).toBeInTheDocument();

      // Close form
      fireEvent.click(screen.getByTestId("write-review-btn"));
      expect(screen.queryByTestId("review-form")).not.toBeInTheDocument();
    });

    it("validates form fields and displays error messages for empty required fields", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          count: 0,
          data: [],
        }),
      });

      render(
        <ProductReviews
          productId="prod-test-1"
          productName="Orthopedic Pet Bed"
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("write-review-btn")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("write-review-btn"));

      const submitBtn = screen.getByTestId("submit-review-btn");
      const user = userEvent.setup();

      // Submit without name
      fireEvent.click(submitBtn);
      expect(screen.getByTestId("form-error")).toHaveTextContent("Please enter your name.");

      // Fill name but not title
      const authorInput = screen.getByLabelText(/Your Name \*/i);
      await user.type(authorInput, "Hassan Khan");
      fireEvent.click(submitBtn);
      expect(screen.getByTestId("form-error")).toHaveTextContent("Please provide a review title.");

      // Fill title but not comment
      const titleInput = screen.getByLabelText(/Review Headline \/ Title \*/i);
      await user.type(titleInput, "Great product");
      fireEvent.click(submitBtn);
      expect(screen.getByTestId("form-error")).toHaveTextContent("Please write a comment with at least 5 characters.");

      // Fill short comment
      const commentInput = screen.getByLabelText(/Detailed Feedback \*/i);
      await user.type(commentInput, "Yay");
      fireEvent.click(submitBtn);
      expect(screen.getByTestId("form-error")).toHaveTextContent("Please write a comment with at least 5 characters.");
    });

    it("submits review successfully and updates review list optimistically", async () => {
      const initialData: Review[] = [];
      const newReviewData: Review = {
        id: "rev-new-123",
        productId: "prod-test-1",
        authorName: "Maham Tariq",
        rating: 5,
        title: "Best purchase for my kitten!",
        comment: "She loves to sleep on it everyday. Super soft fabric!",
        isVerifiedPurchase: true,
        createdAt: new Date().toISOString(),
        city: "Rawalpindi",
        petName: "Fluffy",
      };

      global.fetch = vi.fn().mockImplementation((url, options) => {
        if (!options || options.method !== "POST") {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              success: true,
              count: initialData.length,
              data: initialData,
            }),
          });
        }

        // POST request
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: newReviewData,
          }),
        });
      });

      render(
        <ProductReviews
          productId="prod-test-1"
          productName="Orthopedic Pet Bed"
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("write-review-btn")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("write-review-btn"));

      fireEvent.change(screen.getByLabelText(/Your Name \*/i), {
        target: { value: "Maham Tariq" },
      });
      fireEvent.change(screen.getByLabelText(/City \(Pakistan\)/i), {
        target: { value: "Rawalpindi" },
      });
      fireEvent.change(screen.getByLabelText(/Pet's Name & Breed/i), {
        target: { value: "Fluffy" },
      });
      fireEvent.change(screen.getByLabelText(/Review Headline \/ Title \*/i), {
        target: { value: "Best purchase for my kitten!" },
      });
      fireEvent.change(screen.getByLabelText(/Detailed Feedback \*/i), {
        target: { value: "She loves to sleep on it everyday. Super soft fabric!" },
      });

      // Click star 5
      const star5Btn = screen.getByRole("button", { name: /Rate 5 stars/i });
      fireEvent.click(star5Btn);

      // Submit
      fireEvent.click(screen.getByTestId("submit-review-btn"));

      // Verify optimistic update appears in list
      await waitFor(() => {
        expect(screen.getByText("Maham Tariq")).toBeInTheDocument();
      });

      expect(screen.getByText("Best purchase for my kitten!")).toBeInTheDocument();
      expect(screen.getByText(/Fluffy/)).toBeInTheDocument();
      expect(screen.getByText("Rawalpindi, PK")).toBeInTheDocument();
      expect(screen.queryByTestId("review-form")).not.toBeInTheDocument();
    });
  });
});
