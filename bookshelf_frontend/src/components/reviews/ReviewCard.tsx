import { BadgeCheck } from "lucide-react";

import { StarRating } from "@/components/common/StarRating";
import { formatDate, getInitials } from "@/lib/utils";
import type { Review } from "@/types/book";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-bsborder py-5 last:border-0">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-semibold text-primary">
          {getInitials(review.user_name)}
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
            {review.user_name}
            {review.is_verified_purchase && (
              <span className="inline-flex items-center gap-0.5 text-xs font-normal text-success">
                <BadgeCheck size={14} /> Verified
              </span>
            )}
          </p>
          <p className="text-xs text-text-muted">{formatDate(review.created_at)}</p>
        </div>
      </div>
      <StarRating rating={review.rating} size={14} className="mt-3" />
      {review.title && (
        <p className="mt-2 font-medium text-text-primary">{review.title}</p>
      )}
      <p className="mt-1 text-sm text-text-secondary">{review.comment}</p>
    </div>
  );
}
