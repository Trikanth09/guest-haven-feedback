
import { useRef, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { FeedbackItem, FeedbackRatings } from "@/types/feedback";
import { useToast } from "@/hooks/use-toast";

type FeedbackPollingProps = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  pollingInterval?: number;
};

export const useFeedbackPolling = ({
  setIsLoading,
  setFeedback,
  setError,
  pollingInterval = 10000 // Default to 10 seconds
}: FeedbackPollingProps) => {
  const { toast } = useToast();
  const pollingIntervalRef = useRef<number | null>(null);

  // Use callback to memoize the fetch function
  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching feedback data...");
      const { data, error } = await supabase
        .from('feedback')
        .select('*, hotels(name)')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      console.log("Feedback data received:", data);
      
      // Transform the data to ensure ratings are properly typed
      const typedFeedback: FeedbackItem[] = (data || []).map(item => ({
        ...item,
        ratings: item.ratings as unknown as FeedbackRatings,
        hotel_name: item.hotels?.name || 'Unknown Hotel',
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
      console.log("Processed feedback items:", typedFeedback.length);
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
  }, [setIsLoading, setFeedback, setError, toast]);

  // Setup polling
  useEffect(() => {
    // Initial fetch of feedback
    fetchFeedback();
    
    // Set up polling as a backup to real-time (every 10 seconds)
    pollingIntervalRef.current = window.setInterval(() => {
      console.log('Polling for new feedback data...');
      fetchFeedback();
    }, pollingInterval);
    
    // Clean up polling when the component unmounts
    return () => {
      if (pollingIntervalRef.current !== null) {
        window.clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchFeedback, pollingInterval]);

  return { fetchFeedback };
};
