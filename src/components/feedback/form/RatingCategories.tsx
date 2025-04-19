
import { FormLabel } from "@/components/ui/form";
import StarRating from "../StarRating";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FeedbackFormSchema } from "../types/feedbackTypes";

type RatingCategoriesProps = {
  form: UseFormReturn<z.infer<typeof FeedbackFormSchema>>;
  selectedRatings: Record<string, number>;
  handleStarClick: (categoryId: string, rating: number) => void;
};

const categories = [
  { id: "cleanliness", name: "Cleanliness" },
  { id: "staff", name: "Staff Service" },
  { id: "amenities", name: "Amenities" },
  { id: "comfort", name: "Room Comfort" },
  { id: "food", name: "Food & Beverage" },
  { id: "value", name: "Value for Money" },
];

const RatingCategories = ({ selectedRatings, handleStarClick }: RatingCategoriesProps) => {
  return (
    <div className="space-y-4">
      <FormLabel>Ratings</FormLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map((category) => (
          <StarRating
            key={category.id}
            categoryId={category.id}
            categoryName={category.name}
            selectedRating={selectedRatings[category.id] || 0}
            onRatingChange={handleStarClick}
          />
        ))}
      </div>
    </div>
  );
};

export default RatingCategories;
