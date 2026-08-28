import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";

describe("Database Service Layer", () => {
  beforeEach(() => {
    // Reset or reinitialize database state if supported, or ensure clean state
    if (typeof db.reset === "function") {
      db.reset();
    }
  });

  it("retrieves products list with stock information", () => {
    const products = db.getProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("stockQuantity");
    expect(typeof products[0].stockQuantity).toBe("number");
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
    expect(newReview.createdAt).toBeDefined();
    expect(newReview.authorName).toBe("Ali Khan");
    expect(newReview.productId).toBe(targetProduct.id);

    const reviews = db.getReviews(targetProduct.id);
    expect(reviews.length).toBeGreaterThan(0);
    const added = reviews.find((r) => r.id === newReview.id);
    expect(added).toBeDefined();

    const updatedProduct = db.getProductById(targetProduct.id);
    expect(updatedProduct?.reviewsCount).toBe(initialReviewsCount + 1);
    expect(updatedProduct?.rating).toBeDefined();
    expect(updatedProduct!.rating).toBeGreaterThanOrEqual(1);
    expect(updatedProduct!.rating).toBeLessThanOrEqual(5);
  });

  it("creates order and decrements product inventory", () => {
    const products = db.getProducts();
    const product = products[0];
    const initialStock = product.stockQuantity ?? 20;

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
    expect(order.id).toBeDefined();

    const updatedProduct = db.getProductById(product.id);
    expect(updatedProduct?.stockQuantity).toBe(initialStock - 2);
    expect(updatedProduct?.inStock).toBe(true);
  });

  it("marks inStock as false when stock reaches 0 upon order creation", () => {
    // Add a temporary product with stock = 1
    const testProduct = db.addProduct({
      name: "Limited Edition Collar",
      slug: "limited-edition-collar",
      category: "Accessories",
      categorySlug: "accessories",
      price: 1500,
      rating: 5,
      reviewsCount: 0,
      inStock: true,
      stockQuantity: 1,
      petType: "dog",
      images: ["https://example.com/collar.jpg"],
      description: "Rare collar",
      features: ["Premium leather"],
      sku: "COL-TEST-001",
    });

    expect(testProduct.stockQuantity).toBe(1);
    expect(testProduct.inStock).toBe(true);

    db.createOrder({
      customerName: "Zahid Qureshi",
      customerPhone: "03211122334",
      customerAddress: "DHA Phase 6",
      customerCity: "Karachi",
      paymentMethod: "cod",
      status: "pending",
      items: [
        {
          productId: testProduct.id,
          productName: testProduct.name,
          image: testProduct.images[0],
          quantity: 1,
          price: testProduct.price,
        },
      ],
      subtotal: 1500,
      discount: 0,
      shipping: 0,
      total: 1500,
    });

    const updated = db.getProductById(testProduct.id);
    expect(updated?.stockQuantity).toBe(0);
    expect(updated?.inStock).toBe(false);
  });

  it("validates coupons accurately and increments usage count on order creation", () => {
    // Valid coupon with sufficient spend
    const validResult = db.validateCoupon("COCOFIRST", 3000);
    expect(validResult.isValid).toBe(true);
    expect(validResult.coupon?.code).toBe("COCOFIRST");
    expect(validResult.discountAmount).toBe(450); // 15% of 3000

    // Coupon with insufficient spend (minSpend = 2000)
    const minSpendResult = db.validateCoupon("COCOFIRST", 1000);
    expect(minSpendResult.isValid).toBe(false);
    expect(minSpendResult.message).toContain("Minimum spend");

    // Invalid coupon
    const invalidResult = db.validateCoupon("FAKECODE123", 5000);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.message).toContain("Invalid or expired");

    // Check usageCount increments on order creation
    const couponBefore = db.getCoupons().find((c) => c.code === "COCOFIRST");
    const initialUsage = couponBefore?.usageCount || 0;

    const product = db.getProducts()[0];
    db.createOrder({
      customerName: "Usman Tariq",
      customerPhone: "03451234567",
      customerAddress: "F-8/3",
      customerCity: "Islamabad",
      paymentMethod: "cod",
      status: "pending",
      items: [
        {
          productId: product.id,
          productName: product.name,
          image: product.images[0],
          quantity: 1,
          price: product.price,
        },
      ],
      subtotal: product.price,
      discount: Math.round(product.price * 0.15),
      shipping: 0,
      total: product.price - Math.round(product.price * 0.15),
      couponCode: "COCOFIRST",
    });

    const couponAfter = db.getCoupons().find((c) => c.code === "COCOFIRST");
    expect(couponAfter?.usageCount).toBe(initialUsage + 1);
  });

  it("handles order status transitions and analytics", () => {
    const orders = db.getOrders();
    const targetOrder = orders[0];

    const updated = db.updateOrderStatus(targetOrder.id, "delivered");
    expect(updated?.status).toBe("delivered");

    const reFetched = db.getOrderByIdOrNumber(targetOrder.id);
    expect(reFetched?.status).toBe("delivered");

    const analytics = db.getAnalytics();
    expect(analytics).toHaveProperty("totalRevenue");
    expect(analytics).toHaveProperty("totalOrders");
    expect(analytics).toHaveProperty("pendingOrders");
    expect(analytics).toHaveProperty("activeProducts");
    expect(analytics).toHaveProperty("outOfStockProducts");
    expect(analytics.totalOrders).toBeGreaterThanOrEqual(orders.length);
  });
});
