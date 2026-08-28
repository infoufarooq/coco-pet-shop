import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  let orders = db.getOrders();

  if (status && status !== "all") {
    orders = orders.filter((o) => o.status === status);
  }
  if (q) {
    const query = q.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.customerPhone.includes(query) ||
        o.customerCity.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ success: true, count: orders.length, data: orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = orderSchema.safeParse(body);

    if (!parseResult.success) {
      logger.warn("Order creation validation failed", { errors: parseResult.error.flatten() });
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order data.",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;
    const newOrder = db.createOrder({
      customerName: validData.customerName,
      customerPhone: validData.customerPhone,
      customerWhatsApp: validData.customerWhatsApp || validData.customerPhone,
      customerEmail: validData.customerEmail || "",
      customerAddress: validData.customerAddress,
      customerCity: validData.customerCity,
      customerNotes: validData.customerNotes || "",
      paymentMethod: validData.paymentMethod,
      status: "pending",
      items: validData.items,
      subtotal: validData.subtotal,
      discount: validData.discount || 0,
      shipping: validData.shipping || 0,
      total: validData.total,
      couponCode: validData.couponCode || undefined,
    });

    logger.info("Order created successfully", { orderNumber: newOrder.orderNumber });
    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    logger.error("Order creation error", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order." },
      { status: 500 }
    );
  }
}