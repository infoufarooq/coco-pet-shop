"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPKR, buildWhatsAppInquiryUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/${query.trim()}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setOrder(null);
      }
    } catch (err) {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { key: "pending", label: "Order Placed", desc: "Received & queued for processing" },
    { key: "confirmed", label: "Confirmed", desc: "Packed & verified at Lahore hub" },
    { key: "dispatched", label: "Dispatched", desc: "Handed over to courier partner" },
    { key: "delivered", label: "Delivered", desc: "Safely received at your doorstep" },
  ];

  const getStageIndex = (status: string) => {
    if (status === "delivered") return 3;
    if (status === "dispatched") return 2;
    if (status === "confirmed") return 1;
    return 0; // pending
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Track Your Order" }]} />

        <div className="my-6 space-y-8">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Live Order Status
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display mt-2">
              Track Your Pet Accessories Order
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your Order Number (e.g. <strong className="text-slate-800">COCO-PK-74512</strong>) or registered phone number to check delivery progress.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="bg-white rounded-4xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="Order ID (e.g. COCO-PK-74512) or Phone #"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 uppercase placeholder:normal-case focus:outline-none focus:bg-white focus:border-brand-900"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-900 hover:bg-brand-800 disabled:bg-slate-400 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-2xl shadow transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? "Searching..." : "Track Parcel"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Order Details Output */}
          {searched && !loading && (
            <div>
              {order ? (
                <div className="bg-white rounded-4xl border border-slate-200/80 p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in-50">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Order Reference
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-brand-900 font-display">
                        {order.orderNumber}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-PK", { dateStyle: "long" })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === "delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "dispatched"
                            ? "bg-sky-50 text-sky-700"
                            : order.status === "confirmed"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        ● {order.status}
                      </span>
                      <p className="text-xs font-black text-slate-900 mt-1">
                        Total: {formatPKR(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Milestone Tracker */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">
                      Delivery Timeline
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                      {stages.map((stage, idx) => {
                        const currentStageIdx = getStageIndex(order.status);
                        const isCompleted = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div
                            key={stage.key}
                            className={`p-4 rounded-2xl border transition-all ${
                              isCurrent
                                ? "bg-brand-50 border-brand-900 shadow-sm"
                                : isCompleted
                                ? "bg-emerald-50/60 border-emerald-200"
                                : "bg-slate-50 border-slate-200 opacity-60"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isCompleted
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-200 text-slate-600"
                                }`}
                              >
                                {isCompleted ? "✓" : idx + 1}
                              </span>
                              <span className="font-bold text-xs text-slate-900">
                                {stage.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              {stage.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items Ordered List */}
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Items in Parcel ({order.items.length})
                    </h4>
                    <div className="space-y-2.5">
                      {order.items.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                          <img
                            src={item.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-xs text-slate-900 truncate">
                              {item.productName}
                            </h5>
                            <span className="text-[11px] text-slate-500">
                              Quantity: {item.quantity} {item.variantLabel ? `• ${item.variantLabel}` : ""}
                            </span>
                          </div>
                          <span className="font-bold text-xs text-slate-900">
                            {formatPKR(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destination & WhatsApp Help */}
                  <div className="p-4 bg-slate-50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="text-slate-500">
                        Delivery Destination: <strong className="text-slate-800">{order.customerCity}, Pakistan</strong>
                      </p>
                    </div>

                    <a
                      href={buildWhatsAppInquiryUrl(order.orderNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:underline"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Have a question? Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-4xl border border-slate-200/80 p-10 text-center space-y-3 max-w-lg mx-auto">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">
                    No Order Found for &ldquo;{query}&rdquo;
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Please double-check your Order ID (e.g. COCO-PK-74512) or the phone number provided at checkout.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}