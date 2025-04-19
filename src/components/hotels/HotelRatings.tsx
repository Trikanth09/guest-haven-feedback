
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star } from "lucide-react";

type HotelRatingsProps = {
  averageRatings: Record<string, number>;
};

const HotelRatings = ({ averageRatings }: HotelRatingsProps) => {
  if (Object.keys(averageRatings).length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Guest Ratings</CardTitle>
        <CardDescription>Average ratings from our guests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(averageRatings).map(([category, rating]) => (
            <div key={category} className="flex justify-between items-center">
              <span className="capitalize">{category.replace('_', ' ')}</span>
              <div className="flex items-center">
                <span className="mr-2 font-medium">{rating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        rating >= star
                          ? "text-hotel-gold fill-hotel-gold"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelRatings;
