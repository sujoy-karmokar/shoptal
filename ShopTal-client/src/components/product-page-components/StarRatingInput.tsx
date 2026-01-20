"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingInputProps {
  initialRating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
}

export function StarRatingInput({
  initialRating,
  onRatingChange,
  size = 7,
}: StarRatingInputProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(initialRating);

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    onRatingChange(rating);
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-${size} w-${size} cursor-pointer transition-colors ${
            (hoveredRating || selectedRating) > i
              ? "text-primary"
              : "text-muted-foreground/30"
          }`}
          fill="currentColor"
          onMouseEnter={() => setHoveredRating(i + 1)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => handleStarClick(i + 1)}
        />
      ))}
    </div>
  );
}
