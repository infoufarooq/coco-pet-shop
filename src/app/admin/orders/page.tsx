"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatPKR, VERIFIED_STORE_INFO } from "@/lib/utils";
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
  Boxes,
  CheckSquare,
  Square,
  FileText,
  Printer,
} from "lucide-react";

export default function AdminOrdersPage() {
  const { user, role, hasPermission } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Local state for item packing checklist
  const [packingProgress, setPackingProgress] = useState<Record<string, Record<string, boolean>>>({});

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

  // Order Taker: Accept incoming order
  const handleAcceptOrder = async (orderId: string) => {
    await handleUpdateStatus(orderId, "confirmed");
  };

  // Order Packer: Toggle packed status of individual item
  const handleToggleItemPacked = (orderId: string, itemIdx: number) => {
    setPackingProgress((prev) => {
      const orderItems = prev[orderId] || {};
      return {
        ...prev,
        [orderId]: {
          ...orderItems,
          [itemIdx]: !orderItems[itemIdx],
        },
      };
    });
  };

  // Order Packer: Mark whole order as packed and ready to ship
  const handleMarkAsPacked = async (orderId: string) => {
    await handleUpdateStatus(orderId, "dispatched");
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Role: {role.replace("_", " ")}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display mt-1">
            Order Taking, Packing & Fulfillment
          </h1>
          <p className="text-xs text-slate-500">
            Accept incoming orders, verify item packing checklist, dispatch parcels & trigger customer WhatsApp notifications.
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
            { label: "Pending (New Orders)", value: "pending" },
            { label: "Confirmed (Packing Queue)", value: "confirmed" },
            { label: "Dispatched (In Transit)", value: "dispatched" },
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
            placeholder="Search by order ID, customer name, phone (0345...), or city..."
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
            <p className="text-xs text-slate-500 font-bold">No orders found in this view.</p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            const orderPackedItems = packingProgress[ord.id] || {};
            const totalItemsCount = ord.items.length;
            const packedItemsCount = ord.items.filter((_: any, idx: number) => orderPackedItems[idx]).length;
            const allItemsPacked = packedItemsCount === totalItemsCount;

            // Customer WhatsApp Notification message generator
            const whatsappText = encodeURIComponent(
              `Salam ${ord.customerName}! 🐾\n\n*CoCo & Candy Order Update*\nOrder Tracking ID: *${ord.orderNumber}*\nStatus: *${ord.status.toUpperCase()}*\nItems: ${ord.items.length} item(s)\nTotal Payable: Rs. ${ord.total.toLocaleString()} (COD)\nDelivery Destination: ${ord.customerCity}, Pakistan\n\nYour parcel is packed with love by our fulfillment team. Tracking link: https://cocopetshop.pk/track-order\n\nHelpline: ${VERIFIED_STORE_INFO.phone}`
            );

            const customerWhatsAppLink = `https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, "")}?text=${whatsappText}`;

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
              >
                {/* Header Row */}
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
                      <Boxes className="w-5 h-5" />
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
                        Placed on {new Date(ord.createdAt).toLocaleString("en-PK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-900">{ord.customerName}</p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{ord.customerPhone} ({ord.customerCity})</span>
                    </p>
                  </div>

                  {/* Action Pipeline for Order Taker & Packer */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Accept Order Button (for pending orders) */}
                    {ord.status === "pending" && (
                      <button
                        onClick={() => handleAcceptOrder(ord.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Order</span>
                      </button>
                    )}

                    {/* Mark as Packed (for confirmed orders) */}
                    {ord.status === "confirmed" && (
                      <button
                        onClick={() => handleMarkAsPacked(ord.id)}
                        className="bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch Parcel</span>
                      </button>
                    )}

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
                      <option value="confirmed">Confirmed / Packing</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <Link
                      href={`/orders/${ord.orderNumber}/invoice`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-200 transition-colors"
                      title="View / Print Tax Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </Link>

                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50"
                      title="View Packing Checklist & Customer Info"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? "rotate-180 text-brand-900" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Item Checklist & Packing Slip */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 space-y-5 text-xs animate-in fade-in-50">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Left: Item Packing Checklist */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Boxes className="w-4 h-4 text-brand-900" />
                            <span>Packing Checklist ({packedItemsCount}/{totalItemsCount} Verified)</span>
                          </h4>
                          <span className="text-[11px] font-bold text-amber-800">
                            {allItemsPacked ? "✓ All Items Packed" : "Tick items as you pack"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {ord.items.map((item: any, idx: number) => {
                            const isItemPacked = Boolean(orderPackedItems[idx]);
                            return (
                              <div
                                key={idx}
                                onClick={() => handleToggleItemPacked(ord.id, idx)}
                                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                                  isItemPacked
                                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                                    : "bg-white border-slate-200 text-slate-900 hover:border-slate-300"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-slate-600">
                                    {isItemPacked ? (
                                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                      <Square className="w-5 h-5 text-slate-300" />
                                    )}
                                  </div>
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                                  />
                                  <div>
                                    <h5 className={`font-bold text-xs ${isItemPacked ? "line-through opacity-70" : ""}`}>
                                      {item.productName}
                                    </h5>
                                    <span className="text-[11px] text-slate-500">
                                      Qty: <strong className="text-slate-900">{item.quantity}</strong> {item.variantLabel ? `• ${item.variantLabel}` : ""}
                                    </span>
                                  </div>
                                </div>

                                <span className="font-bold text-xs">
                                  {formatPKR(item.price * item.quantity)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Customer WhatsApp Dispatch & Delivery Details */}
                      <div className="md:col-span-5 space-y-4">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                          Customer & Shipping Dispatch
                        </h4>

                        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5 text-slate-700">
                          <p>
                            <strong className="text-slate-900">Name:</strong> {ord.customerName}
                          </p>
                          <p>
                            <strong className="text-slate-900">Phone / WA:</strong> {ord.customerPhone}
                          </p>
                          <p>
                            <strong className="text-slate-900">Address:</strong> {ord.customerAddress}, {ord.customerCity}
                          </p>
                          {ord.customerNotes && (
                            <p className="text-amber-900 bg-amber-50 p-2 rounded-xl text-[11px]">
                              <strong>Note:</strong> {ord.customerNotes}
                            </p>
                          )}
                        </div>

                        {/* WhatsApp Order Confirmation Link & Invoice Link */}
                        <div className="space-y-2">
                          <Link
                            href={`/orders/${ord.orderNumber}/invoice`}
                            target="_blank"
                            className="w-full flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                            <span>View / Print Official Tax Invoice (A4)</span>
                          </Link>

                          <a
                            href={customerWhatsAppLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-colors"
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-100" />
                            <span>Send WhatsApp Confirmation to Customer</span>
                          </a>

                          <p className="text-[10px] text-center text-slate-400">
                            Sends tracking ID & dispatch notice to {ord.customerPhone}
                          </p>
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