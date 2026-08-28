"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { VERIFIED_STORE_INFO, buildWhatsAppInquiryUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function ContactPage() {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
    message: "",
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Missing Fields", "Please complete all required fields.", "warning");
      return;
    }
    setIsSent(true);
    showToast("Message Sent! 🐾", "Thank you! Our support team will get back to you shortly.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "Order Inquiry",
      message: "",
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Contact Us" }]} />

        <div className="my-6">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Get In Touch
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display mt-2">
              We&apos;d Love to Hear from You & Your Pets
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Have questions about bed sizing, food ingredients, or need order tracking? Contact us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-4xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 font-display mb-6">
                Send Us a Message
              </h2>

              {isSent ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-900 font-display">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    We have received your message and will respond via email (<strong>{VERIFIED_STORE_INFO.email}</strong>) or WhatsApp (<strong>{VERIFIED_STORE_INFO.phone}</strong>) within a few hours.
                  </p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="mt-2 text-xs font-bold text-emerald-900 underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Bilal Ahmed"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@domain.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0345 7913191"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900 cursor-pointer"
                      >
                        <option value="Order Inquiry">Order Status & Delivery</option>
                        <option value="Product Sizing">Product Size Recommendation</option>
                        <option value="Exchange">Return / Sizing Exchange</option>
                        <option value="Wholesale">Wholesale & Veterinary Inquiries</option>
                        <option value="Other">Other Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist you and your pet today?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs py-3.5 px-8 rounded-full shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Store Information & Direct WhatsApp Box */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct WhatsApp Callout */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-4xl p-6 sm:p-8 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base font-display">Instant WhatsApp Support</h3>
                    <p className="text-xs text-emerald-100">Live chat with pet care specialists</p>
                  </div>
                </div>

                <p className="text-xs text-emerald-100 leading-relaxed">
                  For fastest response on product recommendations, size checks, and instant order placement:
                </p>

                <a
                  href={buildWhatsAppInquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs py-3.5 px-4 rounded-2xl shadow transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Open WhatsApp Chat ({VERIFIED_STORE_INFO.phone})</span>
                </a>
              </div>

              {/* Verified Location & Hours Card */}
              <div className="bg-white rounded-4xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4 text-xs sm:text-sm">
                <h3 className="text-base font-bold text-slate-900 font-display pb-3 border-b border-slate-100">
                  Verified Contact Details
                </h3>

                <div className="space-y-3 text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Fulfillment Hub:</strong>
                      <span>{VERIFIED_STORE_INFO.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Phone & WhatsApp:</strong>
                      <span>{VERIFIED_STORE_INFO.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Email:</strong>
                      <span>{VERIFIED_STORE_INFO.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Support Hours:</strong>
                      <span>{VERIFIED_STORE_INFO.businessHours}</span>
                    </div>
                  </div>
                </div>

                {/* Facebook Link */}
                <div className="pt-3 border-t border-slate-100">
                  <a
                    href={VERIFIED_STORE_INFO.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#1877F2] hover:underline"
                  >
                    <span>Follow us on Facebook (@cocopets)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}