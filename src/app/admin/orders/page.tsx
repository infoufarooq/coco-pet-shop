"use client";

import React, { useState, useEffect } from "react";
import { formatPKR } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  MessageSquare,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  ChevronDown,
  User,
  MapPin,
  Phone,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchCity = o.customerCity.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Customer Orders & Fulfillment
          </h1>
          <p className="text-xs text-slate-500">
            View orders, update delivery milestones, and send tracking messages.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-200 shadow-sm transition-colors self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All Orders", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Dispatched", value: "dispatched" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.value
                  ? "bg-brand-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-brand-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-bold">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            const whatsappText = encodeURIComponent(
              `Salam ${ord.customerName}! Your CoCo & Candy order (${ord.orderNumber}) status has been updated to: *${ord.status.toUpperCase()}*. Total Amount: Rs. ${ord.total.toLocaleString()}. Thank you for shopping with us! 🐾`
            );
            const customerWhatsAppLink = `https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=${whatsappText}`;

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
              >
                {/* Header Row */}
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                      📦
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-brand-900">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(ord.createdAt).toLocaleString("en-PK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info Snippet */}
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-900">{ord.customerName}</p>
                    <p className="text-slate-500">
                      {ord.customerCity} • {ord.customerPhone}
                    </p>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-sm sm:text-base font-black text-slate-900 block">
                        {formatPKR(ord.total)}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        {ord.paymentMethod}
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50"
                      title="View Details"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? "rotate-180 text-brand-900" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Item Details */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 space-y-4 text-xs animate-in fade-in-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Items */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                          Ordered Items ({ord.items.length})
                        </h4>
                        <div className="space-y-2">
                          {ord.items.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200"
                            >
                              <img
                                src={item.image}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 truncate">
                                  {item.productName}
                                </p>
                                <span className="text-[10px] text-slate-500">
                                  Qty: {item.quantity} {item.variantLabel ? `• ${item.variantLabel}` : ""}
                                </span>
                              </div>
                              <span className="font-bold text-slate-900">
                                {formatPKR(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer & Delivery Address */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                          Delivery & Customer Information
                        </h4>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-slate-700">
                          <p>
                            <strong>Address:</strong> {ord.customerAddress},{" "}
                            {ord.customerCity}
                          </p>
                          <p>
                            <strong>Phone / WhatsApp:</strong> {ord.customerPhone}
                          </p>
                          {ord.customerEmail && (
                            <p>
                              <strong>Email:</strong> {ord.customerEmail}
                            </p>
                          )}
                          {ord.customerNotes && (
                            <p className="text-amber-800 bg-amber-50 p-2 rounded-lg">
                              <strong>Delivery Notes:</strong> {ord.customerNotes}
                            </p>
                          )}
                        </div>

                        {/* Direct WhatsApp update */}
                        <div className="pt-2">
                          <a
                            href={customerWhatsAppLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Notify Customer on WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}