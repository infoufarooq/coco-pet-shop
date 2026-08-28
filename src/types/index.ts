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
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount?: number;
  petType: 'dog' | 'cat' | 'all';
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  images: string[];
  description: string;
  features: string[];
  ingredientsOrMaterials?: string[];
  usageInstructions?: string;
  variants?: {
    type: 'size' | 'flavor' | 'color' | 'weight';
    options: {
      label: string;
      value: string;
      priceModifier?: number;
    }[];
  };
  weightOrVolume?: string;
  brand?: string;
  sku: string;
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
  paymentMethod: 'cod' | 'bank_transfer' | 'whatsapp';
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
  author: string;
  city: string;
  petName?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  productId?: string;
  avatarUrl?: string;
}