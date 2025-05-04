
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { FeedbackItem, FeedbackRatings } from "@/types/feedback";
import { useToast } from "@/hooks/use-toast";

type RealTimeFeedbackProps = {
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
};

export const useRealTimeFeedback = ({ setFeedback }: RealTimeFeedbackProps) => {
  const { toast } = useToast();
  
  useEffect(() => {
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
            // Fix the Promise handling to avoid using .catch directly on PromiseLike
            if (newFeedback.hotel_id) {
              // Use proper Promise handling
              supabase
                .from('hotels')
                .select('name')
                .eq('id', newFeedback.hotel_id)
                .single()
                .then(({ data, error }) => {
                  if (error) {
                    console.error('Error fetching hotel name:', error);
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
                    
                    toast({
                      title: "New Feedback",
                      description: `New feedback received from ${processedFeedback.name}`,
                    });
                    return;
                  }
                  
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
                });
            } else {
              // If no hotel_id, just add the feedback without hotel name
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
              
              toast({
                title: "New Feedback",
                description: `New feedback received from ${processedFeedback.name}`,
              });
            }
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
    
    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [setFeedback, toast]);
};
