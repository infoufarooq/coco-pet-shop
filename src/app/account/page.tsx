"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPKR, buildWhatsAppInquiryUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Package,
  ShieldCheck,
  Edit2,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, signOut, updateProfile } = useAuth();
  const { wishlist } = useCart();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");

  const [editName, setEditName] = useState("");
  const [editPetName, setEditPetName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/account/login");
      return;
    }

    setEditName(user.name);
    setEditPetName(user.petName || "");
    setEditCity(user.city || "Lahore");
    setEditAddress(user.address || "");

    // Fetch user orders
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?q=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: editName,
      petName: editPetName,
      city: editCity,
      address: editAddress,
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "My Account" }]} />

        {/* Profile Banner */}
        <div className="bg-white rounded-4xl border border-slate-200/80 p-6 sm:p-8 shadow-sm my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  Salam, {user.name}!
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  VIP Club Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {user.email} • Pet: <strong className="text-amber-800">{user.petName || "Pet Companion"}</strong> ({user.petType || "Dog"})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/wishlist"
              className="flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-bold py-2.5 px-4 rounded-xl border border-rose-200"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-600" />
              <span>Wishlist ({wishlist.length})</span>
            </Link>

            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pb-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-brand-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            My Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "profile"
                ? "bg-brand-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Pet & Profile Details
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-4xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Your Order History
            </h2>

            {loadingOrders ? (
              <p className="text-xs text-slate-400 py-8 text-center">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 space-y-3 max-w-sm mx-auto">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Past Orders Found</h3>
                <p className="text-xs text-slate-500">
                  Ready to pamper your pet? Discover our curated accessories and nutrition catalog.
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-brand-900 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow"
                >
                  Shop Best Sellers
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 rounded-3xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-brand-900">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            ord.status === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : ord.status === "dispatched"
                              ? "bg-sky-100 text-sky-800"
                              : ord.status === "confirmed"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          ● {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(ord.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" })} • {ord.items.length} items
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        {formatPKR(ord.total)}
                      </span>
                      <Link
                        href={`/track-order`}
                        className="bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-sm"
                      >
                        Track Status
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-4xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-2xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Edit Profile & Default Delivery Address
              </h2>
              <p className="text-xs text-slate-500">
                Update your details to speed up future checkouts.
              </p>
            </div>

            {savedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Pet&apos;s Name
                  </label>
                  <input
                    type="text"
                    value={editPetName}
                    onChange={(e) => setEditPetName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Default Street Address
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="House / Street / Area..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs py-3 px-6 rounded-2xl shadow transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}