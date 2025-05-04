
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMicrosoftGraph } from "@/hooks/useMicrosoftGraph";
import { z } from "zod";
import { FeedbackFormSchema } from "@/components/feedback/types/feedbackTypes";

export const useFeedbackSubmission = (onFeedbackSubmitted: (syncStatus?: {
  status: 'idle' | 'success' | 'error';
  message?: string;
}) => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excelSyncStatus, setExcelSyncStatus] = useState<{
    status: 'idle' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const { saveFeedbackToExcel, isProcessing } = useMicrosoftGraph();

  const submitFeedback = async (
    data: z.infer<typeof FeedbackFormSchema>,
    selectedHotelName: string,
    user: any
  ) => {
    setIsSubmitting(true);
    setExcelSyncStatus({ status: 'idle' });
    
    try {
      // Calculate average rating
      const ratings = Object.values(data.ratings);
      const averageRating = ratings.length > 0 ? 
        ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 
        0;
      
      // Prepare feedback data with consistent structure
      const feedbackData = {
        name: data.name,
        email: data.email,
        room_number: data.roomNumber,
        stay_date: data.stayDate,
        hotel_id: data.hotelId,
        ratings: data.ratings,
        comments: data.comments,
        user_id: user?.id,
        status: 'new', // Default status for new feedback
        created_at: new Date().toISOString(), // Explicitly set creation time
      };

      console.log("Submitting feedback data:", feedbackData);
      
      // Save to Supabase
      const { data: savedFeedback, error } = await supabase
        .from('feedback')
        .insert(feedbackData)
        .select();

      if (error) throw error;
      
      console.log("Feedback saved successfully:", savedFeedback);
      
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
        onFeedbackSubmitted(excelSyncStatus);
      }, 2000);
    } catch (error: any) {
      setIsSubmitting(false);
      console.error("Feedback submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    submitFeedback,
    isSubmitting,
    isProcessing,
    excelSyncStatus,
    setExcelSyncStatus
  };
};
