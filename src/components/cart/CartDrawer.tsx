"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPKR, VERIFIED_STORE_INFO, buildWhatsAppOrderUrl } from "@/lib/utils";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Sparkles,
  Check,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
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

  if (!isCartOpen) return null;

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

  const whatsappItems = cart.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price + (item.selectedVariant?.priceModifier || 0),
    variant: item.selectedVariant?.label,
  }));

  const whatsappUrl = buildWhatsAppOrderUrl(whatsappItems, total);

  const amountNeededForFreeShipping = Math.max(
    0,
    VERIFIED_STORE_INFO.freeShippingThreshold - subtotal
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-brand-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight font-display">
                Your Shopping Bag
              </h3>
              <p className="text-[11px] text-slate-300">
                {cart.length} {cart.length === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-brand-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-amber-50/80 p-3 sm:p-4 border-b border-amber-200/60">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1.5 text-amber-900">
              <Truck className="w-4 h-4 text-amber-600" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-700 font-bold">
                  🎉 Congratulations! You unlocked FREE nationwide delivery!
                </span>
              ) : (
                <span>
                  Add <strong>{formatPKR(amountNeededForFreeShipping)}</strong> more for <strong>FREE Delivery</strong>
                </span>
              )}
            </span>
            <span className="text-amber-800 font-bold">{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-amber-200/70 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                freeShippingProgress >= 100 ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-3xl mb-4 text-slate-400">
              🐾
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Your bag is empty</h4>
            <p className="text-xs text-slate-500 max-w-xs mb-6">
              Looks like you haven&apos;t added any pet accessories or food yet. Discover our best-selling collections!
            </p>
            <button
              onClick={closeCart}
              className="bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold py-3 px-6 rounded-full shadow-md transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-4 sm:p-5 space-y-4">
            {cart.map((item, index) => {
              const itemUnitPrice =
                item.product.price + (item.selectedVariant?.priceModifier || 0);
              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.value || index}`}
                  className="flex gap-3.5 pt-4 first:pt-0"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/shop/${item.product.id}`}
                          onClick={closeCart}
                          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-900 line-clamp-2 leading-snug"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedVariant?.value)
                          }
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.selectedVariant && (
                        <p className="text-[11px] font-medium text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded-md mt-1">
                          Option: {item.selectedVariant.label}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedVariant?.value
                            )
                          }
                          className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">
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
                          className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-brand-900">
                          {formatPKR(itemUnitPrice * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-slate-400">
                            {formatPKR(itemUnitPrice)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Summary & Actions (only if items in cart) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
            {/* Promo Code Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>
                      Coupon: <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. COCOFIRST)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase placeholder:normal-case focus:outline-none focus:border-brand-900"
                  />
                  <button
                    type="submit"
                    className="bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPKR(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({appliedCoupon.discountPercent}%)</span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingAmount === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPKR(shippingAmount)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-brand-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>

            {/* CTAs: WhatsApp Checkout & Standard Checkout */}
            <div className="space-y-2 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all group"
              >
                <MessageSquare className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
                <span>One-Click WhatsApp Order</span>
              </a>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Cash on Delivery available across all Pakistan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
