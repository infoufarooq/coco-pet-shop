"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole, PermissionSet } from "@/types";
import { ROLE_PERMISSIONS, SEED_STAFF_USERS } from "@/lib/auth-rbac";
import { WhatsAppOTP } from "@/lib/whatsapp-otp";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  role: UserRole;
  permissions: PermissionSet;
  hasPermission: (permission: keyof PermissionSet) => boolean;
  switchRole: (role: UserRole) => void;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    petName?: string;
    petType?: "dog" | "cat" | "both" | "other";
    city?: string;
    address?: string;
    otpCode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  requestWhatsAppOtp: (phone: string) => { code: string; directStoreLink: string };
  verifyWhatsAppOtp: (phone: string, code: string) => { isValid: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default guest or customer permissions
  const currentRole: UserRole = user?.role || "customer";
  const permissions: PermissionSet = ROLE_PERMISSIONS[currentRole];

  const hasPermission = (permission: keyof PermissionSet): boolean => {
    return Boolean(permissions[permission]);
  };

  // Load active session from localStorage or Supabase
  useEffect(() => {
    const loadSession = async () => {
      try {
        const saved = localStorage.getItem("coco_user_session");
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
        } else {
          // Default start as Admin for quick testing of all CMS features
          const defaultStaff = SEED_STAFF_USERS[0];
          setUser(defaultStaff);
          localStorage.setItem("coco_user_session", JSON.stringify(defaultStaff));
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Role Switcher for Testing (Admin, Catalog Manager, Packer, Customer)
  const switchRole = (newRole: UserRole) => {
    if (newRole === "customer") {
      const customerProfile: UserProfile = {
        id: "cust-demo",
        name: "Ayesha Malik",
        email: "ayesha.malik@gmail.com",
        phone: "03457913191",
        role: "customer",
        isPhoneVerified: true,
        whatsappVerifiedAt: new Date().toISOString(),
        petName: "Simba",
        petType: "cat",
        city: "Lahore",
        address: "DHA Phase 5",
        createdAt: new Date().toISOString(),
      };
      setUser(customerProfile);
      localStorage.setItem("coco_user_session", JSON.stringify(customerProfile));
    } else {
      const staff = SEED_STAFF_USERS.find((s) => s.role === newRole) || SEED_STAFF_USERS[0];
      setUser(staff);
      localStorage.setItem("coco_user_session", JSON.stringify(staff));
    }
  };

  const requestWhatsAppOtp = (phone: string) => {
    return WhatsAppOTP.generateOtp(phone);
  };

  const verifyWhatsAppOtp = (phone: string, code: string) => {
    return WhatsAppOTP.verifyOtp(phone, code);
  };

  const signIn = async (email: string, password?: string) => {
    try {
      const cleanEmail = email.toLowerCase().trim();

      // Check if staff user
      const staffUser = SEED_STAFF_USERS.find((s) => s.email.toLowerCase() === cleanEmail);
      if (staffUser) {
        setUser(staffUser);
        localStorage.setItem("coco_user_session", JSON.stringify(staffUser));
        return { success: true };
      }

      // Customer account
      const customerProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0].replace(/[._]/g, " "),
        email: cleanEmail,
        phone: "03457913191",
        role: "customer",
        isPhoneVerified: true,
        whatsappVerifiedAt: new Date().toISOString(),
        petName: "Leo",
        petType: "dog",
        city: "Lahore",
        address: "Gulberg III",
        createdAt: new Date().toISOString(),
      };

      setUser(customerProfile);
      localStorage.setItem("coco_user_session", JSON.stringify(customerProfile));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to sign in." };
    }
  };

  const signUp = async (data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    petName?: string;
    petType?: "dog" | "cat" | "both" | "other";
    city?: string;
    address?: string;
    otpCode?: string;
  }) => {
    try {
      // If OTP provided, verify it
      if (data.otpCode) {
        const otpCheck = WhatsAppOTP.verifyOtp(data.phone, data.otpCode);
        if (!otpCheck.isValid) {
          return { success: false, error: otpCheck.message };
        }
      }

      const newProfile: UserProfile = {
        id: `cust-${Date.now()}`,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        role: "customer",
        isPhoneVerified: true,
        whatsappVerifiedAt: new Date().toISOString(),
        petName: data.petName || "Buddy",
        petType: data.petType || "dog",
        city: data.city || "Lahore",
        address: data.address || "",
        createdAt: new Date().toISOString(),
      };

      setUser(newProfile);
      localStorage.setItem("coco_user_session", JSON.stringify(newProfile));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed." };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("coco_user_session");
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("coco_user_session", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        role: currentRole,
        permissions,
        hasPermission,
        switchRole,
        signIn,
        signUp,
        signOut,
        updateProfile,
        requestWhatsAppOtp,
        verifyWhatsAppOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}