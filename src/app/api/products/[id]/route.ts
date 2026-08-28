import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = db.getProductById(params.id);
  if (!product) {
    return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: product });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const updated = db.updateProduct(params.id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = db.deleteProduct(params.id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Product deleted successfully." });
}