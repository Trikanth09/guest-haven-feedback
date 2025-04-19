
import { useState, useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Hotel = Database['public']['Tables']['hotels']['Row'];

const HotelsPage = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleHotels, setVisibleHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        // Add caching header to prevent unnecessary refetches
        const { data, error } = await supabase
          .from('hotels')
          .select("id, name, description, location, images")
          .limit(9); // Limit initial fetch for better performance

        if (error) {
          throw error;
        }

        // Making sure we have the correct type for hotels
        const typedData = data as Hotel[];
        setHotels(typedData || []);
        
        // Show initial batch immediately for faster perceived loading
        setVisibleHotels(typedData?.slice(0, 3) || []);
        
        // Show the rest after a short delay
        setTimeout(() => {
          setVisibleHotels(typedData || []);
          setLoading(false);
        }, 100);
      } catch (error: any) {
        toast({
          title: "Error loading hotels",
          description: error.message,
          variant: "destructive",
        });
        console.error("Error fetching hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels();
    
    // Prefetch images to improve load time
    return () => {
      // Cleanup any image prefetching if needed
    };
  }, []);

  // Memoize hotel card creation for better performance
  const renderHotelCard = (hotel: Hotel) => (
    <Card key={hotel.id} className="overflow-hidden h-full flex flex-col transition-all hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img
          src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy" // Add lazy loading for images
        />
      </div>
      <CardHeader>
        <CardTitle className="font-playfair text-xl">{hotel.name}</CardTitle>
        <CardDescription>{hotel.location}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{hotel.description}</p>
      </CardContent>
      <CardFooter className="space-x-2">
        <Link to={`/hotels/${hotel.id}`} className="flex-1">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
        <Link to={`/feedback?hotel=${hotel.id}`} className="flex-1">
          <Button className="w-full bg-hotel-navy hover:bg-hotel-navy/90">Leave Feedback</Button>
        </Link>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container-custom section-padding fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-hotel-navy mb-4">
            Our Partner Hotels
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Discover our collection of partner hotels committed to providing exceptional hospitality. 
            Browse through the options below and share your valuable feedback.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden h-[350px]">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleHotels.map(renderHotelCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;
