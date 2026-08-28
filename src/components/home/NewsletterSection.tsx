"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Send, Gift, ShieldCheck } from "lucide-react";

export function NewsletterSection() {
  const { showToast } = useCart();
  const [email, setEmail] = useState("");
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Invalid Email", "Please enter a valid email.", "warning");
      return;
    }
    setIsDone(true);
    showToast("Voucher Unlocked! 🎁", "Use coupon COCOFIRST for 15% off your first order!");
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-4xl bg-gradient-to-r from-brand-900 via-brand-800 to-amber-600 p-8 sm:p-12 text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300 mb-3">
              <Gift className="w-3.5 h-3.5" />
              <span>Instant VIP Pet Parent Club</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight leading-tight">
              Get 15% Off Your First Pet Order
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
              Join over 5,000+ Pakistani pet parents receiving special member discounts, seasonal arrivals, and pet care tips.
            </p>

            {isDone ? (
              <div className="mt-6 p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-200 text-xs font-bold">
                🎉 Welcome to the family! Your 15% coupon is <span className="text-white underline font-black">COCOFIRST</span>.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3 text-xs text-white placeholder-slate-300 focus:outline-none focus:bg-white/20 focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-3 px-6 rounded-full shadow transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
                >
                  <span>Claim 15% Off</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <p className="text-[10px] text-slate-300 mt-3 flex items-center justify-center sm:justify-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
