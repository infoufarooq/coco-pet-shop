import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviewSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;
    const reviews = db.getReviews(productId);
    return NextResponse.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    logger.error("Failed to fetch reviews", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = reviewSchema.safeParse(body);

    if (!parseResult.success) {
      logger.warn("Review submission validation failed", { errors: parseResult.error.flatten() });
      return NextResponse.json(
        {
          success: false,
          error: "Invalid review data.",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;
    const newReview = db.addReview({
      productId: validData.productId,
      authorName: validData.authorName,
      rating: validData.rating,
      title: validData.title,
      comment: validData.comment,
      isVerifiedPurchase: validData.isVerifiedPurchase ?? true,
      city: validData.city || undefined,
      petName: validData.petName || undefined,
    });

    logger.info("Review created successfully", {
      reviewId: newReview.id,
      productId: newReview.productId,
      rating: newReview.rating,
    });

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error: any) {
    logger.error("Review submission error", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review." },
      { status: 500 }
    );
  }
}
