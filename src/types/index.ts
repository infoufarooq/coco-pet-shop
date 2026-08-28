export type UserRole = "admin" | "catalog_manager" | "order_packer" | "customer";

export interface PermissionSet {
  canViewDashboard: boolean;
  canManageCatalog: boolean;
  canUpdateStockAndPrice: boolean;
  canAcceptOrders: boolean;
  canPackOrders: boolean;
  canDispatchOrders: boolean;
  canSendWhatsAppConfirmation: boolean;
  canManageCoupons: boolean;
  canManageStaff: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isPhoneVerified?: boolean;
  whatsappVerifiedAt?: string;
  role: UserRole;
  petName?: string;
  petType?: "dog" | "cat" | "both" | "other";
  city?: string;
  address?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subCategory?: string;
  price: number; // in PKR
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
  stockCount?: number;
  stockQuantity?: number;
  petType: "dog" | "cat" | "all";
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  badge?: string;
  animalType?: string;
  images: string[];
  description: string;
  features: string[];
  ingredientsOrMaterials?: string[];
  usageInstructions?: string;
  specifications?: Record<string, unknown>;
  variants?: {
    type: "size" | "flavor" | "color" | "weight";
    options: {
      label: string;
      value: string;
      priceModifier?: number;
    }[];
  };
  weightOrVolume?: string;
  brand?: string;
  sku: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  productCount: number;
  featured?: boolean;
  subCategories?: {
    name: string;
    slug: string;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: {
    type: string;
    label: string;
    value: string;
    priceModifier?: number;
  };
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  minSpend?: number;
  isActive?: boolean;
  expiresAt?: string;
  usageCount?: number;
}

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
  packingStatus?: "unpacked" | "in_packing" | "packed" | "ready_to_ship";
  packedBy?: string;
  packedAt?: string;
  acceptedBy?: string;
  acceptedAt?: string;
  items: {
    productId: string;
    productName: string;
    image: string;
    quantity: number;
    price: number;
    variantLabel?: string;
    isPacked?: boolean;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
  paymentMethod: "cod" | "bank_transfer" | "whatsapp";
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  appliedCoupon?: Coupon | null;
  orderId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  // UI & backwards compatibility fields
  author?: string;
  city?: string;
  petName?: string;
  date?: string;
  verifiedBuyer?: boolean;
  avatarUrl?: string;
}