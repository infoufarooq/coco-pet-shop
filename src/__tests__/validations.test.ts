import { describe, it, expect } from "vitest";
import {
  orderSchema,
  productSchema,
  couponSchema,
  reviewSchema,
  contactSchema,
  pakistaniPhoneRegex,
} from "@/lib/validations";

describe("Pakistani Phone Number Regex", () => {
  it("matches valid Pakistani phone numbers across formats", () => {
    expect(pakistaniPhoneRegex.test("03001234567")).toBe(true);
    expect(pakistaniPhoneRegex.test("+923001234567")).toBe(true);
    expect(pakistaniPhoneRegex.test("00923001234567")).toBe(true);
    expect(pakistaniPhoneRegex.test("3001234567")).toBe(true);
    expect(pakistaniPhoneRegex.test("03457913191")).toBe(true);
    expect(pakistaniPhoneRegex.test("+923457913191")).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    expect(pakistaniPhoneRegex.test("02001234567")).toBe(false);
    expect(pakistaniPhoneRegex.test("12345")).toBe(false);
    expect(pakistaniPhoneRegex.test("+14155552671")).toBe(false);
    expect(pakistaniPhoneRegex.test("abcdefghijk")).toBe(false);
    expect(pakistaniPhoneRegex.test("0300123456")).toBe(false); // 10 digits
    expect(pakistaniPhoneRegex.test("030012345678")).toBe(false); // 12 digits
  });
});

describe("Order Schema Validation", () => {
  const validOrderPayload = {
    customerName: "Ayesha Malik",
    customerPhone: "03001234567",
    customerWhatsApp: "03001234567",
    customerEmail: "ayesha@example.com",
    customerAddress: "House 12, Street 5, DHA Phase 5",
    customerCity: "Lahore",
    customerNotes: "Please deliver after 3pm",
    paymentMethod: "cod" as const,
    items: [
      {
        productId: "prod-1",
        productName: "Premium Royal Canin Cat Food",
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c",
        quantity: 2,
        price: 4500,
        variantLabel: "2kg Pack",
      },
    ],
    subtotal: 9000,
    discount: 500,
    shipping: 200,
    total: 8700,
    couponCode: "WELCOME10",
  };

  it("validates a complete and valid order payload", () => {
    const result = orderSchema.safeParse(validOrderPayload);
    expect(result.success).toBe(true);
  });

  it("accepts valid order with minimal required fields and Pakistani phone formats", () => {
    const minimalOrder = {
      customerName: "Bilal Tariq",
      customerPhone: "+923457913191",
      customerAddress: "Gulberg III",
      customerCity: "Lahore",
      paymentMethod: "bank_transfer",
      items: [
        {
          productId: "prod-2",
          productName: "Dog Leash",
          image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c",
          quantity: 1,
          price: 1500,
        },
      ],
      subtotal: 1500,
      total: 1500,
    };
    const result = orderSchema.safeParse(minimalOrder);
    expect(result.success).toBe(true);
  });

  it("fails when customerPhone is invalid", () => {
    const invalidPhoneOrder = {
      ...validOrderPayload,
      customerPhone: "0213456789",
    };
    const result = orderSchema.safeParse(invalidPhoneOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("customerPhone"))).toBe(true);
    }
  });

  it("fails when items array is empty", () => {
    const emptyItemsOrder = {
      ...validOrderPayload,
      items: [],
    };
    const result = orderSchema.safeParse(emptyItemsOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("items"))).toBe(true);
    }
  });

  it("fails when item quantity is zero or negative", () => {
    const invalidQtyOrder = {
      ...validOrderPayload,
      items: [
        {
          productId: "prod-1",
          productName: "Cat Food",
          image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c",
          quantity: 0,
          price: 4500,
        },
      ],
    };
    const result = orderSchema.safeParse(invalidQtyOrder);
    expect(result.success).toBe(false);
  });

  it("fails with invalid paymentMethod", () => {
    const invalidPaymentOrder = {
      ...validOrderPayload,
      paymentMethod: "crypto",
    };
    const result = orderSchema.safeParse(invalidPaymentOrder);
    expect(result.success).toBe(false);
  });

  it("fails when total is negative", () => {
    const negativeTotalOrder = {
      ...validOrderPayload,
      total: -100,
    };
    const result = orderSchema.safeParse(negativeTotalOrder);
    expect(result.success).toBe(false);
  });
});

describe("Product Schema Validation", () => {
  const validProduct = {
    name: "Orthopedic Memory Foam Dog Bed",
    price: 6500,
    category: "Beds & Furniture",
    petType: "dog" as const,
    inStock: true,
    stockQuantity: 15,
    images: ["https://images.unsplash.com/photo-1548767797-d8c844163c4c"],
    description: "High quality orthopedic bed for large and small dogs.",
  };

  it("validates a complete and valid product", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("fails when price is negative", () => {
    const invalidPrice = { ...validProduct, price: -50 };
    const result = productSchema.safeParse(invalidPrice);
    expect(result.success).toBe(false);
  });

  it("fails when name is missing or empty", () => {
    const emptyName = { ...validProduct, name: "" };
    const result = productSchema.safeParse(emptyName);
    expect(result.success).toBe(false);
  });

  it("fails when images array is empty", () => {
    const noImages = { ...validProduct, images: [] };
    const result = productSchema.safeParse(noImages);
    expect(result.success).toBe(false);
  });

  it("fails when stockQuantity is negative", () => {
    const negativeStock = { ...validProduct, stockQuantity: -5 };
    const result = productSchema.safeParse(negativeStock);
    expect(result.success).toBe(false);
  });
});

describe("Coupon Schema Validation", () => {
  it("validates and converts coupon code to uppercase", () => {
    const validCoupon = {
      code: "welcome20",
      discountPercent: 20,
      minSpend: 2000,
    };
    const result = couponSchema.safeParse(validCoupon);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe("WELCOME20");
    }
  });

  it("fails when discountPercent is outside 1 to 100", () => {
    expect(couponSchema.safeParse({ code: "SALE", discountPercent: 0 }).success).toBe(false);
    expect(couponSchema.safeParse({ code: "SALE", discountPercent: 101 }).success).toBe(false);
    expect(couponSchema.safeParse({ code: "SALE", discountPercent: 50 }).success).toBe(true);
  });

  it("fails when minSpend is negative", () => {
    const result = couponSchema.safeParse({ code: "SALE", discountPercent: 10, minSpend: -100 });
    expect(result.success).toBe(false);
  });
});

describe("Review Schema Validation", () => {
  const validReview = {
    productId: "prod-1",
    authorName: "Usman Ghani",
    rating: 5,
    title: "Awesome product!",
    comment: "My golden retriever absolutely loves this meal and finishes it in seconds.",
    isVerifiedPurchase: true,
  };

  it("validates a valid review", () => {
    const result = reviewSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it("fails when rating is not between 1 and 5", () => {
    expect(reviewSchema.safeParse({ ...validReview, rating: 0 }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...validReview, rating: 6 }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...validReview, rating: 3 }).success).toBe(true);
  });

  it("fails when comment is shorter than 5 characters", () => {
    const shortComment = { ...validReview, comment: "Good" };
    const result = reviewSchema.safeParse(shortComment);
    expect(result.success).toBe(false);
  });

  it("fails when authorName is empty", () => {
    const emptyAuthor = { ...validReview, authorName: "" };
    const result = reviewSchema.safeParse(emptyAuthor);
    expect(result.success).toBe(false);
  });
});

describe("Contact Schema Validation", () => {
  it("validates contact form with valid email", () => {
    const validContact = {
      name: "Zainab Bibi",
      email: "zainab@example.com",
      message: "I want to inquire about custom cat food delivery in Islamabad.",
    };
    const result = contactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });

  it("validates contact form with valid Pakistani phone", () => {
    const validContact = {
      name: "Zainab Bibi",
      phone: "03001234567",
      message: "I want to inquire about custom cat food delivery in Islamabad.",
    };
    const result = contactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });

  it("fails when neither email nor phone is provided", () => {
    const invalidContact = {
      name: "Zainab Bibi",
      message: "I want to inquire about custom cat food delivery in Islamabad.",
    };
    const result = contactSchema.safeParse(invalidContact);
    expect(result.success).toBe(false);
  });

  it("fails when message is too short", () => {
    const invalidContact = {
      name: "Zainab Bibi",
      email: "zainab@example.com",
      message: "Hi",
    };
    const result = contactSchema.safeParse(invalidContact);
    expect(result.success).toBe(false);
  });
});
