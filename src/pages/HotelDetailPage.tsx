import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { MapPin } from "lucide-react";
import NotFound from "./NotFound";
import HotelDetailSkeleton from "@/components/hotels/HotelDetailSkeleton";
import HotelContactInfo from "@/components/hotels/HotelContactInfo";
import HotelRatings from "@/components/hotels/HotelRatings";
import HotelFeedbackList from "@/components/hotels/HotelFeedbackList";
import type { Database } from "@/integrations/supabase/types";

type Hotel = Database['public']['Tables']['hotels']['Row'];

type Feedback = {
  id: string;
  name: string;
  ratings: Record<string, number>;
  comments: string;
  created_at: string;
};

const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        // Fetch hotel details
        const { data: hotelData, error: hotelError } = await supabase
          .from('hotels')
          .select("*")
          .eq("id", id)
          .single();

        if (hotelError) {
          if (hotelError.code === "PGRST116") {
            setNotFound(true);
          } else {
            throw hotelError;
          }
        }

        setHotel(hotelData || null);

        // Fetch feedback for this hotel
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('feedback')
          .select("id, name, ratings, comments, created_at")
          .eq("hotel_id", id)
          .order("created_at", { ascending: false });

        if (feedbackError) throw feedbackError;

        // Convert Json to proper Record<string, number> type for ratings
        const typedFeedback = feedbackData?.map(item => ({
          ...item,
          ratings: item.ratings as unknown as Record<string, number>
        })) || [];

        setFeedback(typedFeedback);
      } catch (error: any) {
        toast({
          title: "Error loading hotel details",
          description: error.message,
          variant: "destructive",
        });
        console.error("Error fetching hotel details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const calculateAverageRatings = () => {
    if (!feedback.length) return {};
    
    const categories = new Set<string>();
    let totals: Record<string, number> = {};
    let counts: Record<string, number> = {};
    
    // Collect all categories and totals
    feedback.forEach(item => {
      Object.entries(item.ratings).forEach(([category, rating]) => {
        categories.add(category);
        totals[category] = (totals[category] || 0) + rating;
        counts[category] = (counts[category] || 0) + 1;
      });
    });
    
    // Calculate averages
    const averages: Record<string, number> = {};
    categories.forEach(category => {
      averages[category] = Math.round((totals[category] / counts[category]) * 10) / 10;
    });
    
    return averages;
  };
  
  const averageRatings = calculateAverageRatings();

  if (notFound) {
    return <NotFound />;
  }

  return (
    <div className="container-custom section-padding fade-in">
      {loading ? (
        <HotelDetailSkeleton />
      ) : hotel ? (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <Link to="/hotels" className="text-hotel-navy hover:underline mb-4 inline-block">
              ← Back to Hotels
            </Link>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-hotel-navy mb-4">
              {hotel.name}
            </h1>
            <p className="flex items-center justify-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {hotel.location}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="rounded-lg overflow-hidden mb-6 shadow-md">
                <img
                  src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                  alt={hotel.name}
                  className="w-full h-80 object-cover"
                />
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">About {hotel.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{hotel.description}</p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities?.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <HotelContactInfo 
                location={hotel.location} 
                contactInfo={hotel.contact_info} 
              />

              <Link to={`/feedback?hotel=${hotel.id}`}>
                <Button className="w-full bg-hotel-navy hover:bg-hotel-navy/90">
                  Leave Feedback
                </Button>
              </Link>

              <HotelRatings averageRatings={averageRatings} />
            </div>
          </div>

          <HotelFeedbackList feedback={feedback} hotelId={hotel.id} />
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Hotel not found</h2>
          <p className="text-muted-foreground mb-6">
            The hotel you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/hotels">
            <Button>Return to Hotel Listings</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HotelDetailPage;
