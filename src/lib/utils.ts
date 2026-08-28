import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VERIFIED_STORE_INFO = {
  name: "CoCo & Candy – Pet Accessories Shop",
  shortName: "CoCo & Candy",
  phone: "03457913191",
  phoneFormatted: "+92 345 7913191",
  whatsappNumber: "923457913191",
  whatsappDisplay: "0345-7913191",
  email: "info.ufarooq@gmail.com",
  address: "Lahore Fulfillment Hub (Serving Lahore, Karachi, Islamabad & Nationwide Pakistan)",
  businessHours: "Monday - Saturday: 9:00 AM - 9:00 PM (PKT)",
  currency: "PKR",
  currencySymbol: "Rs.",
  facebookUrl: "https://web.facebook.com/cocopets",
  pakistanStoreUrl: "https://cocopetshop.pk",
  freeShippingThreshold: 3500, // PKR
  standardShippingFee: 250, // PKR
};

export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function buildWhatsAppOrderUrl(
  items: { name: string; quantity: number; price: number; variant?: string }[],
  total: number,
  customerName?: string,
  customerCity?: string
): string {
  let message = `*Salam CoCo & Candy! I would like to place an order:*\n\n`;

  if (customerName) {
    message += `*Customer:* ${customerName}\n`;
  }
  if (customerCity) {
    message += `*City:* ${customerCity}\n`;
  }
  if (customerName || customerCity) {
    message += `\n`;
  }

  message += `*Items Ordered:*\n`;
  items.forEach((item, index) => {
    const variantStr = item.variant ? ` (${item.variant})` : "";
    message += `${index + 1}. ${item.name}${variantStr} x ${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
  });

  message += `\n*Total Payable:* Rs. ${total.toLocaleString()}`;
  message += `\n*Payment:* Cash on Delivery (COD)`;
  message += `\n\nPlease confirm order dispatch. Thank you! 🐾`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${VERIFIED_STORE_INFO.whatsappNumber}?text=${encoded}`;
}

export function buildWhatsAppInquiryUrl(productName?: string): string {
  let message = `Salam CoCo & Candy Team! `;
  if (productName) {
    message += `I have an inquiry regarding *${productName}*. Could you please assist me with sizing and availability?`;
  } else {
    message += `I need some assistance with pet food / accessories recommendations.`;
  }
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${VERIFIED_STORE_INFO.whatsappNumber}?text=${encoded}`;
}