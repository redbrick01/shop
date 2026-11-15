interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const rounded = Math.round(rating);
  const starSize = size === "sm" ? "text-sm" : "text-lg";

  return (
    <span className={`inline-flex items-center gap-0.5 text-amber-500 ${starSize}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rounded ? "★" : "☆"}</span>
      ))}
      <span className="ml-1 text-slate-500 text-xs">{rating.toFixed(1)}</span>
    </span>
  );
}
