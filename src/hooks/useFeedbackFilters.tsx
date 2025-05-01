
import { useState, useCallback, useEffect } from 'react';
import { FeedbackItem, FeedbackFilterOptions } from "@/types/feedback";

export const useFeedbackFilters = (feedback: FeedbackItem[]) => {
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState<FeedbackFilterOptions>({
    search: '',
    dateFrom: null,
    dateTo: null,
    status: 'all',
    minRating: 0,
    maxRating: 5
  });

  // Get average rating helper function
  const getAverageRating = useCallback((feedbackItems: FeedbackItem[]) => {
    if (feedbackItems.length === 0) return 0;
    
    let total = 0;
    let count = 0;
    
    feedbackItems.forEach(item => {
      Object.values(item.ratings).forEach(rating => {
        total += rating;
        count++;
      });
    });
    
    return parseFloat((total / count).toFixed(1));
  }, []);

  // Apply filters function
  const applyFilters = useCallback(() => {
    let result = [...feedback];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchLower) || 
        item.email.toLowerCase().includes(searchLower) || 
        item.comments.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply date filters
    if (filters.dateFrom) {
      result = result.filter(item => 
        new Date(item.created_at) >= filters.dateFrom!
      );
    }
    
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo!);
      dateTo.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(item => 
        new Date(item.created_at) <= dateTo
      );
    }
    
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }
    
    // Apply rating filters
    result = result.filter(item => {
      const avgRating = getAverageRating([item]);
      return avgRating >= filters.minRating! && avgRating <= filters.maxRating!;
    });
    
    setFilteredFeedback(result);
  }, [feedback, filters, getAverageRating]);

  // Only re-run filters when feedback or filters change
  useEffect(() => {
    applyFilters();
  }, [feedback, filters, applyFilters]);
  
  // Reset filters function
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      dateFrom: null,
      dateTo: null,
      status: 'all',
      minRating: 0,
      maxRating: 5
    });
  }, []);

  return {
    filteredFeedback,
    filters,
    setFilters,
    resetFilters,
    getAverageRating
  };
};
