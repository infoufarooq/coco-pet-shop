"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatPKR, buildWhatsAppInquiryUrl } from "@/lib/utils";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Sparkles, Clock, ArrowRight, MessageSquare, ShieldCheck, Check } from "lucide-react";

export function FlashSaleSection() {
  const { showToast } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 42,
    seconds: 19,
  });

  const [copiedCoupon, setCopiedCoupon] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("COCOFIRST");
    setCopiedCoupon(true);
    showToast("Coupon Copied! 📋", "Code 'COCOFIRST' copied to clipboard. Paste at checkout.");
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const dealProduct = PRODUCTS.find((p) => p.id === "prod-4") || PRODUCTS[0];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Deal Info */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deal of the Week</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display">
              Flat 15% OFF On All Premium Beds & Winter Apparel
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Give your pet the royal sleep they deserve. Our orthopedic memory foam beds and cozy thermal jackets are on special seasonal discount across Pakistan.
            </p>

            {/* Countdown Timer Boxes */}
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center justify-center lg:justify-start gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Offer Expires In:</span>
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-4 font-display">
                <div className="bg-brand-950/90 border border-brand-700/80 px-3.5 py-2.5 rounded-2xl text-center min-w-[60px] sm:min-w-[70px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 block">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Days</span>
                </div>
                <span className="text-amber-400 font-black text-xl">:</span>
                <div className="bg-brand-950/90 border border-brand-700/80 px-3.5 py-2.5 rounded-2xl text-center min-w-[60px] sm:min-w-[70px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 block">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Hours</span>
                </div>
                <span className="text-amber-400 font-black text-xl">:</span>
                <div className="bg-brand-950/90 border border-brand-700/80 px-3.5 py-2.5 rounded-2xl text-center min-w-[60px] sm:min-w-[70px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 block">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Mins</span>
                </div>
                <span className="text-amber-400 font-black text-xl">:</span>
                <div className="bg-brand-950/90 border border-brand-700/80 px-3.5 py-2.5 rounded-2xl text-center min-w-[60px] sm:min-w-[70px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 block">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Secs</span>
                </div>
              </div>
            </div>

            {/* Coupon Click to Copy Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <div
                onClick={handleCopyCode}
                className="cursor-pointer bg-white/10 hover:bg-white/15 border border-dashed border-amber-400/70 rounded-2xl px-4 py-2.5 flex items-center gap-3 transition-colors"
                title="Click to copy coupon code"
              >
                <div>
                  <span className="text-[10px] text-slate-300 block font-medium">Click to Copy Code:</span>
                  <span className="text-sm font-black text-amber-400 tracking-wider">COCOFIRST</span>
                </div>
                <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg">
                  {copiedCoupon ? "Copied! ✓" : "Copy"}
                </span>
              </div>

              <Link
                href="/shop?onSale=true"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>Shop Deals Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Product Highlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/20">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img
                  src={dealProduct.images[0]}
                  alt={dealProduct.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  -{dealProduct.discountPercent}% OFF
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  {dealProduct.category}
                </span>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-1 font-display">
                  {dealProduct.name}
                </h3>

                <div className="flex items-baseline gap-2.5">
                  <span className="text-xl font-black text-brand-900">
                    {formatPKR(dealProduct.price)}
                  </span>
                  {dealProduct.originalPrice && (
                    <span className="text-xs font-semibold text-slate-400 line-through">
                      {formatPKR(dealProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <Link
                    href={`/shop/${dealProduct.id}`}
                    className="flex-1 bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl text-center transition-colors shadow"
                  >
                    View Product Details
                  </Link>
                  <a
                    href={buildWhatsAppInquiryUrl(dealProduct.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-colors flex items-center justify-center shadow"
                    title="Order via WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
