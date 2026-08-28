"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ChevronDown, HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
import { buildWhatsAppInquiryUrl } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
  category: "Ordering & Delivery" | "Products & Sizing" | "Payments & Returns";
}

const FAQS: FAQItem[] = [
  {
    category: "Ordering & Delivery",
    q: "How long does delivery take across Pakistan?",
    a: "Orders in Lahore are typically delivered within 24 hours. For Karachi, Islamabad, Faisalabad, Rawalpindi, and other nationwide cities, delivery takes 2 to 4 working days via reputable couriers.",
  },
  {
    category: "Ordering & Delivery",
    q: "What are the shipping charges?",
    a: "We offer FREE nationwide shipping on all orders over Rs. 3,500. For orders under Rs. 3,500, a flat standard delivery rate of Rs. 250 applies across Pakistan.",
  },
  {
    category: "Ordering & Delivery",
    q: "Can I place an order directly through WhatsApp?",
    a: "Yes! You can add items to your cart and tap 'Order via WhatsApp' to send a prefilled cart breakdown directly to our support team, or message us with the product photos.",
  },
  {
    category: "Payments & Returns",
    q: "Do you offer Cash on Delivery (COD)?",
    a: "Yes, Cash on Delivery is available across all major cities and towns throughout Pakistan. You pay the courier in cash when your parcel arrives at your doorstep.",
  },
  {
    category: "Payments & Returns",
    q: "What is your return & exchange policy?",
    a: "We offer a 7-day hassle-free exchange policy for unused, unwashed items with tags attached (such as dog sweaters, harnesses, or wrong size pet beds).",
  },
  {
    category: "Products & Sizing",
    q: "How do I choose the correct apparel or bed size for my dog or cat?",
    a: "Please measure your pet's back length (base of neck to base of tail) and chest girth. Detailed size recommendations are listed on each product page, or send us your pet's breed and weight on WhatsApp for personalized advice!",
  },
  {
    category: "Products & Sizing",
    q: "Are the pet toys and foods safe and authentic?",
    a: "Absolutely. All pet food products are 100% genuine and verified with long expiry dates. Our toys and accessories are crafted from non-toxic, pet-safe materials.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "FAQs & Policies" }]} />

        <div className="my-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display mt-2">
              How Can We Help You?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find instant answers to common questions regarding delivery, sizing, and payments in Pakistan.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-slate-900 hover:text-brand-900 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-display pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-brand-900" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in-50">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* WhatsApp Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-4xl bg-brand-900 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold font-display">Still have a question?</h3>
              <p className="text-xs text-slate-300 mt-1">
                Our pet care representatives are available on WhatsApp to assist you directly.
              </p>
            </div>
            <a
              href={buildWhatsAppInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-3 px-6 rounded-full shadow transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
