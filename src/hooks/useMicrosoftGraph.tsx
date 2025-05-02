
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

// Microsoft Graph API integration hook
export const useMicrosoftGraph = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  // Save feedback to OneDrive Excel file
  const saveFeedbackToExcel = async (feedbackData: {
    hotelName: string;
    guestName: string;
    rating: number;
    feedback: string;
    date: string;
  }) => {
    setIsProcessing(true);
    
    try {
      // Call Supabase Edge Function to handle the API request to Microsoft Graph
      const { data, error } = await supabase.functions.invoke('microsoft-graph-excel', {
        body: {
          action: 'appendRow',
          fileUrl: 'https://1drv.ms/x/c/b3809bd057d8352e/EWO3tU4npKVCn5fcm_5X9nMBmTnsiFSncXrQzLNMsllvTw',
          worksheetName: 'FeedbackData',
          values: [
            feedbackData.hotelName,
            feedbackData.guestName, 
            feedbackData.rating.toString(),
            feedbackData.feedback,
            feedbackData.date
          ]
        }
      });

      if (error) throw error;
      
      toast({
        title: "Excel Updated",
        description: "Your feedback has been successfully saved to OneDrive Excel.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Error saving to Excel:", error);
      toast({
        variant: "destructive",
        title: "Excel Update Failed",
        description: "Could not save your feedback to Excel. " + (error.message || "Please try again."),
      });
      
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    saveFeedbackToExcel,
    isProcessing
  };
};
