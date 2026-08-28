import { z } from "zod";

/**
 * Regex for standard Pakistani mobile numbers:
 * Supports: 03001234567, +923001234567, 00923001234567, 3001234567
 */
export const pakistaniPhoneRegex = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1, "Product name is required"),
  image: z.string().min(1, "Product image is required"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  price: z.number().nonnegative("Price must be non-negative"),
  variantLabel: z.string().optional(),
  isPacked: z.boolean().optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().regex(pakistaniPhoneRegex, "Valid Pakistani phone number is required (e.g. 03001234567 or +923001234567)"),
  customerWhatsApp: z.string().optional(),
  customerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  customerAddress: z.string().min(1, "Delivery address is required"),
  customerCity: z.string().min(1, "City is required"),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer", "whatsapp"], {
    message: "Invalid payment method. Allowed: cod, bank_transfer, whatsapp",
  }),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  subtotal: z.number().nonnegative("Subtotal must be non-negative"),
  discount: z.number().nonnegative().optional().default(0),
  shipping: z.number().nonnegative().optional().default(0),
  total: z.number().nonnegative("Total must be non-negative"),
  couponCode: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional(),
  price: z.number().nonnegative("Price must be non-negative"),
  originalPrice: z.number().nonnegative().optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  category: z.string().min(1, "Category is required"),
  categorySlug: z.string().optional(),
  petType: z.enum(["dog", "cat", "all"]).default("all"),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().nonnegative().default(20),
  images: z.array(z.string().min(1)).min(1, "At least one product image is required"),
  description: z.string().min(1, "Description is required"),
  rating: z.number().min(1).max(5).optional().default(5.0),
  reviewsCount: z.number().int().nonnegative().optional().default(0),
  isBestSeller: z.boolean().optional().default(false),
  isOnSale: z.boolean().optional().default(false),
  features: z.array(z.string()).optional().default([]),
  sku: z.string().optional(),
});

export const couponSchema = z.object({
  code: z
    .string()
    .min(1, "Coupon code is required")
    .transform((val) => val.toUpperCase().trim()),
  discountPercent: z
    .number()
    .int()
    .min(1, "Discount percentage must be at least 1%")
    .max(100, "Discount percentage cannot exceed 100%"),
  description: z.string().optional(),
  minSpend: z.number().nonnegative("Minimum spend must be non-negative").optional().default(0),
  isActive: z.boolean().optional().default(true),
  expiresAt: z.string().optional(),
});

export const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  authorName: z.string().min(1, "Author name is required"),
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  title: z.string().min(1, "Title is required"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
  isVerifiedPurchase: z.boolean().optional().default(true),
  city: z.string().optional(),
  petName: z.string().optional(),
});

export const contactSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().regex(pakistaniPhoneRegex, "Invalid Pakistani phone number").optional().or(z.literal("")),
    message: z.string().min(5, "Message must be at least 5 characters"),
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Either a valid email address or Pakistani phone number is required",
    path: ["email"],
  });

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
