import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { FeedbackFormSchema } from "./types/feedbackTypes";
import UserInfoFields from "./form/UserInfoFields";
import HotelSelect from "./form/HotelSelect";
import RatingCategories from "./form/RatingCategories";
import FileUpload from "./form/FileUpload";
import FormAlerts from "./form/FormAlerts";
import SubmitButton from "./form/SubmitButton";
import { useFeedbackSubmission } from "@/hooks/useFeedbackSubmission";
import { z } from "zod";

interface FeedbackFormProps {
  hotelIdParam: string | null;
  onFeedbackSubmitted: () => void;
}

const FeedbackForm = ({ hotelIdParam, onFeedbackSubmitted }: FeedbackFormProps) => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<{ id: string; name: string; }[]>([]);
  const [selectedHotelName, setSelectedHotelName] = useState<string>("");
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

  const { 
    submitFeedback, 
    isSubmitting, 
    isProcessing, 
    excelSyncStatus 
  } = useFeedbackSubmission(onFeedbackSubmitted);

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
        
        // Set initial hotel name if hotelId is provided
        if (hotelIdParam && data) {
          const selectedHotel = data.find(hotel => hotel.id === hotelIdParam);
          if (selectedHotel) {
            setSelectedHotelName(selectedHotel.name);
          }
        }
      } catch (error: any) {
        console.error("Error loading hotels:", error);
      }
    };

    fetchHotels();
  }, [hotelIdParam]);

  // Update selected hotel name when the hotel selection changes
  useEffect(() => {
    const hotelId = form.watch('hotelId');
    if (hotelId && hotels.length > 0) {
      const hotel = hotels.find(h => h.id === hotelId);
      if (hotel) {
        setSelectedHotelName(hotel.name);
      }
    }
  }, [form.watch('hotelId'), hotels]);

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

  const handleFileChange = (files: FileList | null) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: z.infer<typeof FeedbackFormSchema>) => {
    await submitFeedback(data, selectedHotelName, user);
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
        <FormAlerts excelSyncStatus={excelSyncStatus} />

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

            <FileUpload onChange={handleFileChange} />

            <SubmitButton isSubmitting={isSubmitting} isProcessing={isProcessing} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
