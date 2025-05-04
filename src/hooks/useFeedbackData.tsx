
import { useState, useEffect, useCallback, useRef } from 'react';
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
  }, [toast]);

  // Initial fetch and setup real-time subscription
  useEffect(() => {
    // Initial fetch of feedback
    fetchFeedback();
    
    // Set up polling as a backup to real-time (every 10 seconds)
    pollingIntervalRef.current = window.setInterval(() => {
      console.log('Polling for new feedback data...');
      fetchFeedback();
    }, 10000); // 10 seconds
    
    // Set up real-time subscription for feedback table changes
    const channel = supabase
      .channel('public:feedback')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'feedback' 
        }, 
        (payload) => {
          console.log('Real-time feedback update:', payload);
          
          // Handle the different event types
          if (payload.eventType === 'INSERT') {
            const newFeedback = payload.new as any;
            
            // Fetch the hotel name for the new feedback
            supabase
              .from('hotels')
              .select('name')
              .eq('id', newFeedback.hotel_id)
              .single()
              .then(({ data }) => {
                const processedFeedback: FeedbackItem = {
                  ...newFeedback,
                  ratings: newFeedback.ratings as unknown as FeedbackRatings,
                  hotel_name: data?.name || 'Unknown Hotel',
                  name: newFeedback.name || 'Anonymous',
                  email: newFeedback.email || '',
                  comments: newFeedback.comments || '',
                  room_number: newFeedback.room_number || '',
                  stay_date: newFeedback.stay_date || '',
                  status: newFeedback.status || 'new',
                };
                
                console.log('Adding new feedback item to state:', processedFeedback);
                setFeedback(prev => [processedFeedback, ...prev]);
                
                toast({
                  title: "New Feedback",
                  description: `New feedback received from ${processedFeedback.name}`,
                });
              })
              .catch(err => {
                console.error('Error fetching hotel name:', err);
                // Add the feedback even without the hotel name
                const processedFeedback: FeedbackItem = {
                  ...newFeedback,
                  ratings: newFeedback.ratings as unknown as FeedbackRatings,
                  hotel_name: 'Unknown Hotel',
                  name: newFeedback.name || 'Anonymous',
                  email: newFeedback.email || '',
                  comments: newFeedback.comments || '',
                  room_number: newFeedback.room_number || '',
                  stay_date: newFeedback.stay_date || '',
                  status: newFeedback.status || 'new',
                };
                
                setFeedback(prev => [processedFeedback, ...prev]);
              });
          } else if (payload.eventType === 'UPDATE') {
            // Update existing feedback item
            setFeedback(prev => 
              prev.map(item => 
                item.id === payload.new.id ? {
                  ...item,
                  ...payload.new,
                  ratings: payload.new.ratings as unknown as FeedbackRatings,
                } : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted feedback
            setFeedback(prev => 
              prev.filter(item => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Supabase real-time subscription status:', status);
      });
    
    // Clean up the subscription and polling when the component unmounts
    return () => {
      if (pollingIntervalRef.current !== null) {
        window.clearInterval(pollingIntervalRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [fetchFeedback]);

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
