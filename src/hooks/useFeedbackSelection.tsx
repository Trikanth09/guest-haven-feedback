
import { useState, useCallback } from 'react';
import { FeedbackItem } from "@/types/feedback";

export const useFeedbackSelection = (filteredFeedback: FeedbackItem[]) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleRowSelect = useCallback((id: string) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.length === filteredFeedback.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredFeedback.map(item => item.id));
    }
  }, [filteredFeedback, selectedRows.length]);

  return {
    selectedRows,
    handleRowSelect,
    handleSelectAll
  };
};
