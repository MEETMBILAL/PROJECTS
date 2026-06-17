import { format } from "date-fns";

import { Badge } from "@/components/common/Badge";
import { StarRating } from "@/components/common/StarRating";
import type { Review } from "@/lib/api/reviews";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-bsborder pb-4 last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-primary">{review.user_name}</span>
          {review.is_verified_purchase && (
            <Badge variant="success">Verified Purchase</Badge>
          )}
        </div>
        <span className="text-xs text-text-muted">
          {format(new Date(review.created_at), "dd MMM yyyy")}
        </span>
      </div>
      <StarRating rating={review.rating} size={14} className="mt-1" />
      {review.title && (
        <h4 className="mt-2 font-medium text-text-primary">{review.title}</h4>
      )}
      {review.comment && <p className="mt-1 text-text-secondary">{review.comment}</p>}
    </div>
  );
}
