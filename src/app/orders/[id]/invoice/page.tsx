"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OrderRecord } from "@/types";
import { formatPKR, VERIFIED_STORE_INFO } from "@/lib/utils";
import {
  Printer,
  ArrowLeft,
  FileText,
} from "lucide-react";

interface InvoicePageProps {
  params: {
    id: string;
  };
}

export default function OrderInvoicePage({ params }: InvoicePageProps) {
  const orderId = params?.id;
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          setError(data.error || "Order invoice not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load order invoice.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-brand-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Generating Official Tax Invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-display">Invoice Not Found</h2>
          <p className="text-xs text-slate-500">
            {error || `Unable to find invoice records for Order #${orderId}. Please check the order tracking ID.`}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/track-order"
              className="bg-brand-900 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow"
            >
              Track Order
            </Link>
            <Link
              href="/"
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold py-2.5 px-5 rounded-xl"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const paymentLabel =
    order.paymentMethod === "cod"
      ? "Cash on Delivery (COD)"
      : order.paymentMethod === "bank_transfer"
      ? "Direct Bank Transfer / IBFT"
      : "WhatsApp Confirmation";

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-slate-100 min-h-screen py-6 sm:py-10 print:py-0 print:bg-white print:min-h-0">
      {/* Top Action Bar - Hidden in Print */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6 print:hidden">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/track-order`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-900 bg-slate-50 hover:bg-slate-100 py-2 px-3 rounded-xl border border-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Track Order</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 hidden sm:inline"
            >
              Home
            </Link>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              data-testid="print-invoice-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-white text-xs font-extrabold py-2.5 px-5 rounded-xl shadow transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* A4 Invoice Document Container */}
      <main
        data-testid="invoice-document"
        className="max-w-4xl mx-auto bg-white border border-slate-200 print:border-none shadow-xl print:shadow-none rounded-3xl print:rounded-none p-6 sm:p-12 print:p-0 text-slate-900 print:text-black font-sans leading-relaxed"
      >
        {/* Header: Company Details & Invoice Metadata */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900 print:border-black">
          {/* Company Info */}
          <div className="space-y-1.5 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black font-display tracking-tight text-brand-900 print:text-black">
                CoCo &amp; Candy Pet Accessories (Pvt) Ltd.
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 print:text-slate-800">
              Premium Pet Supplies &amp; Boutique Accessories Pakistan
            </p>
            <div className="text-[11px] text-slate-600 print:text-slate-800 space-y-0.5 pt-1">
              <p className="font-bold text-slate-900 print:text-black">
                NTN: <span className="font-mono">8492018-7</span> (Active Sales Tax Registered)
              </p>
              <p>Fulfillment Hub: DHA Phase 6 Lahore, Punjab, Pakistan</p>
              <p>
                Customer Helpline: <strong className="text-slate-900 print:text-black">0345-7913191</strong> |{" "}
                {VERIFIED_STORE_INFO.email}
              </p>
              <p>Website: {VERIFIED_STORE_INFO.pakistanStoreUrl}</p>
            </div>
          </div>

          {/* Invoice Badge & Number */}
          <div className="text-left sm:text-right space-y-2 sm:self-start">
            <div className="inline-block bg-brand-900 print:bg-black text-white px-3.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
              Official Tax Invoice
            </div>
            <div className="space-y-1 text-xs">
              <p>
                <span className="text-slate-500 print:text-slate-700">Invoice / Order #: </span>
                <strong className="font-mono text-sm text-brand-900 print:text-black">
                  {order.orderNumber}
                </strong>
              </p>
              <p>
                <span className="text-slate-500 print:text-slate-700">Order Date: </span>
                <strong className="text-slate-900 print:text-black">{orderDate}</strong>
              </p>
              <p>
                <span className="text-slate-500 print:text-slate-700">Payment: </span>
                <strong className="text-slate-900 print:text-black">{paymentLabel}</strong>
              </p>
              <p>
                <span className="text-slate-500 print:text-slate-700">Status: </span>
                <span className="inline-block uppercase font-bold text-[10px] bg-slate-100 print:bg-slate-200 px-2 py-0.5 rounded text-slate-800 print:text-black">
                  {order.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 sm:p-5 bg-slate-50 print:bg-slate-100 rounded-2xl print:rounded-lg border border-slate-200/80 print:border-slate-300 text-xs">
          <div>
            <h3 className="font-black uppercase tracking-wider text-slate-900 print:text-black text-[11px] mb-2 border-b border-slate-200 pb-1">
              Billed &amp; Shipped To:
            </h3>
            <div className="space-y-1 text-slate-700 print:text-slate-900">
              <p className="font-bold text-slate-900 print:text-black text-sm">
                {order.customerName}
              </p>
              <p className="leading-snug">
                {order.customerAddress}
              </p>
              <p className="font-semibold">
                {order.customerCity}, Pakistan
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-black uppercase tracking-wider text-slate-900 print:text-black text-[11px] mb-2 border-b border-slate-200 pb-1">
              Contact &amp; Delivery Instructions:
            </h3>
            <div className="space-y-1 text-slate-700 print:text-slate-900">
              <p>
                <span className="text-slate-500 font-medium">Primary Phone:</span>{" "}
                <strong className="text-slate-900 print:text-black">{order.customerPhone}</strong>
              </p>
              {order.customerWhatsApp && (
                <p>
                  <span className="text-slate-500 font-medium">WhatsApp:</span>{" "}
                  <strong>{order.customerWhatsApp}</strong>
                </p>
              )}
              {order.customerEmail && (
                <p>
                  <span className="text-slate-500 font-medium">Email:</span> {order.customerEmail}
                </p>
              )}
              {order.customerNotes && (
                <p className="text-[11px] text-amber-900 bg-amber-50 print:bg-slate-200 p-1.5 rounded mt-1">
                  <strong>Notes:</strong> {order.customerNotes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Itemized Table of Purchased Products */}
        <div className="my-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 print:border-black bg-slate-100 print:bg-slate-200 text-slate-900 print:text-black font-black uppercase text-[11px]">
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3">Item Description &amp; Specifications</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-center w-16">Qty</th>
                <th className="py-2.5 px-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 print:divide-slate-300">
              {order.items.map((item, idx) => {
                const lineTotal = item.price * item.quantity;
                return (
                  <tr key={idx} className="hover:bg-slate-50 print:hover:bg-transparent">
                    <td className="py-3 px-3 text-center font-bold text-slate-500 print:text-slate-700">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 print:text-black">
                        {item.productName}
                      </p>
                      {item.variantLabel && (
                        <p className="text-[11px] text-slate-500 print:text-slate-700">
                          Variant: {item.variantLabel}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 print:text-slate-600 font-mono">
                        SKU ID: {item.productId}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-800 print:text-black">
                      {formatPKR(item.price)}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 print:text-black">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 print:text-black">
                      {formatPKR(lineTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200 print:border-slate-300">
          {/* Left notes / payment terms */}
          <div className="max-w-xs space-y-2 text-[11px] text-slate-600 print:text-slate-800">
            <p className="font-bold text-slate-900 print:text-black uppercase tracking-wider text-[10px]">
              Payment &amp; Delivery Terms:
            </p>
            <p>
              • Mode: <strong>{paymentLabel}</strong>
            </p>
            <p>• All prices include applicable Pakistani Sales Tax (NTN: 8492018-7).</p>
            <p>• For support or inquiries, please contact our Lahore helpline at 0345-7913191.</p>
          </div>

          {/* Right Totals Box */}
          <div className="w-full sm:w-72 space-y-2 text-xs bg-slate-50 print:bg-slate-100 p-4 rounded-2xl print:rounded-lg border border-slate-200/80 print:border-slate-300">
            <div className="flex justify-between text-slate-700 print:text-slate-900">
              <span>Subtotal:</span>
              <span className="font-bold">{formatPKR(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 print:text-black font-medium">
                <span>Coupon Discount ({order.couponCode || "PROMO"}):</span>
                <span>-{formatPKR(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-700 print:text-slate-900">
              <span>Shipping Fee (Pakistan):</span>
              <span className="font-bold">
                {order.shipping === 0 ? "FREE (PKR 0)" : formatPKR(order.shipping)}
              </span>
            </div>

            <div className="flex justify-between text-base font-black text-brand-900 print:text-black pt-2 border-t border-slate-300">
              <span>Grand Total:</span>
              <span>{formatPKR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Pakistani Tax Compliance Disclaimer & Computer Receipt Signature Block */}
        <div className="mt-8 pt-6 border-t-2 border-slate-200 print:border-slate-400 space-y-4">
          <div className="bg-slate-50 print:bg-transparent p-3.5 rounded-xl border border-slate-200/60 print:border-none text-[11px] text-slate-500 print:text-slate-700 text-center sm:text-left leading-relaxed">
            <p className="font-bold text-slate-800 print:text-black uppercase text-[10px] tracking-wider mb-0.5">
              Tax &amp; Legal Disclaimer
            </p>
            <p>
              This is an official computer-generated Tax Invoice issued by CoCo &amp; Candy Pet Accessories (Pvt) Ltd. under Pakistani law (NTN: 8492018-7, DHA Phase 6 Lahore, Helpline: 0345-7913191). Goods once sold can be exchanged within 7 days in original unused packaging. No physical signature or rubber stamp is required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 pt-2 text-xs">
            <div className="text-[10px] text-slate-400 print:text-slate-600 font-mono">
              <p>Fulfillment Station: Lahore Hub (DHA Phase 6)</p>
              <p>Printed: {new Date().toLocaleString("en-PK")}</p>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="w-48 border-b border-slate-400 print:border-black mx-auto sm:ml-auto mb-1" />
              <p className="font-bold text-slate-900 print:text-black text-xs">
                Authorized Signatory
              </p>
              <p className="text-[10px] text-slate-500 print:text-slate-700">
                CoCo &amp; Candy Pet Accessories (Pvt) Ltd.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
