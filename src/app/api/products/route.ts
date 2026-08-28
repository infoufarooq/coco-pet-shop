import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const petType = searchParams.get("petType");

  let products = db.getProducts();

  if (category && category !== "all") {
    products = products.filter((p) => p.categorySlug === category);
  }
  if (petType && petType !== "all") {
    products = products.filter((p) => p.petType === petType || p.petType === "all");
  }

  return NextResponse.json({ success: true, count: products.length, data: products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: "Product name, price, and category are required." },
        { status: 400 }
      );
    }

    const newProduct = db.addProduct({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: body.description || "",
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      discountPercent: body.discountPercent ? Number(body.discountPercent) : undefined,
      category: body.category,
      categorySlug: body.categorySlug || body.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      petType: body.petType || "all",
      images: body.images && body.images.length ? body.images : [
        "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
      ],
      rating: body.rating || 5.0,
      reviewsCount: body.reviewsCount || 1,
      inStock: body.inStock !== false,
      isBestSeller: Boolean(body.isBestSeller),
      isOnSale: Boolean(body.isOnSale),
      features: body.features || ["100% Pet Safe", "Guaranteed Quality"],
      sku: body.sku || `CC-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product." },
      { status: 500 }
    );
  }
}