"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPKR, VERIFIED_STORE_INFO, buildWhatsAppOrderUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    shippingAmount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingProgress,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode("");
    }
  };

  const amountNeededForFreeShipping = Math.max(
    0,
    VERIFIED_STORE_INFO.freeShippingThreshold - subtotal
  );

  const whatsappItems = cart.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price + (item.selectedVariant?.priceModifier || 0),
    variant: item.selectedVariant?.label,
  }));

  const whatsappUrl = buildWhatsAppOrderUrl(whatsappItems, total);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Shopping Bag" }]} />

        <div className="my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-display">
                Your Shopping Bag
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review your items, apply vouchers, and select checkout or instant WhatsApp ordering.
              </p>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 self-start"
              >
                <Trash2 className="w-4 h-4" />
                <span>Empty Cart</span>
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-4xl border border-slate-200/80 p-12 sm:p-16 text-center max-w-2xl mx-auto my-10 shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-4xl mx-auto mb-5 text-slate-400">
                🐾
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Your Shopping Bag is Currently Empty
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 mb-8">
                Explore our collection of orthopedic beds, luxury apparel, premium nutrition, and interactive toys for your pets.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs sm:text-sm py-3.5 px-8 rounded-full shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Pet Catalog</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Shipping Meter */}
                <div className="bg-amber-50/90 rounded-3xl p-4 sm:p-5 border border-amber-200/70 shadow-sm">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
                    <span className="flex items-center gap-2 text-amber-950">
                      <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      {amountNeededForFreeShipping === 0 ? (
                        <span className="text-emerald-800 font-bold">
                          🎉 Awesome! You unlocked FREE nationwide shipping!
                        </span>
                      ) : (
                        <span>
                          Add <strong>{formatPKR(amountNeededForFreeShipping)}</strong> more to get <strong>FREE Nationwide Delivery</strong>
                        </span>
                      )}
                    </span>
                    <span className="text-amber-800 font-black">{freeShippingProgress}%</span>
                  </div>
                  <div className="w-full bg-amber-200/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        freeShippingProgress >= 100 ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Items Table Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm divide-y divide-slate-100">
                  {cart.map((item, index) => {
                    const itemUnitPrice =
                      item.product.price + (item.selectedVariant?.priceModifier || 0);

                    return (
                      <div
                        key={`${item.product.id}-${item.selectedVariant?.value || index}`}
                        className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        {/* Thumbnail & Title */}
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                              {item.product.category}
                            </span>
                            <Link
                              href={`/shop/${item.product.id}`}
                              className="block text-sm sm:text-base font-bold text-slate-900 hover:text-brand-900 font-display line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            {item.selectedVariant && (
                              <p className="text-xs text-slate-500">
                                Variant: <strong className="text-slate-700">{item.selectedVariant.label}</strong>
                              </p>
                            )}
                            <p className="text-xs font-bold text-brand-900 sm:hidden">
                              {formatPKR(itemUnitPrice)} each
                            </p>
                          </div>
                        </div>

                        {/* Quantity & Total */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Quantity Counter */}
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.selectedVariant?.value
                                )
                              }
                              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs sm:text-sm font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.selectedVariant?.value
                                )
                              }
                              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right min-w-[90px]">
                            <span className="text-sm sm:text-base font-black text-brand-900 block">
                              {formatPKR(itemUnitPrice * item.quantity)}
                            </span>
                            <span className="text-[11px] text-slate-400 hidden sm:block">
                              {formatPKR(itemUnitPrice)} each
                            </span>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              removeFromCart(item.product.id, item.selectedVariant?.value)
                            }
                            className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Optional Special Order Notes */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-2">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Special Delivery / Pet Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Call before delivery, ring doorbell twice, leave at gate..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-900"
                  />
                </div>

                {/* Continue Shopping Link */}
                <div>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary & Checkout Card */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5 sticky top-24">
                <h3 className="text-lg font-black text-slate-900 font-display pb-3 border-b border-slate-100">
                  Order Summary
                </h3>

                {/* Coupon Input */}
                <div>
                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>
                          Coupon: <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Discount Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs uppercase placeholder:normal-case focus:outline-none focus:bg-white focus:border-brand-900"
                      />
                      <button
                        type="submit"
                        className="bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs px-5 py-2.5 rounded-2xl transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-600 mt-1.5">{couponError}</p>
                  )}
                </div>

                {/* Breakdown */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-semibold text-slate-900">{formatPKR(subtotal)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({appliedCoupon.discountPercent}%)</span>
                      <span>-{formatPKR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Across Pakistan</span>
                    <span className="font-semibold text-slate-900">
                      {shippingAmount === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        formatPKR(shippingAmount)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base sm:text-lg font-black text-brand-900 pt-3 border-t border-slate-200">
                    <span>Estimated Total</span>
                    <span>{formatPKR(total)}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all group"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all group"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
                    <span>Instant WhatsApp Order</span>
                  </a>
                </div>

                {/* Assurances */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Cash on Delivery & Bank Transfer Supported</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Delivered safely in 24-48 business hours</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
