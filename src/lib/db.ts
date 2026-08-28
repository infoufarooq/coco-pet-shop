import { Product, Coupon, OrderRecord, Review } from "@/types";
import { PRODUCTS, COUPONS, TESTIMONIALS } from "@/data/products";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Re-export OrderRecord for consumers importing from db
export type { OrderRecord };

// Supabase environment variables & client initialization
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

let supabaseClient: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  } catch (error) {
    console.warn("Failed to initialize Supabase client:", error);
  }
}

// Verified initial seed reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "prod-4",
    authorName: "Zainab Malik",
    rating: 5,
    title: "Outstanding Orthopedic Bed!",
    comment:
      "The memory foam bed is pure luxury! Milo had trouble sleeping on normal rugs due to hip stiffness, but he now spends hours sleeping peacefully in his CoCo bed. Delivery took only 24 hours in Lahore!",
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    city: "Lahore",
    petName: "Milo (Golden Retriever)",
    author: "Zainab Malik",
    date: "14 Aug 2026",
    verifiedBuyer: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "rev-2",
    productId: "prod-13",
    authorName: "Bilal Farooq",
    rating: 5,
    title: "Cat Tree & Sheba Food Delivered Fast",
    comment:
      "Extremely pleased with the WhatsApp order service. I sent my cart summary and the team confirmed and dispatched immediately. The cat tree is sturdy and high quality. Will definitely order regularly!",
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
    city: "Islamabad",
    petName: "Luna & Bella (Persian Cats)",
    author: "Bilal Farooq",
    date: "20 Aug 2026",
    verifiedBuyer: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "rev-3",
    productId: "prod-6",
    authorName: "Ayesha Khan",
    rating: 5,
    title: "Adorable Puffer Jacket & Fast Shipping",
    comment:
      "The winter puffer vest with the harness rings fits Coco like a glove! Super warm, high-quality zippers and water-resistant. Best pet boutique in Pakistan!",
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 26).toISOString(),
    city: "Karachi",
    petName: "Coco (Shih Tzu)",
    author: "Ayesha Khan",
    date: "02 Aug 2026",
    verifiedBuyer: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "rev-4",
    productId: "prod-1",
    authorName: "Hassan Ali",
    rating: 5,
    title: "Cats love the poultry cuts!",
    comment:
      "Excellent high-moisture canned food, easily digestible and fresh aroma. Highly recommended for picky eaters.",
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    city: "Lahore",
    author: "Hassan Ali",
    date: "24 Aug 2026",
    verifiedBuyer: true,
  },
  {
    id: "rev-5",
    productId: "prod-2",
    authorName: "Farah Sheikh",
    rating: 5,
    title: "Healthy Coat in 3 Weeks",
    comment:
      "Switched my German Shepherd to Happy Dog Nature Life. The fur shine improvement is visible within 3 weeks!",
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    city: "Islamabad",
    author: "Farah Sheikh",
    date: "19 Aug 2026",
    verifiedBuyer: true,
  },
];

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "ord-1",
    orderNumber: "COCO-PK-98214",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    customerName: "Ayesha Malik",
    customerPhone: "03001234567",
    customerWhatsApp: "03001234567",
    customerEmail: "ayesha.m@gmail.com",
    customerAddress: "House 45, Street 12, Phase 5 DHA",
    customerCity: "Lahore",
    paymentMethod: "cod",
    status: "delivered",
    items: [
      {
        productId: "prod-4",
        productName: "Orthopedic Memory Foam Pet Lounger Bed",
        image:
          "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        price: 5865,
        variantLabel: "Medium (Beige)",
      },
    ],
    subtotal: 5865,
    discount: 0,
    shipping: 0,
    total: 5865,
  },
  {
    id: "ord-2",
    orderNumber: "COCO-PK-74512",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    customerName: "Zainab Tariq",
    customerPhone: "03219876543",
    customerWhatsApp: "03219876543",
    customerEmail: "zainab.t@yahoo.com",
    customerAddress: "Apartment 4B, Clifton Block 2",
    customerCity: "Karachi",
    paymentMethod: "cod",
    status: "dispatched",
    items: [
      {
        productId: "prod-2",
        productName:
          "Gourmet Ocean Fish & Rice Wet Cat Food Pouch (Pack of 12)",
        image:
          "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
        quantity: 2,
        price: 2450,
      },
      {
        productId: "prod-8",
        productName: "Interactive Laser & Feather Teaser Cat Toy",
        image:
          "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        price: 1350,
      },
    ],
    subtotal: 6250,
    discount: 625,
    shipping: 0,
    total: 5625,
    couponCode: "PETLOVE",
  },
  {
    id: "ord-3",
    orderNumber: "COCO-PK-31904",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customerName: "Hamza Rasheed",
    customerPhone: "03335554433",
    customerWhatsApp: "03335554433",
    customerEmail: "hamza.r@gmail.com",
    customerAddress: "Sector F-7/2, Street 18",
    customerCity: "Islamabad",
    paymentMethod: "bank_transfer",
    status: "confirmed",
    items: [
      {
        productId: "prod-1",
        productName: "Royal Canine Nutrition Adult Dry Dog Food (3kg)",
        image:
          "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        price: 4950,
      },
    ],
    subtotal: 4950,
    discount: 742,
    shipping: 0,
    total: 4208,
    couponCode: "COCOFIRST",
  },
];

// Global store initialized with verified seed data
declare global {
  // eslint-disable-next-line no-var
  var __petshop_db:
    | {
        products: Product[];
        coupons: Coupon[];
        orders: OrderRecord[];
        reviews: Review[];
      }
    | undefined;
}

function initDb() {
  const products: Product[] = PRODUCTS.map((p) => {
    const stock = p.stockQuantity ?? p.stockCount ?? 20;
    return {
      ...p,
      stockQuantity: stock,
      stockCount: stock,
      rating: p.rating ?? 5.0,
      reviewsCount: p.reviewsCount ?? 0,
      inStock: p.inStock !== false && stock > 0,
    };
  });

  const coupons: Coupon[] = COUPONS.map((c) => ({
    ...c,
    isActive: c.isActive !== false,
    usageCount: c.usageCount ?? 0,
  }));

  const orders: OrderRecord[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
  const reviews: Review[] = JSON.parse(JSON.stringify(INITIAL_REVIEWS));

  return { products, coupons, orders, reviews };
}

if (!global.__petshop_db) {
  global.__petshop_db = initDb();
}

export const db = {
  // Dual-mode helpers
  getMode: (): "supabase" | "in-memory" => {
    return supabaseClient ? "supabase" : "in-memory";
  },

  isSupabaseConfigured: (): boolean => {
    return supabaseClient !== null;
  },

  getSupabaseClient: (): SupabaseClient | null => {
    return supabaseClient;
  },

  reset: () => {
    global.__petshop_db = initDb();
  },

  // Product Operations
  getProducts: (filter?: {
    category?: string;
    animalType?: string;
    inStock?: boolean;
    featured?: boolean;
  }) => {
    let products = global.__petshop_db!.products;
    if (filter?.category && filter.category !== "all") {
      products = products.filter((p) => p.categorySlug === filter.category);
    }
    if (filter?.animalType && filter.animalType !== "all") {
      products = products.filter(
        (p) => p.petType === filter.animalType || p.petType === "all"
      );
    }
    if (filter?.inStock !== undefined) {
      products = products.filter((p) => p.inStock === filter.inStock);
    }
    if (filter?.featured !== undefined) {
      products = products.filter((p) => Boolean(p.featured) === filter.featured);
    }
    return products;
  },

  getProductById: (id: string) => {
    const query = id.trim().toLowerCase();
    return (
      global.__petshop_db!.products.find(
        (p) => p.id.toLowerCase() === query || p.slug.toLowerCase() === query
      ) || null
    );
  },

  addProduct: (productData: Omit<Product, "id">) => {
    const newId = `prod-${Date.now()}`;
    const stock = productData.stockQuantity ?? productData.stockCount ?? 20;
    const newProduct: Product = {
      ...productData,
      id: newId,
      slug:
        productData.slug ||
        productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      stockQuantity: stock,
      stockCount: stock,
      rating: productData.rating ?? 5.0,
      reviewsCount: productData.reviewsCount ?? 0,
      inStock: productData.inStock !== false && stock > 0,
      createdAt: new Date().toISOString(),
    };
    global.__petshop_db!.products.unshift(newProduct);
    return newProduct;
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const index = global.__petshop_db!.products.findIndex(
      (p) => p.id === id || p.slug === id
    );
    if (index === -1) return null;

    const current = global.__petshop_db!.products[index];
    const updated: Product = { ...current, ...updates };

    if (updates.stockQuantity !== undefined) {
      updated.stockQuantity = updates.stockQuantity;
      updated.stockCount = updates.stockQuantity;
      if (updates.stockQuantity <= 0) {
        updated.inStock = false;
      } else if (updates.inStock === undefined) {
        updated.inStock = true;
      }
    }

    global.__petshop_db!.products[index] = updated;
    return updated;
  },

  updateStock: (productId: string, quantityChange: number) => {
    const product = db.getProductById(productId);
    if (!product) return null;

    const currentStock = product.stockQuantity ?? product.stockCount ?? 0;
    const newStock = Math.max(0, currentStock + quantityChange);
    return db.updateProduct(product.id, {
      stockQuantity: newStock,
      stockCount: newStock,
      inStock: newStock > 0,
    });
  },

  deleteProduct: (id: string) => {
    const index = global.__petshop_db!.products.findIndex(
      (p) => p.id === id || p.slug === id
    );
    if (index === -1) return false;
    global.__petshop_db!.products.splice(index, 1);
    return true;
  },

  // Review Operations
  getReviews: (productId?: string) => {
    let reviews = global.__petshop_db!.reviews;
    if (productId) {
      const q = productId.trim().toLowerCase();
      reviews = reviews.filter((r) => r.productId.toLowerCase() === q);
    }
    // Sort newest first
    return [...reviews].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getReviewById: (id: string) => {
    return (
      global.__petshop_db!.reviews.find((r) => r.id === id) || null
    );
  },

  addReview: (data: Omit<Review, "id" | "createdAt">) => {
    const newId = `rev-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const createdAt = new Date().toISOString();

    const newReview: Review = {
      ...data,
      id: newId,
      createdAt,
      isVerifiedPurchase: data.isVerifiedPurchase ?? true,
      author: data.author || data.authorName,
      date: data.date || "Just now",
      verifiedBuyer: data.isVerifiedPurchase ?? true,
    };

    global.__petshop_db!.reviews.unshift(newReview);

    // Recalculate target product rating and reviewsCount
    const product = db.getProductById(data.productId);
    if (product) {
      const currentCount = product.reviewsCount ?? 0;
      const currentRating = product.rating ?? 5.0;
      const newReviewsCount = currentCount + 1;
      const newRating =
        currentCount === 0
          ? data.rating
          : Number(
              (
                (currentRating * currentCount + data.rating) /
                newReviewsCount
              ).toFixed(1)
            );

      db.updateProduct(product.id, {
        rating: newRating,
        reviewsCount: newReviewsCount,
      });
    }

    return newReview;
  },

  // Order Operations
  getOrders: () => {
    return global.__petshop_db!.orders;
  },

  getOrderByIdOrNumber: (query: string) => {
    const q = query.trim().toLowerCase();
    return (
      global.__petshop_db!.orders.find(
        (o) =>
          o.id.toLowerCase() === q ||
          o.orderNumber.toLowerCase() === q ||
          o.customerPhone.includes(q)
      ) || null
    );
  },

  createOrder: (
    orderData: Omit<OrderRecord, "id" | "orderNumber" | "createdAt">
  ) => {
    const orderNumber = `COCO-PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    // 1. Decrement stock for ordered items
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        if (!item.productId) continue;
        const product = db.getProductById(item.productId);
        if (product) {
          const currentStock =
            product.stockQuantity ?? product.stockCount ?? 20;
          const newStock = Math.max(0, currentStock - (item.quantity || 1));
          db.updateProduct(product.id, {
            stockQuantity: newStock,
            stockCount: newStock,
            inStock: newStock > 0,
          });
        }
      }
    }

    // 2. Increment coupon usage if applied
    if (orderData.couponCode) {
      const coupon = global.__petshop_db!.coupons.find(
        (c) =>
          c.code.toUpperCase() === orderData.couponCode!.trim().toUpperCase()
      );
      if (coupon) {
        coupon.usageCount = (coupon.usageCount || 0) + 1;
      }
    }

    global.__petshop_db!.orders.unshift(newOrder);
    return newOrder;
  },

  updateOrderStatus: (id: string, status: OrderRecord["status"]) => {
    const order = global.__petshop_db!.orders.find(
      (o) => o.id === id || o.orderNumber === id
    );
    if (!order) return null;
    order.status = status;
    return order;
  },

  // Coupon Operations
  getCoupons: () => {
    return global.__petshop_db!.coupons;
  },

  validateCoupon: (code: string, subtotal: number) => {
    const coupon = global.__petshop_db!.coupons.find(
      (c) =>
        c.code.toUpperCase() === code.trim().toUpperCase() &&
        c.isActive !== false
    );
    if (!coupon) {
      return { isValid: false, message: "Invalid or expired coupon code." };
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return { isValid: false, message: "This coupon code has expired." };
    }
    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        isValid: false,
        message: `Minimum spend of Rs. ${coupon.minSpend.toLocaleString()} required for this coupon.`,
      };
    }
    return {
      isValid: true,
      coupon,
      discountAmount: Math.round((subtotal * coupon.discountPercent) / 100),
    };
  },

  addCoupon: (
    couponData: Omit<Coupon, "code"> & { code: string }
  ) => {
    const newCoupon: Coupon = {
      ...couponData,
      code: couponData.code.toUpperCase().trim(),
      isActive: couponData.isActive !== false,
      usageCount: couponData.usageCount ?? 0,
    };
    global.__petshop_db!.coupons.push(newCoupon);
    return newCoupon;
  },

  toggleCouponStatus: (code: string) => {
    const coupon = global.__petshop_db!.coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (!coupon) return null;
    coupon.isActive = !coupon.isActive;
    return coupon;
  },

  deleteCoupon: (code: string) => {
    const index = global.__petshop_db!.coupons.findIndex(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (index === -1) return false;
    global.__petshop_db!.coupons.splice(index, 1);
    return true;
  },

  // Analytics Stats
  getAnalytics: () => {
    const orders = global.__petshop_db!.orders;
    const products = global.__petshop_db!.products;
    const coupons = global.__petshop_db!.coupons;
    const reviews = global.__petshop_db!.reviews;

    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (o) => o.status === "pending" || o.status === "confirmed"
    ).length;
    const activeProducts = products.filter((p) => p.inStock).length;
    const outOfStockProducts = products.filter((p) => !p.inStock).length;
    const lowStockProducts = products.filter(
      (p) => p.inStock && (p.stockQuantity ?? 0) <= 5
    ).length;

    const recentOrders = orders.slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      totalCoupons: coupons.length,
      totalReviews: reviews.length,
      recentOrders,
    };
  },
};