
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { FeedbackFormSchema } from "./types/feedbackTypes";
import UserInfoFields from "./form/UserInfoFields";
import HotelSelect from "./form/HotelSelect";
import RatingCategories from "./form/RatingCategories";
import FileUpload from "./form/FileUpload";
import { useMicrosoftGraph } from "@/hooks/useMicrosoftGraph";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface FeedbackFormProps {
  hotelIdParam: string | null;
  onFeedbackSubmitted: () => void;
}

const FeedbackForm = ({ hotelIdParam, onFeedbackSubmitted }: FeedbackFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotels, setHotels] = useState<{ id: string; name: string; }[]>([]);
  const [selectedHotelName, setSelectedHotelName] = useState<string>("");
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [excelSyncStatus, setExcelSyncStatus] = useState<{status: 'idle' | 'success' | 'error', message?: string}>({status: 'idle'});
  const { saveFeedbackToExcel, isProcessing } = useMicrosoftGraph();

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
        toast({
          title: "Error loading hotels",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchHotels();
  }, [toast, hotelIdParam]);

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
    setIsSubmitting(true);
    setExcelSyncStatus({status: 'idle'});
    
    try {
      // Calculate average rating
      const ratings = Object.values(data.ratings);
      const averageRating = ratings.length > 0 ? 
        ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 
        0;
      
      // Save to Supabase
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
      
      // Save to OneDrive Excel using Microsoft Graph API
      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const excelResult = await saveFeedbackToExcel({
          hotelName: selectedHotelName || "Unknown Hotel",
          guestName: data.name,
          rating: averageRating,
          feedback: data.comments,
          date: currentDate
        });
        
        if (excelResult.success) {
          setExcelSyncStatus({
            status: 'success',
            message: 'Your feedback was successfully saved to our Excel database.'
          });
        } else {
          setExcelSyncStatus({
            status: 'error',
            message: 'Your feedback was saved, but could not be synchronized to Excel.'
          });
        }
      } catch (excelError: any) {
        console.error("Excel sync error:", excelError);
        setExcelSyncStatus({
          status: 'error',
          message: 'Your feedback was saved, but could not be synchronized to Excel: ' + excelError.message
        });
      }
      
      // Show general success message
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!",
      });
      
      // Navigate after a delay
      setTimeout(() => {
        onFeedbackSubmitted();
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
        {excelSyncStatus.status === 'success' && (
          <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Excel Sync Success</AlertTitle>
            <AlertDescription>{excelSyncStatus.message}</AlertDescription>
          </Alert>
        )}
        
        {excelSyncStatus.status === 'error' && (
          <Alert className="mb-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle>Excel Sync Warning</AlertTitle>
            <AlertDescription>{excelSyncStatus.message}</AlertDescription>
          </Alert>
        )}

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

            <Button 
              type="submit" 
              className="w-full bg-hotel-navy hover:bg-hotel-navy/90"
              disabled={isSubmitting || isProcessing}
            >
              {isSubmitting ? "Submitting..." : isProcessing ? "Syncing with Excel..." : "Submit Feedback"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
