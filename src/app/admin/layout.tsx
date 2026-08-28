"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TicketPercent,
  ExternalLink,
  Store,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Boxes,
  Truck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, role, switchRole, hasPermission } = useAuth();

  const allNavItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      permission: "canViewDashboard" as const,
    },
    {
      label: "Products Catalog",
      href: "/admin/products",
      icon: Package,
      permission: "canManageCatalog" as const,
    },
    {
      label: "Order Taking & Packing",
      href: "/admin/orders",
      icon: ShoppingBag,
      permission: "canAcceptOrders" as const,
    },
    {
      label: "Discounts & Coupons",
      href: "/admin/coupons",
      icon: TicketPercent,
      permission: "canManageCoupons" as const,
    },
  ];

  const allowedNavItems = allNavItems.filter((item) =>
    hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-white flex flex-col justify-between p-5 border-r border-slate-800">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
              🐾
            </div>
            <div>
              <h2 className="font-extrabold text-sm font-display tracking-tight text-white">
                CoCo & Candy CMS
              </h2>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> RBAC Staff Portal
              </span>
            </div>
          </div>

          {/* Active User Role Badge */}
          <div className="mt-4 p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Current Role:</span>
              <span className="font-bold text-amber-400 uppercase font-mono text-[10px] bg-amber-400/10 px-2 py-0.5 rounded-md">
                {role.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate">{user?.name || "Staff Member"}</p>
          </div>

          {/* Role Switcher for Testing (Admin, Catalog Manager, Order Packer) */}
          <div className="mt-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Switch Staff Role (Testing):
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => switchRole("admin")}
                className={`py-1 rounded-lg transition-colors ${
                  role === "admin"
                    ? "bg-brand-900 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Super Admin"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => switchRole("catalog_manager")}
                className={`py-1 rounded-lg transition-colors ${
                  role === "catalog_manager"
                    ? "bg-brand-900 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Catalog Specialist"
              >
                Catalog
              </button>
              <button
                type="button"
                onClick={() => switchRole("order_packer")}
                className={`py-1 rounded-lg transition-colors ${
                  role === "order_packer"
                    ? "bg-brand-900 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Order Taker & Packer"
              >
                Packer
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-brand-900 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : ""}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Live Storefront Link */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors border border-slate-800"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              <span>Live Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <p className="text-[10px] text-slate-500 text-center">
            CoCo & Candy • Pakistan
          </p>
        </div>
      </aside>

      {/* Main Stage */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}