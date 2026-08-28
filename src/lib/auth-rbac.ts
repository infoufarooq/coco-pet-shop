import { UserRole, PermissionSet, UserProfile } from "@/types";

export const ROLE_PERMISSIONS: Record<UserRole, PermissionSet> = {
  admin: {
    canViewDashboard: true,
    canManageCatalog: true,
    canUpdateStockAndPrice: true,
    canAcceptOrders: true,
    canPackOrders: true,
    canDispatchOrders: true,
    canSendWhatsAppConfirmation: true,
    canManageCoupons: true,
    canManageStaff: true,
  },
  catalog_manager: {
    canViewDashboard: true,
    canManageCatalog: true,
    canUpdateStockAndPrice: true,
    canAcceptOrders: false,
    canPackOrders: false,
    canDispatchOrders: false,
    canSendWhatsAppConfirmation: false,
    canManageCoupons: true,
    canManageStaff: false,
  },
  order_packer: {
    canViewDashboard: true,
    canManageCatalog: false,
    canUpdateStockAndPrice: false,
    canAcceptOrders: true,
    canPackOrders: true,
    canDispatchOrders: true,
    canSendWhatsAppConfirmation: true,
    canManageCoupons: false,
    canManageStaff: false,
  },
  customer: {
    canViewDashboard: false,
    canManageCatalog: false,
    canUpdateStockAndPrice: false,
    canAcceptOrders: false,
    canPackOrders: false,
    canDispatchOrders: false,
    canSendWhatsAppConfirmation: false,
    canManageCoupons: false,
    canManageStaff: false,
  },
};

export const SEED_STAFF_USERS: UserProfile[] = [
  {
    id: "staff-1",
    name: "Umar Farooq (Admin)",
    email: "admin@cocopetshop.pk",
    phone: "03457913191",
    role: "admin",
    isPhoneVerified: true,
    whatsappVerifiedAt: new Date().toISOString(),
    city: "Lahore",
    createdAt: new Date().toISOString(),
  },
  {
    id: "staff-2",
    name: "Hassan Ali (Catalog Lead)",
    email: "catalog@cocopetshop.pk",
    phone: "03457913191",
    role: "catalog_manager",
    isPhoneVerified: true,
    city: "Lahore",
    createdAt: new Date().toISOString(),
  },
  {
    id: "staff-3",
    name: "Bilal Tariq (Order Taker & Packer)",
    email: "packer@cocopetshop.pk",
    phone: "03457913191",
    role: "order_packer",
    isPhoneVerified: true,
    createdAt: new Date().toISOString(),
  },
];

export function hasPermission(role: UserRole, permission: keyof PermissionSet): boolean {
  return Boolean(ROLE_PERMISSIONS[role]?.[permission]);
}