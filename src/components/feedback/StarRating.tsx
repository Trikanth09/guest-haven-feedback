
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  categoryId: string;
  categoryName: string;
  selectedRating: number;
  onRatingChange: (categoryId: string, rating: number) => void;
}

const StarRating = ({ categoryId, categoryName, selectedRating, onRatingChange }: StarRatingProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{categoryName}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              className={`cursor-pointer ${
                selectedRating >= star
                  ? "text-hotel-gold fill-hotel-gold"
                  : "text-gray-300"
              }`}
              onClick={() => onRatingChange(categoryId, star)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarRating;
