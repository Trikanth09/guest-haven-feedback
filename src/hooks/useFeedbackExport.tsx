
import { useState, useCallback, useEffect } from 'react';
import { FeedbackItem } from "@/types/feedback";
import { generateFeedbackPDF, generateBulkFeedbackPDF } from "@/utils/pdfGenerator";
import { toast } from "@/hooks/use-toast";

export const useFeedbackExport = (feedback: FeedbackItem[], selectedRows: string[]) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  useEffect(() => {
    // Get last backup date from localStorage
    const backup = localStorage.getItem('lastBackup');
    if (backup) {
      setLastBackup(backup);
    }
  }, []);

  const exportSingleFeedback = useCallback((item: FeedbackItem) => {
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
  }, []);

  const exportSelectedFeedback = useCallback(() => {
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
  }, [feedback, selectedRows, exportSingleFeedback]);

  const backupFeedback = useCallback(() => {
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
  }, [feedback]);

  return {
    isExporting,
    isBackingUp,
    lastBackup,
    exportSingleFeedback,
    exportSelectedFeedback,
    backupFeedback
  };
};
