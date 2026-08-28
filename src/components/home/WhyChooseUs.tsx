"use client";

import React from "react";
import {
  ShieldCheck,
  Truck,
  MessageSquare,
  HeartHandshake,
} from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "100% Pet-Safe Quality",
      description: "Every item, from nutritious pet food to dental chew toys, is veterinarian approved and free of toxic materials.",
    },
    {
      icon: Truck,
      title: "Nationwide Pakistan Delivery",
      description: "Swift same-day dispatch in Lahore with 24-48 hour express delivery to Karachi, Islamabad, Faisalabad and all cities.",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Order & Support",
      description: "Direct instant support for sizing questions, nutrition guidance, order placement, and live tracking.",
    },
    {
      icon: HeartHandshake,
      title: "7-Day Easy Exchange",
      description: "Wrong coat size or bed dimension? Easily exchange unworn items with hassle-free doorstep assistance.",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Our Promise To Pet Parents
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display mt-2">
            Why Pet Families Choose CoCo & Candy
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            We hold ourselves to the highest standards of safety, comfort, and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="p-6 sm:p-7 rounded-3xl bg-slate-50 hover:bg-brand-50 border border-slate-200/80 hover:border-brand-900/30 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-brand-900 mb-5">
                    <Icon className="w-6 h-6 text-brand-900" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug font-display">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
