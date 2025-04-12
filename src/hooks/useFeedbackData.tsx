
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { FeedbackItem, FeedbackFilterOptions, FeedbackRatings } from "@/types/feedback";
import { generateFeedbackPDF, generateBulkFeedbackPDF } from "@/utils/pdfGenerator";
import { toast } from "@/hooks/use-toast";

export const useFeedbackData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<FeedbackFilterOptions>({
    search: '',
    dateFrom: null,
    dateTo: null,
    status: 'all',
    minRating: 0,
    maxRating: 5
  });

  useEffect(() => {
    fetchFeedback();
    
    // Get last backup date from localStorage
    const backup = localStorage.getItem('lastBackup');
    if (backup) {
      setLastBackup(backup);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [feedback, filters]);

  const fetchFeedback = async () => {
    setIsLoading(true);
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
        name: item.name,
        email: item.email,
        comments: item.comments,
        created_at: item.created_at,
        hotel_id: item.hotel_id,
        room_number: item.room_number,
        stay_date: item.stay_date,
        status: item.status || 'new',
        user_id: item.user_id
      }));
      
      setFeedback(typedFeedback);
      setFilteredFeedback(typedFeedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch feedback data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
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
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      dateFrom: null,
      dateTo: null,
      status: 'all',
      minRating: 0,
      maxRating: 5
    });
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredFeedback.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredFeedback.map(item => item.id));
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
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
  };

  const exportSingleFeedback = (item: FeedbackItem) => {
    try {
      const doc = generateFeedbackPDF(item);
      doc.save(`Feedback_${item.id}.pdf`);
      
      toast({
        title: "Export Complete",
        description: "The feedback report has been exported as a PDF.",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not generate the PDF. Please try again.",
      });
    }
  };

  const exportSelectedFeedback = () => {
    if (selectedRows.length === 0) {
      toast({
        variant: "destructive",
        title: "No Rows Selected",
        description: "Please select at least one feedback entry to export.",
      });
      return;
    }
    
    setIsExporting(true);
    try {
      const selectedItems = feedback.filter(item => selectedRows.includes(item.id));
      
      if (selectedRows.length === 1) {
        // Export single feedback in detailed format
        exportSingleFeedback(selectedItems[0]);
      } else {
        // Export multiple feedback in a summarized format
        const doc = generateBulkFeedbackPDF(selectedItems);
        doc.save(`Feedback_Bulk_Export_${new Date().toISOString().slice(0, 10)}.pdf`);
        
        toast({
          title: "Bulk Export Complete",
          description: `${selectedItems.length} feedback entries have been exported as a PDF.`,
        });
      }
    } catch (error) {
      console.error('Error exporting PDFs:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not generate the PDF. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const backupFeedback = () => {
    setIsBackingUp(true);
    try {
      // Create a JSON backup
      const dataStr = JSON.stringify(feedback, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      // Create a download link and trigger the download
      const exportFileDefaultName = `Feedback_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      // Update last backup time
      const now = new Date().toISOString();
      localStorage.setItem('lastBackup', now);
      setLastBackup(now);
      
      toast({
        title: "Backup Complete",
        description: `All feedback data has been backed up successfully.`,
      });
    } catch (error) {
      console.error('Error backing up data:', error);
      toast({
        variant: "destructive",
        title: "Backup Failed",
        description: "Could not create the backup. Please try again.",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const getAverageRating = (feedbackItems: FeedbackItem[]) => {
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
  };

  return {
    isLoading,
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
