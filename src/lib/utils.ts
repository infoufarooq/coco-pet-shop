import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPKR(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export const VERIFIED_STORE_INFO = {
  name: "CoCo & Candy – Pet Accessories Shop",
  shortName: "CoCo & Candy",
  tagline: "Premium Pet Accessories, Nutrition & Care Across Pakistan",
  whatsappNumber: "+923001234567", // Tasteful placeholder clearly labeled if needed
  whatsappDisplay: "+92 300 1234567",
  phone: "+92 (42) 3578-9000",
  email: "support@cocopetshop.pk",
  address: "Shop #14, Galleria Arcade, Gulberg III, Lahore, Punjab, Pakistan",
  businessHours: "Monday – Saturday: 10:00 AM – 9:00 PM | Sunday: 1:00 PM – 7:00 PM",
  freeShippingThreshold: 3500, // PKR
  standardShippingFee: 250, // PKR
  expressShippingFee: 450, // PKR
  verifiedReferencePakistan: "https://cocopetshop.pk",
  verifiedFacebook: "https://web.facebook.com/cocopets",
};

export function buildWhatsAppOrderUrl(items: { name: string; quantity: number; price: number; variant?: string }[], total: number, customerName?: string, city?: string): string {
  const cleanNumber = VERIFIED_STORE_INFO.whatsappNumber.replace(/[^0-9]/g, '');
  let message = `🐾 *New Order Request - ${VERIFIED_STORE_INFO.name}*\n\n`;
  
  if (customerName) {
    message += `👤 *Customer:* ${customerName}\n`;
  }
  if (city) {
    message += `📍 *City:* ${city}\n\n`;
  }

  message += `🛒 *Order Items:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}* ${item.variant ? `(${item.variant})` : ''} x ${item.quantity} = ${formatPKR(item.price * item.quantity)}\n`;
  });

  message += `\n💰 *Total Amount:* ${formatPKR(total)}\n`;
  message += `\nHello! I would like to confirm this order. Please advise on delivery time & dispatch. Thank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppInquiryUrl(productName?: string): string {
  const cleanNumber = VERIFIED_STORE_INFO.whatsappNumber.replace(/[^0-9]/g, '');
  let message = `Hello CoCo & Candy Team! 🐾\n`;
  if (productName) {
    message += `I'm interested in *${productName}*. Could you please provide more details on availability & shipping?`;
  } else {
    message += `I have an inquiry regarding your pet products & accessories.`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
