
import { Star } from "lucide-react";
import { memo } from "react";

interface StarRatingProps {
  categoryId: string;
  categoryName: string;
  selectedRating: number;
  onRatingChange: (categoryId: string, rating: number) => void;
}

// Use memo to prevent unnecessary re-renders
const StarRating = memo(({ categoryId, categoryName, selectedRating, onRatingChange }: StarRatingProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{categoryName}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              className={`cursor-pointer transition-colors ${
                selectedRating >= star
                  ? "text-hotel-gold fill-hotel-gold"
                  : "text-gray-300 hover:text-gray-400"
              }`}
              onClick={() => onRatingChange(categoryId, star)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

StarRating.displayName = 'StarRating';

export default StarRating;
