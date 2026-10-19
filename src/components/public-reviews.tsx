import "server-only";
import { Star } from "lucide-react";
import { readPublicReviews } from "@/lib/feedback-store";

export function PublicReviews() {
  const reviews = readPublicReviews();
  if (!reviews.length) return null;
  return <section className="public-reviews page" aria-labelledby="student-reviews-title"><h2 id="student-reviews-title">From PrepAtlas students</h2><div className="public-review-grid">{reviews.map((review,index) => <article key={index} className="public-review"><div className="public-review-stars" aria-label={`${review.rating} of 5 stars`}>{[1,2,3,4,5].map(value => <Star key={value} size={16} aria-hidden="true" fill={value <= review.rating ? "currentColor" : "none"} />)}</div>{review.text && <p>{review.text}</p>}<span className="small muted">PrepAtlas student</span></article>)}</div></section>;
}
