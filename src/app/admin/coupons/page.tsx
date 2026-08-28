"use client";

import React, { useState, useEffect } from "react";
import { formatPKR } from "@/lib/utils";
import {
  TicketPercent,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountPercent: "15",
    description: "",
    minSpend: "2000",
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountPercent) return;

    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: formData.code.toUpperCase().trim(),
        discountPercent: Number(formData.discountPercent),
        description: formData.description || `${formData.discountPercent}% OFF storewide`,
        minSpend: formData.minSpend ? Number(formData.minSpend) : undefined,
        isActive: formData.isActive,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setIsModalOpen(false);
      setFormData({
        code: "",
        discountPercent: "15",
        description: "",
        minSpend: "2000",
        isActive: true,
      });
      fetchCoupons();
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`Delete coupon code ${code}?`)) return;
    await fetch(`/api/coupons?code=${code}`, { method: "DELETE" });
    fetchCoupons();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Discounts & Promo Vouchers
          </h1>
          <p className="text-xs text-slate-500">
            Create promotional discount codes and manage checkout vouchers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <p className="text-xs text-slate-400 col-span-full py-12 text-center">
            Loading discounts...
          </p>
        ) : coupons.length === 0 ? (
          <p className="text-xs text-slate-400 col-span-full py-12 text-center">
            No promo codes found.
          </p>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-black text-base text-brand-900 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200">
                    {coupon.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      coupon.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {coupon.isActive ? "● Active" : "● Inactive"}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-2xl font-black text-slate-900 font-display">
                    {coupon.discountPercent}% OFF
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    {coupon.description || "Valid on all store products"}
                  </p>
                </div>

                {coupon.minSpend && (
                  <p className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg mt-2.5 inline-block">
                    Min Spend: {formatPKR(coupon.minSpend)}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-400 text-[11px]">Storewide Voucher</span>
                <button
                  onClick={() => handleDeleteCoupon(coupon.code)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Voucher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 z-10 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Create Discount Coupon
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EIDSALE25"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs uppercase text-slate-900 focus:outline-none focus:border-brand-900 font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Discount (%) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={90}
                    value={formData.discountPercent}
                    onChange={(e) =>
                      setFormData({ ...formData, discountPercent: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Min Order (PKR)
                  </label>
                  <input
                    type="number"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                    placeholder="2000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Special 15% discount for pet lovers"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-brand-900 hover:bg-brand-800 text-white rounded-xl shadow"
                >
                  Create Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}