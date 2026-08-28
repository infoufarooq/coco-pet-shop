import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const coupons = db.getCoupons();
  return NextResponse.json({ success: true, count: coupons.length, data: coupons });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.code || !body.discountPercent) {
      return NextResponse.json(
        { success: false, error: "Coupon code and discount percent are required." },
        { status: 400 }
      );
    }

    const newCoupon = db.addCoupon({
      code: body.code,
      discountPercent: Number(body.discountPercent),
      description: body.description || `${body.discountPercent}% off storewide`,
      minSpend: body.minSpend ? Number(body.minSpend) : undefined,
      isActive: body.isActive !== false,
      expiresAt: body.expiresAt || undefined,
    });

    return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });
  } catch (error: any) {
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