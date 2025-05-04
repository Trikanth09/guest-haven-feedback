
import { useState } from 'react';
import { FeedbackItem } from "@/types/feedback";
import { useFeedbackFilters } from './useFeedbackFilters';
import { useFeedbackSelection } from './useFeedbackSelection';
import { useFeedbackExport } from './useFeedbackExport';
import { useFeedbackStatus } from './useFeedbackStatus';
import { useFeedbackPolling } from './useFeedbackPolling';
import { useRealTimeFeedback } from './useRealTimeFeedback';

export const useFeedbackData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Use our new hooks for polling and real-time updates
  const { fetchFeedback } = useFeedbackPolling({
    setIsLoading,
    setFeedback,
    setError
  });
  
  // Setup real-time updates
  useRealTimeFeedback({ setFeedback });

  // Import and use our existing hooks
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
