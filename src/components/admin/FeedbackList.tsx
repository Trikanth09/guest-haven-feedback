
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackItem } from "@/types/feedback";
import RefreshBar from "./feedback/RefreshBar";
import FeedbackTable from "./feedback/FeedbackTable";

interface FeedbackListProps {
  isLoading: boolean;
  filteredFeedback: FeedbackItem[];
  selectedRows: string[];
  handleRowSelect: (id: string) => void;
  handleSelectAll: () => void;
  handleUpdateStatus: (id: string, status: string) => Promise<void>;
  exportSingleFeedback: (item: FeedbackItem) => void;
  fetchFeedback?: () => Promise<void>;
}

const FeedbackList = ({
  isLoading,
  filteredFeedback,
  selectedRows,
  handleRowSelect,
  handleSelectAll,
  handleUpdateStatus,
  exportSingleFeedback,
  fetchFeedback,
}: FeedbackListProps) => {
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get average rating helper function
  const getAverageRating = (item: FeedbackItem) => {
    const ratings = Object.values(item.ratings);
    return ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 'N/A';
  };

  // Format timestamp for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const handleManualRefresh = async () => {
    if (fetchFeedback) {
      setIsRefreshing(true);
      try {
        await fetchFeedback();
        setLastRefreshTime(new Date());
      } catch (error) {
        console.error("Error refreshing feedback:", error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full bg-blue-50 dark:bg-blue-900/30" />
        <Skeleton className="h-20 w-full bg-blue-50 dark:bg-blue-900/30" />
        <Skeleton className="h-20 w-full bg-blue-50 dark:bg-blue-900/30" />
        <Skeleton className="h-20 w-full bg-blue-50 dark:bg-blue-900/30" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RefreshBar 
        lastRefreshTime={lastRefreshTime}
        isRefreshing={isRefreshing}
        onRefresh={handleManualRefresh}
      />

      <FeedbackTable 
        filteredFeedback={filteredFeedback}
        selectedRows={selectedRows}
        handleRowSelect={handleRowSelect}
        handleSelectAll={handleSelectAll}
        handleUpdateStatus={handleUpdateStatus}
        exportSingleFeedback={exportSingleFeedback}
        getAverageRating={getAverageRating}
        formatDate={formatDate}
      />
    </div>
  );
};

export default FeedbackList;
