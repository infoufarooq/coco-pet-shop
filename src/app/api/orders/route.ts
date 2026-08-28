import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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
    if (!body.customerName || !body.customerPhone || !body.customerAddress || !body.items?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required order information." },
        { status: 400 }
      );
    }

    const newOrder = db.createOrder({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerWhatsApp: body.customerWhatsApp || body.customerPhone,
      customerEmail: body.customerEmail || "",
      customerAddress: body.customerAddress,
      customerCity: body.customerCity || "Lahore",
      customerNotes: body.customerNotes || "",
      paymentMethod: body.paymentMethod || "cod",
      status: "pending",
      items: body.items,
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      shipping: Number(body.shipping) || 0,
      total: Number(body.total) || 0,
      couponCode: body.couponCode || undefined,
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order." },
      { status: 500 }
    );
  }
}