import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.code) {
      return NextResponse.json({ success: false, message: "Please provide a coupon code." }, { status: 400 });
    }

    const subtotal = Number(body.subtotal) || 0;
    const result = db.validateCoupon(body.code, subtotal);

    if (!result.isValid) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        coupon: result.coupon,
        discountAmount: result.discountAmount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}