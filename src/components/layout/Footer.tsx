"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { VERIFIED_STORE_INFO, buildWhatsAppInquiryUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Send,
  ExternalLink,
  Lock,
} from "lucide-react";

export function Footer() {
  const { showToast } = useCart();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Invalid Email", "Please provide a valid email address.", "warning");
      return;
    }
    setIsSubscribed(true);
    showToast("Subscribed! 🎉", "You've been subscribed! Use code COCOFIRST for 15% off.");
    setEmail("");
  };

  return (
    <footer className="bg-brand-900 text-slate-200 border-t border-brand-800 pt-12 sm:pt-16 pb-8">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-3xl bg-brand-800/60 border border-brand-700/60 backdrop-blur">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Nationwide Delivery</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Fast dispatch to Lahore, Karachi, Islamabad & across all of Pakistan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Pet-Safe Quality</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Carefully tested nutrition, durable non-toxic toys & cozy comfort accessories.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-400/10 text-sky-400 border border-sky-400/20 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">WhatsApp Quick Orders</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Order directly or get instant product guidance from pet lovers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-400/10 text-rose-400 border border-rose-400/20 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Hassle-Free Exchanges</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                7-day return & sizing exchange for unwashed/unused gear.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-brand-800">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md">
              🐾
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-display">
                CoCo <span className="text-amber-400">&</span> Candy
              </span>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Pet Accessories Shop
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            Pakistan&apos;s beloved destination for premium pet supplies, ergonomic beds, nutritious foods, chic apparel, and interactive toys designed to pamper your furry family members.
          </p>

          <div className="pt-2 space-y-2 text-xs">
            <div className="flex items-start gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{VERIFIED_STORE_INFO.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{VERIFIED_STORE_INFO.businessHours}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{VERIFIED_STORE_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{VERIFIED_STORE_INFO.email}</span>
            </div>
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
            Categories
          </h4>
          <ul className="space-y-2 text-xs">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="text-slate-300 hover:text-amber-300 transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/shop?onSale=true"
                className="text-amber-300 hover:text-amber-200 font-bold transition-colors"
              >
                Special Flash Deals
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care & Policies */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
            Customer Care
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/about" className="text-slate-300 hover:text-amber-300 transition-colors">
                Our Story & Values
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-300 hover:text-amber-300 transition-colors">
                Contact & Store Location
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-slate-300 hover:text-amber-300 transition-colors">
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link href="/policies/shipping" className="text-slate-300 hover:text-amber-300 transition-colors">
                Delivery Information (PK)
              </Link>
            </li>
            <li>
              <Link href="/policies/returns" className="text-slate-300 hover:text-amber-300 transition-colors">
                Returns & Exchange Policy
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy" className="text-slate-300 hover:text-amber-300 transition-colors">
                Privacy & Data Terms
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & WhatsApp CTA */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
            Get 15% Off
          </h4>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Subscribe for exclusive VIP pet perks, seasonal discounts & nutrition tips.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full bg-brand-950/80 border border-brand-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Subscribe & Save</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-brand-800">
            <a
              href={buildWhatsAppInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Need help? WhatsApp Us Now</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Payment Badges & Brand Reference Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span>© {new Date().getFullYear()} {VERIFIED_STORE_INFO.name}. All rights reserved.</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-400">
            Built with verified store identity & brand references.
          </span>
        </div>

        {/* Payment & Security Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="bg-brand-950 border border-brand-800 px-2.5 py-1 rounded-lg text-[10px] text-slate-300 font-medium flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-400" /> Cash on Delivery (COD)
          </span>
          <span className="bg-brand-950 border border-brand-800 px-2.5 py-1 rounded-lg text-[10px] text-slate-300 font-medium">
            Direct Bank Transfer
          </span>
          <span className="bg-brand-950 border border-brand-800 px-2.5 py-1 rounded-lg text-[10px] text-emerald-400 font-medium">
            WhatsApp Order
          </span>
        </div>
      </div>
    </footer>
  );
}
