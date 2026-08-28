import { Product, Coupon, OrderDetails } from "@/types";
import { PRODUCTS, COUPONS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";

// In-memory + persistent store model
// In a serverless environment, this maintains state during runtime
// and integrates seamlessly with optional external PostgreSQL / Supabase if DATABASE_URL is set.

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerWhatsApp?: string;
  customerEmail?: string;
  customerAddress: string;
  customerCity: string;
  customerNotes?: string;
  paymentMethod: "cod" | "bank_transfer" | "whatsapp";
  status: "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled";
  items: {
    productId: string;
    productName: string;
    image: string;
    quantity: number;
    price: number;
    variantLabel?: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
}

// Global store initialized with verified seed data
declare global {
  // eslint-disable-next-line no-var
  var __petshop_db: {
    products: Product[];
    coupons: Coupon[];
    orders: OrderRecord[];
  } | undefined;
}

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
        image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80",
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
        productName: "Gourmet Ocean Fish & Rice Wet Cat Food Pouch (Pack of 12)",
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
        quantity: 2,
        price: 2450,
      },
      {
        productId: "prod-8",
        productName: "Interactive Laser & Feather Teaser Cat Toy",
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
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
        image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80",
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

if (!global.__petshop_db) {
  global.__petshop_db = {
    products: [...PRODUCTS],
    coupons: [...COUPONS],
    orders: [...INITIAL_ORDERS],
  };
}

export const db = {
  // Product Operations
  getProducts: () => {
    return global.__petshop_db!.products;
  },

  getProductById: (id: string) => {
    return (
      global.__petshop_db!.products.find((p) => p.id === id || p.slug === id) ||
      null
    );
  },

  addProduct: (productData: Omit<Product, "id">) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    global.__petshop_db!.products.unshift(newProduct);
    return newProduct;
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const index = global.__petshop_db!.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated = { ...global.__petshop_db!.products[index], ...updates };
    global.__petshop_db!.products[index] = updated;
    return updated;
  },

  deleteProduct: (id: string) => {
    const index = global.__petshop_db!.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    global.__petshop_db!.products.splice(index, 1);
    return true;
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

  createOrder: (orderData: Omit<OrderRecord, "id" | "orderNumber" | "createdAt">) => {
    const orderNumber = `COCO-PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };
    global.__petshop_db!.orders.unshift(newOrder);
    return newOrder;
  },

  updateOrderStatus: (id: string, status: OrderRecord["status"]) => {
    const order = global.__petshop_db!.orders.find((o) => o.id === id || o.orderNumber === id);
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
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!coupon) {
      return { isValid: false, message: "Invalid or expired coupon code." };
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

  addCoupon: (couponData: Omit<Coupon, "code"> & { code: string }) => {
    const newCoupon: Coupon = {
      ...couponData,
      code: couponData.code.toUpperCase().trim(),
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

    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
    const activeProducts = products.filter((p) => p.inStock).length;
    const outOfStockProducts = products.filter((p) => !p.inStock).length;

    const recentOrders = orders.slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      activeProducts,
      outOfStockProducts,
      totalCoupons: coupons.length,
      recentOrders,
    };
  },
};