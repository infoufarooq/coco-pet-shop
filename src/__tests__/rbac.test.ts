import { describe, it, expect } from "vitest";
import { ROLE_PERMISSIONS, SEED_STAFF_USERS, hasPermission } from "@/lib/auth-rbac";
import { UserRole, PermissionSet } from "@/types";

describe("RBAC Permissions Configuration", () => {
  it("grants full permissions to admin role", () => {
    const adminPerms = ROLE_PERMISSIONS.admin;
    expect(adminPerms.canViewDashboard).toBe(true);
    expect(adminPerms.canManageCatalog).toBe(true);
    expect(adminPerms.canUpdateStockAndPrice).toBe(true);
    expect(adminPerms.canAcceptOrders).toBe(true);
    expect(adminPerms.canPackOrders).toBe(true);
    expect(adminPerms.canDispatchOrders).toBe(true);
    expect(adminPerms.canSendWhatsAppConfirmation).toBe(true);
    expect(adminPerms.canManageCoupons).toBe(true);
    expect(adminPerms.canManageStaff).toBe(true);
  });

  it("grants catalog management permissions to catalog_manager but restricts order operations", () => {
    const catalogPerms = ROLE_PERMISSIONS.catalog_manager;
    expect(catalogPerms.canViewDashboard).toBe(true);
    expect(catalogPerms.canManageCatalog).toBe(true);
    expect(catalogPerms.canUpdateStockAndPrice).toBe(true);
    expect(catalogPerms.canManageCoupons).toBe(true);
    
    // Restricted operations
    expect(catalogPerms.canAcceptOrders).toBe(false);
    expect(catalogPerms.canPackOrders).toBe(false);
    expect(catalogPerms.canDispatchOrders).toBe(false);
    expect(catalogPerms.canSendWhatsAppConfirmation).toBe(false);
    expect(catalogPerms.canManageStaff).toBe(false);
  });

  it("grants order packing/fulfillment permissions to order_packer but restricts catalog and coupons", () => {
    const packerPerms = ROLE_PERMISSIONS.order_packer;
    expect(packerPerms.canViewDashboard).toBe(true);
    expect(packerPerms.canAcceptOrders).toBe(true);
    expect(packerPerms.canPackOrders).toBe(true);
    expect(packerPerms.canDispatchOrders).toBe(true);
    expect(packerPerms.canSendWhatsAppConfirmation).toBe(true);
    
    // Restricted operations
    expect(packerPerms.canManageCatalog).toBe(false);
    expect(packerPerms.canUpdateStockAndPrice).toBe(false);
    expect(packerPerms.canManageCoupons).toBe(false);
    expect(packerPerms.canManageStaff).toBe(false);
  });

  it("denies all administrative permissions to customer role", () => {
    const customerPerms = ROLE_PERMISSIONS.customer;
    const permissions = Object.values(customerPerms);
    expect(permissions.every((p) => p === false)).toBe(true);
  });

  it("contains seed staff profiles with valid roles and verified phones", () => {
    expect(SEED_STAFF_USERS.length).toBeGreaterThanOrEqual(3);

    const adminUser = SEED_STAFF_USERS.find((u) => u.role === "admin");
    expect(adminUser).toBeDefined();
    expect(adminUser?.email).toBe("admin@cocopetshop.pk");
    expect(adminUser?.isPhoneVerified).toBe(true);

    const catalogUser = SEED_STAFF_USERS.find((u) => u.role === "catalog_manager");
    expect(catalogUser).toBeDefined();
    expect(catalogUser?.isPhoneVerified).toBe(true);

    const packerUser = SEED_STAFF_USERS.find((u) => u.role === "order_packer");
    expect(packerUser).toBeDefined();
    expect(packerUser?.isPhoneVerified).toBe(true);
  });

  it("evaluates hasPermission helper accurately across roles", () => {
    expect(hasPermission("admin", "canManageStaff")).toBe(true);
    expect(hasPermission("catalog_manager", "canManageCatalog")).toBe(true);
    expect(hasPermission("catalog_manager", "canAcceptOrders")).toBe(false);
    expect(hasPermission("order_packer", "canPackOrders")).toBe(true);
    expect(hasPermission("order_packer", "canManageCatalog")).toBe(false);
    expect(hasPermission("customer", "canViewDashboard")).toBe(false);
  });
});
