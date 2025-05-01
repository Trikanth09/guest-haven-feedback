
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FeedbackItem } from "@/types/feedback";

export const useFeedbackStatus = (setFeedback: React.Dispatch<React.SetStateAction<FeedbackItem[]>>) => {
  const handleUpdateStatus = useCallback(async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setFeedback(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status } : item
        )
      );
      
      toast({
        title: "Status Updated",
        description: "The feedback status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status. Please try again.",
      });
    }
  }, [setFeedback]);

  return {
    handleUpdateStatus
  };
};
