"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatPKR } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  TicketPercent,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Real-Time Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-2">
            Store Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor sales, fulfillment pipelines, products, and discounts across Pakistan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh Stats</span>
          </button>

          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 font-display">
              {stats ? formatPKR(stats.totalRevenue) : "Loading..."}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
              ● All delivered & confirmed orders
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 font-display">
              {stats ? stats.totalOrders : "..."}
            </h3>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 block">
              {stats ? `${stats.pendingOrders} pending fulfillment` : ""}
            </span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Catalog
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 font-display">
              {stats ? stats.activeProducts : "..."}
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
              {stats ? `${stats.outOfStockProducts} out of stock` : ""}
            </span>
          </div>
        </div>

        {/* Active Discounts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Promo Vouchers
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TicketPercent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 font-display">
              {stats ? stats.totalCoupons : "..."}
            </h3>
            <span className="text-[11px] font-semibold text-rose-600 mt-1 block">
              Active discount codes
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders List Card */}
      <div className="bg-white rounded-4xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-slate-500">
              Real-time orders received from online checkout and WhatsApp
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-900 hover:underline"
          >
            <span>Manage All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 text-center py-8">Loading recent orders...</p>
        ) : stats?.recentOrders?.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono font-bold text-brand-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 font-bold text-slate-800">
                      {ord.customerName}
                    </td>
                    <td className="py-3 text-slate-500">{ord.customerCity}</td>
                    <td className="py-3 text-slate-600">
                      {ord.items.length} {ord.items.length === 1 ? "item" : "items"}
                    </td>
                    <td className="py-3 font-black text-slate-900">
                      {formatPKR(ord.total)}
                    </td>
                    <td className="py-3 uppercase text-[10px] font-bold text-slate-500">
                      {ord.paymentMethod}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === "delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : ord.status === "dispatched"
                            ? "bg-sky-50 text-sky-700"
                            : ord.status === "confirmed"
                            ? "bg-amber-50 text-amber-800"
                            : ord.status === "cancelled"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        ● {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}