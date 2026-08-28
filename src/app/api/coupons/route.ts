import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { couponSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

export async function GET() {
  const coupons = db.getCoupons();
  return NextResponse.json({ success: true, count: coupons.length, data: coupons });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = couponSchema.safeParse(body);

    if (!parseResult.success) {
      logger.warn("Coupon creation validation failed", { errors: parseResult.error.flatten() });
      return NextResponse.json(
        {
          success: false,
          error: "Invalid coupon data.",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;
    const newCoupon = db.addCoupon({
      code: validData.code,
      discountPercent: validData.discountPercent,
      description: validData.description || `${validData.discountPercent}% off storewide`,
      minSpend: validData.minSpend || 0,
      isActive: validData.isActive !== false,
      expiresAt: validData.expiresAt || undefined,
    });

    logger.info("Coupon created successfully", { code: newCoupon.code, discountPercent: newCoupon.discountPercent });
    return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });
  } catch (error: any) {
    logger.error("Coupon creation error", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json({ success: false, error: "Coupon code required." }, { status: 400 });
  }
  const deleted = db.deleteCoupon(code);
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Coupon not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Coupon deleted." });
}