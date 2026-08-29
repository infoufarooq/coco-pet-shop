"use client";

import React, { useState, useEffect, useMemo, useContext } from "react";
import { Review } from "@/types";
import { CartContext } from "@/context/CartContext";
import {
  Star,
  ShieldCheck,
  MapPin,
  Sparkles,
  Plus,
  X,
  MessageSquare,
  AlertCircle,
  Check,
} from "lucide-react";

export interface ProductReviewsProps {
  productId: string;
  productName?: string;
  initialRating?: number;
  initialReviewsCount?: number;
}

export function ProductReviews({
  productId,
  productName = "Product",
  initialRating = 5,
  initialReviewsCount = 0,
}: ProductReviewsProps) {
  const cartContext = useContext(CartContext);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [city, setCity] = useState("");
  const [petName, setPetName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch reviews on mount or when productId changes
  useEffect(() => {
    let isMounted = true;
    async function fetchReviews() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.data)) {
            setReviews(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Star ratings distribution and calculation
  const totalCount = reviews.length;
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return initialRating.toFixed(1);
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews, initialRating]);

  const starBreakdown = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });

    return [5, 4, 3, 2, 1].map((star) => {
      const count = counts[star] || 0;
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return { star, count, percentage };
    });
  }, [reviews, totalCount]);

  const handleRatingSelect = (selectedStar: number) => {
    setRating(selectedStar);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Client-side validations
    if (!authorName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!title.trim()) {
      setFormError("Please provide a review title.");
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setFormError("Please write a comment with at least 5 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        productId,
        authorName: authorName.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim(),
        city: city.trim() || undefined,
        petName: petName.trim() || undefined,
        isVerifiedPurchase: true,
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit review");
      }

      // Optimistic update
      const newReview: Review = json.data;
      setReviews((prev) => [newReview, ...prev]);

      // Reset form
      setAuthorName("");
      setCity("");
      setPetName("");
      setTitle("");
      setComment("");
      setRating(5);
      setIsFormOpen(false);

      if (cartContext?.showToast) {
        cartContext.showToast(
          "Review Submitted! ⭐",
          "Thank you for sharing your feedback with CoCo & Candy community!"
        );
      }
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8" data-testid="product-reviews-section">
      {/* Overview & Breakdown Summary Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Rating Score Summary */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-950 font-display tracking-tight" data-testid="average-rating">
                {averageRating}
              </span>
              <span className="text-lg font-bold text-slate-400">/ 5.0</span>
            </div>

            <div className="flex items-center gap-1 text-amber-400" aria-label={`Rating: ${averageRating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(Number(averageRating))
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-slate-500 font-medium pt-1" data-testid="reviews-count-text">
              Based on {totalCount || initialReviewsCount} verified customer {totalCount === 1 ? "review" : "reviews"}
            </p>

            <button
              type="button"
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="mt-4 inline-flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs sm:text-sm py-2.5 px-5 rounded-2xl shadow-md transition-all active:scale-95"
              data-testid="write-review-btn"
            >
              {isFormOpen ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Close Form</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Write a Review</span>
                </>
              )}
            </button>
          </div>

          {/* Star Distribution Breakdown Bars */}
          <div className="md:col-span-8 space-y-2.5" data-testid="rating-breakdown">
            {starBreakdown.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-14 text-slate-700 font-bold justify-end">
                  <span>{star}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 bg-slate-200/80 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                    data-testid={`breakdown-bar-${star}`}
                  />
                </div>

                <div className="w-16 text-right text-slate-500 font-medium text-[11px]">
                  <span className="font-bold text-slate-700">{percentage}%</span>
                  <span className="text-slate-400 ml-1">({count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Submission Form Drawer / Card */}
      {isFormOpen && (
        <form
          noValidate
          onSubmit={handleFormSubmit}
          className="bg-white border-2 border-brand-900/20 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 transition-all duration-300"
          data-testid="review-form"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-brand-900 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Customer Feedback</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                Write a Review for {productName}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              aria-label="Close review form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && (
            <div
              className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3 text-xs"
              data-testid="form-error"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Interactive Star Rating Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Your Overall Rating *
            </label>
            <div className="flex items-center gap-2" data-testid="star-selector">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingSelect(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    className="p-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-extrabold text-slate-700 ml-2">
                {hoverRating !== null ? hoverRating : rating} of 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="review-author"
                className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5"
              >
                Your Name *
              </label>
              <input
                id="review-author"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Ayesha Malik"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
                required
              />
            </div>

            <div>
              <label
                htmlFor="review-city"
                className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5"
              >
                City (Pakistan)
              </label>
              <input
                id="review-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore, Karachi, Islamabad"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="review-pet"
                className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5"
              >
                Pet&apos;s Name &amp; Breed (Optional)
              </label>
              <input
                id="review-pet"
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="e.g. Milo (Golden Retriever) or Luna (Persian)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>

            <div>
              <label
                htmlFor="review-title"
                className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5"
              >
                Review Headline / Title *
              </label>
              <input
                id="review-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Highly recommended for picky eaters!"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="review-comment"
              className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5"
            >
              Detailed Feedback *
            </label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other pet parents what you and your pet loved about this product..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-md transition-all flex items-center gap-2"
              data-testid="submit-review-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Verified Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Customer Reviews List */}
      <div className="space-y-4" data-testid="reviews-list">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-brand-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading verified customer reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-10 bg-slate-50 rounded-3xl border border-slate-200/80 text-center space-y-3">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-black text-slate-800">No customer reviews yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first to share your experience with {productName} to help fellow pet parents make the best choice.
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 bg-brand-900 text-white text-xs font-bold py-2 px-4 rounded-xl shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write the First Review</span>
            </button>
          </div>
        ) : (
          reviews.map((rev) => {
            const author = rev.authorName || rev.author || "Verified Pet Parent";
            const dateDisplay = rev.date || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "Recent");

            return (
              <div
                key={rev.id}
                className="p-5 sm:p-6 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs hover:border-slate-300 transition-all"
                data-testid={`review-card-${rev.id}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-slate-950 font-display">
                      {author}
                    </span>

                    {(rev.isVerifiedPurchase || rev.verifiedBuyer) && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200/50">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Buyer</span>
                      </span>
                    )}

                    {rev.city && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{rev.city}, PK</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400 text-xs">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {dateDisplay}
                    </span>
                  </div>
                </div>

                {rev.petName && (
                  <div className="text-[11px] font-bold text-amber-900 bg-amber-50/80 px-2.5 py-1 rounded-xl w-fit flex items-center gap-1.5">
                    <span>🐾</span>
                    <span>{rev.petName}</span>
                  </div>
                )}

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                    {rev.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
export default ProductReviews;
