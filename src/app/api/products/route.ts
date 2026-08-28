import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

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
    const parseResult = productSchema.safeParse(body);

    if (!parseResult.success) {
      logger.warn("Product creation validation failed", { errors: parseResult.error.flatten() });
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product data.",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;
    const newProduct = db.addProduct({
      name: validData.name,
      slug: validData.slug || validData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: validData.description,
      price: validData.price,
      originalPrice: validData.originalPrice,
      discountPercent: validData.discountPercent,
      category: validData.category,
      categorySlug: validData.categorySlug || validData.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      petType: validData.petType,
      images: validData.images,
      rating: validData.rating || 5.0,
      reviewsCount: validData.reviewsCount || 0,
      inStock: validData.inStock,
      stockQuantity: validData.stockQuantity,
      isBestSeller: Boolean(validData.isBestSeller),
      isOnSale: Boolean(validData.isOnSale),
      features: validData.features?.length ? validData.features : ["100% Pet Safe", "Guaranteed Quality"],
      sku: validData.sku || `CC-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    logger.info("Product created successfully", { productId: newProduct.id, name: newProduct.name });
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    logger.error("Product creation error", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product." },
      { status: 500 }
    );
  }
}