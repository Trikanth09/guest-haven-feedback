import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { MapPin, Phone, Star, Mail } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NotFound from "./NotFound";
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

        setFeedback(feedbackData || []);
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
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-80 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-60 w-full mb-4" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
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
              {/* Hotel Image */}
              <div className="rounded-lg overflow-hidden mb-6 shadow-md">
                <img
                  src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                  alt={hotel.name}
                  className="w-full h-80 object-cover"
                />
              </div>

              {/* Hotel Description */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">About {hotel.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{hotel.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
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
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-hotel-navy mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">{hotel.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-hotel-navy mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{hotel.contact_info}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-hotel-navy mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">Please contact via email</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Leave Feedback Button */}
              <Link to={`/feedback?hotel=${hotel.id}`}>
                <Button className="w-full bg-hotel-navy hover:bg-hotel-navy/90">
                  Leave Feedback
                </Button>
              </Link>

              {/* Rating Overview */}
              {Object.keys(averageRatings).length > 0 && (
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
              )}
            </div>
          </div>

          {/* Guest Feedback Section */}
          <div className="mt-8">
            <h2 className="font-playfair text-2xl font-bold text-hotel-navy mb-6">Guest Feedback</h2>
            
            {feedback.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground text-center mb-4">
                    No feedback has been submitted for this hotel yet.
                  </p>
                  <Link to={`/feedback?hotel=${hotel.id}`}>
                    <Button className="bg-hotel-navy hover:bg-hotel-navy/90">
                      Be the first to leave feedback
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {feedback.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="font-playfair">{item.name}</CardTitle>
                          <CardDescription>
                            {new Date(item.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </CardDescription>
                        </div>
                        <div className="flex">
                          {Object.values(item.ratings).length > 0 && (
                            <div className="flex items-center">
                              <span className="mr-2 font-medium">
                                {(Object.values(item.ratings).reduce((a, b) => a + b, 0) / 
                                  Object.values(item.ratings).length).toFixed(1)}
                              </span>
                              <Star className="h-5 w-5 text-hotel-gold fill-hotel-gold" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Ratings Table */}
                      {Object.keys(item.ratings).length > 0 && (
                        <div className="mb-4 overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Rating</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Object.entries(item.ratings).map(([category, rating]) => (
                                <TableRow key={category}>
                                  <TableCell className="capitalize">
                                    {category.replace('_', ' ')}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end">
                                      <span className="mr-2">{rating}</span>
                                      <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            size={14}
                                            className={`${
                                              rating >= star
                                                ? "text-hotel-gold fill-hotel-gold"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                      
                      {/* Comments */}
                      <p className="text-muted-foreground">{item.comments}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
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
