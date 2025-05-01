
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { FeedbackFormSchema } from "./types/feedbackTypes";
import UserInfoFields from "./form/UserInfoFields";
import HotelSelect from "./form/HotelSelect";
import RatingCategories from "./form/RatingCategories";
import { z } from "zod";

interface FeedbackFormProps {
  hotelIdParam: string | null;
  onFeedbackSubmitted: () => void;
}

const FeedbackForm = ({ hotelIdParam, onFeedbackSubmitted }: FeedbackFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotels, setHotels] = useState<{ id: string; name: string; }[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FeedbackFormSchema>>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues: {
      name: user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : "",
      email: user?.email || "",
      roomNumber: "",
      stayDate: "",
      hotelId: hotelIdParam || "",
      ratings: {},
      comments: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('name', user.user_metadata?.first_name ? 
        `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : 
        form.getValues().name);
      form.setValue('email', user.email || form.getValues().email);
    }
  }, [user, form]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select("id, name");

        if (error) throw error;
        setHotels(data || []);
      } catch (error: any) {
        toast({
          title: "Error loading hotels",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchHotels();
  }, [toast]);

  const handleStarClick = (categoryId: string, rating: number) => {
    setSelectedRatings((prev) => ({
      ...prev,
      [categoryId]: rating,
    }));
    
    form.setValue("ratings", {
      ...form.getValues().ratings,
      [categoryId]: rating,
    });
  };

  const onSubmit = async (data: z.infer<typeof FeedbackFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        name: data.name,
        email: data.email,
        room_number: data.roomNumber,
        stay_date: data.stayDate,
        hotel_id: data.hotelId,
        ratings: data.ratings,
        comments: data.comments,
        user_id: user?.id
      };

      const { error } = await supabase
        .from('feedback')
        .insert(feedbackData);

      if (error) throw error;
      
      onFeedbackSubmitted();
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!",
      });
      
      setTimeout(() => {
        navigate(`/hotels/${data.hotelId}`);
      }, 2000);
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-playfair text-2xl">Feedback Form</CardTitle>
        <CardDescription>
          Please rate your experience and provide any additional comments.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <UserInfoFields form={form} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HotelSelect form={form} hotels={hotels} />
              
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Room number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <RatingCategories
              form={form}
              selectedRatings={selectedRatings}
              handleStarClick={handleStarClick}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please share your thoughts, suggestions, or any issues you encountered..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Upload Photos (Optional)</FormLabel>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <div className="mt-4 flex justify-center text-sm">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary/80"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                    />
                  </label>
                  <p className="pl-1 text-muted-foreground">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-hotel-navy hover:bg-hotel-navy/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
