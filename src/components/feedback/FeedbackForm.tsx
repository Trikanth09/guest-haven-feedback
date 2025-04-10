
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import StarRating from "./StarRating";

// Using a simplified hotel type for the dropdown
type HotelBasic = {
  id: string;
  name: string;
};

// Define categories
const categories = [
  { id: "cleanliness", name: "Cleanliness" },
  { id: "staff", name: "Staff Service" },
  { id: "amenities", name: "Amenities" },
  { id: "comfort", name: "Room Comfort" },
  { id: "food", name: "Food & Beverage" },
  { id: "value", name: "Value for Money" },
];

// Define form schema
const FeedbackFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  roomNumber: z.string().optional(),
  stayDate: z.string().optional(),
  hotelId: z.string().min(1, { message: "Please select a hotel." }),
  ratings: z.record(z.number().min(1).max(5)),
  comments: z.string().min(10, { message: "Please provide more detailed feedback." }),
});

interface FeedbackFormProps {
  hotelIdParam: string | null;
  onFeedbackSubmitted: () => void;
}

const FeedbackForm = ({ hotelIdParam, onFeedbackSubmitted }: FeedbackFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotels, setHotels] = useState<HotelBasic[]>([]);
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

  // Update form values when user changes
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
        // Always store the authenticated user ID when available
        user_id: user?.id
      };

      console.log("Submitting feedback with user_id:", feedbackData.user_id);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotels.map((hotel) => (
                          <SelectItem key={hotel.id} value={hotel.id}>
                            {hotel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

            <FormField
              control={form.control}
              name="stayDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Stay Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              {form.formState.errors.ratings && (
                <p className="text-sm font-medium text-destructive">
                  Please rate at least one category
                </p>
              )}
            </div>

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
