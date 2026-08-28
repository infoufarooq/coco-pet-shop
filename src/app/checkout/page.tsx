"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPKR, VERIFIED_STORE_INFO, buildWhatsAppOrderUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Truck,
  MessageSquare,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Building,
  CreditCard,
  Banknote,
  Home,
  Check,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, subtotal, discountAmount, shippingAmount, total, appliedCoupon, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "Lahore",
    postalCode: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "bank_transfer" | "whatsapp",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const PAKISTAN_CITIES = [
    "Lahore",
    "Karachi",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Sialkot",
    "Gujranwala",
    "Bahawalpur",
    "Sargodha",
    "Hyderabad",
    "Abbottabad",
    "Other Pakistan City",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill in your name, phone number, and delivery address.");
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const orderId = `COCO-PK-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderInfo = {
        orderId,
        date: new Date().toLocaleDateString("en-PK", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        items: [...cart],
        customer: { ...formData },
        subtotal,
        discount: discountAmount,
        shipping: shippingAmount,
        total,
        appliedCoupon,
      };

      setCompletedOrder(orderInfo);
      clearCart();
      setIsSubmitting(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // fallback if canvas not available
      }
    }, 1000);
  };

  // If order is completed, display Order Confirmation Screen
  if (completedOrder) {
    const whatsappOrderItems = completedOrder.items.map((item: any) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price + (item.selectedVariant?.priceModifier || 0),
      variant: item.selectedVariant?.label,
    }));

    const confirmationWhatsAppUrl = buildWhatsAppOrderUrl(
      whatsappOrderItems,
      completedOrder.total,
      completedOrder.customer.fullName,
      completedOrder.customer.city
    );

    return (
      <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-4xl border border-slate-200/80 p-8 sm:p-12 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display mt-2">
                Thank You, {completedOrder.customer.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Your pet accessories order has been placed successfully. Order ID:{" "}
                <strong className="text-brand-900 font-mono text-sm">{completedOrder.orderId}</strong>
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-slate-50 rounded-3xl p-6 text-left border border-slate-200/80 space-y-4 text-xs sm:text-sm">
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Delivery To:</span>
                <span className="font-bold text-slate-900 text-right">
                  {completedOrder.customer.address}, {completedOrder.customer.city}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Phone / WhatsApp:</span>
                <span className="font-bold text-slate-900">
                  {completedOrder.customer.phone}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Payment Method:</span>
                <span className="font-bold text-brand-900 uppercase">
                  {completedOrder.customer.paymentMethod === "cod"
                    ? "Cash on Delivery (COD)"
                    : completedOrder.customer.paymentMethod === "bank_transfer"
                    ? "Direct Bank Transfer"
                    : "WhatsApp Confirmation"}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-base font-black text-slate-900">
                <span>Total Payable:</span>
                <span className="text-brand-900">{formatPKR(completedOrder.total)}</span>
              </div>
            </div>

            {/* Direct WhatsApp Confirmation Button */}
            <div className="space-y-3 pt-2">
              <a
                href={confirmationWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-4 px-6 rounded-2xl shadow-lg transition-all"
              >
                <MessageSquare className="w-5 h-5 text-emerald-100" />
                <span>Notify CoCo & Candy on WhatsApp (Fast-Track Dispatch)</span>
              </a>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-900 transition-colors pt-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home Page</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty, redirect prompt
  if (cart.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 font-display">No Items to Checkout</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Please add items to your shopping bag before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="bg-brand-900 text-white text-xs font-bold py-3 px-6 rounded-full shadow"
          >
            Go to Shop Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Shopping Bag", href: "/cart" },
            { label: "Checkout & Delivery" },
          ]}
        />

        <div className="my-6">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display mb-1">
            Checkout & Nationwide Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-8">
            Enter your shipping details below. No live online card required; pay safely upon delivery or via direct transfer.
          </p>

          <form onSubmit={handleSubmitOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Customer & Delivery Details */}
              <div className="lg:col-span-7 space-y-6">
                {/* Contact Information Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <span className="w-7 h-7 rounded-full bg-brand-900 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base font-bold text-slate-900 font-display">
                      Customer Contact Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Ayesha Malik"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Phone Number (Call / SMS) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0300 1234567"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        WhatsApp Number (For Order Updates)
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="0300 1234567 (optional)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <span className="w-7 h-7 rounded-full bg-brand-900 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base font-bold text-slate-900 font-display">
                      Delivery Address in Pakistan
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Complete Street Address, House / Plaza # <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House # 12, Street 4, Phase 5 DHA..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                          City <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                        >
                          {PAKISTAN_CITIES.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                          Postal Code (Optional)
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="e.g. 54000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Special Delivery Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="e.g. Leave with security guard, call before arriving..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <span className="w-7 h-7 rounded-full bg-brand-900 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h2 className="text-base font-bold text-slate-900 font-display">
                      Select Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* COD */}
                    <label
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === "cod"
                          ? "border-brand-900 bg-brand-50/50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                        className="mt-1 w-4 h-4 text-brand-900 border-slate-300 focus:ring-brand-900"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Most Popular
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Pay cash directly to the courier upon receiving your parcel at your doorstep.
                        </p>
                      </div>
                    </label>

                    {/* Bank Transfer */}
                    <label
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === "bank_transfer"
                          ? "border-brand-900 bg-brand-50/50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={formData.paymentMethod === "bank_transfer"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "bank_transfer" })}
                        className="mt-1 w-4 h-4 text-brand-900 border-slate-300 focus:ring-brand-900"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-slate-900 block">
                          Direct Bank Transfer / IBFT
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Transfer to our official Meezan / HBL bank account and share the receipt via WhatsApp.
                        </p>
                      </div>
                    </label>

                    {/* WhatsApp Checkout */}
                    <label
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === "whatsapp"
                          ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={formData.paymentMethod === "whatsapp"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "whatsapp" })}
                        className="mt-1 w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">
                            Confirm via WhatsApp
                          </span>
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Submit order and directly coordinate delivery timings with our customer support team.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary & Place Order */}
              <div className="lg:col-span-5 space-y-6 sticky top-24">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
                  <h3 className="text-base font-black text-slate-900 font-display pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Order Items ({cart.length})</span>
                    <Link href="/cart" className="text-xs font-bold text-brand-900 hover:underline">
                      Edit Bag
                    </Link>
                  </h3>

                  {/* Item List Preview */}
                  <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1">
                    {cart.map((item, idx) => {
                      const itemPrice =
                        item.product.price + (item.selectedVariant?.priceModifier || 0);
                      return (
                        <div key={idx} className="flex items-center gap-3 pt-3 first:pt-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.label}` : ""}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            {formatPKR(itemPrice * item.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">{formatPKR(subtotal)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Discount ({appliedCoupon.code} - {appliedCoupon.discountPercent}%)</span>
                        <span>-{formatPKR(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Shipping (Pakistan)</span>
                      <span className="font-semibold text-slate-900">
                        {shippingAmount === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          formatPKR(shippingAmount)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-black text-brand-900 pt-3 border-t border-slate-200">
                      <span>Total Amount</span>
                      <span>{formatPKR(total)}</span>
                    </div>
                  </div>

                  {/* Place Order CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-900 hover:bg-brand-800 disabled:bg-slate-400 text-white font-extrabold text-sm py-4 px-6 rounded-2xl shadow-lg shadow-brand-900/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    {isSubmitting ? (
                      <span>Processing Order...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Place Order ({formatPKR(total)})</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="space-y-1.5 pt-2 text-[11px] text-slate-400 text-center">
                    <p className="flex items-center justify-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-500" /> Safe & Secure Order Processing
                    </p>
                    <p>No credit card required. Pay on delivery.</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
