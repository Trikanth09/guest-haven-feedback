
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { FeedbackItem, FeedbackRatings } from "@/types/feedback";
import { useToast } from "@/hooks/use-toast";
import { useFeedbackFilters } from './useFeedbackFilters';
import { useFeedbackSelection } from './useFeedbackSelection';
import { useFeedbackExport } from './useFeedbackExport';
import { useFeedbackStatus } from './useFeedbackStatus';

export const useFeedbackData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use callback to memoize the fetch function
  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform the data to ensure ratings are properly typed
      const typedFeedback: FeedbackItem[] = (data || []).map(item => ({
        ...item,
        ratings: item.ratings as unknown as FeedbackRatings,
        // Ensure all required properties have values
        id: item.id,
        name: item.name || 'Anonymous',
        email: item.email || '',
        comments: item.comments || '',
        created_at: item.created_at,
        hotel_id: item.hotel_id || null,
        room_number: item.room_number || '',
        stay_date: item.stay_date || '',
        status: item.status || 'new',
        user_id: item.user_id || null
      }));
      
      setFeedback(typedFeedback);
    } catch (err: any) {
      console.error('Error fetching feedback:', err);
      setError(err?.message || 'Could not fetch feedback data');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch feedback data. Please try again.",
      });
      // Still set empty array to prevent loading indefinitely
      setFeedback([]);
    } finally {
      // Ensure loading state is always turned off, even on error
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFeedback();
    // This effect should only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Import and use our hooks
  const { 
    filteredFeedback, 
    filters, 
    setFilters, 
    resetFilters, 
    getAverageRating 
  } = useFeedbackFilters(feedback);

  const { 
    selectedRows, 
    handleRowSelect, 
    handleSelectAll 
  } = useFeedbackSelection(filteredFeedback);

  const { 
    isExporting, 
    isBackingUp, 
    lastBackup, 
    exportSingleFeedback, 
    exportSelectedFeedback, 
    backupFeedback 
  } = useFeedbackExport(feedback, selectedRows);

  const { handleUpdateStatus } = useFeedbackStatus(setFeedback);

  // Return all values and functions
  return {
    isLoading,
    error,
    feedback,
    filteredFeedback,
    selectedRows,
    filters,
    isExporting,
    isBackingUp,
    lastBackup,
    setFilters,
    resetFilters,
    handleRowSelect,
    handleSelectAll,
    handleUpdateStatus,
    exportSingleFeedback,
    exportSelectedFeedback,
    backupFeedback,
    getAverageRating,
    fetchFeedback
  };
};
