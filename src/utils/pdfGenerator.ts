
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FeedbackItem } from '@/types/feedback';

// Define the AutoTableResult interface for table positioning
interface AutoTableResult {
  finalY: number;
}

// Define a type for internal PubSub events
type PubSub = any;

// Define a complete type for jsPDF to avoid conflicts
declare module 'jspdf' {
  interface jsPDF {
    autoTable: {
      (options: any): jsPDF;
      previous?: AutoTableResult;
    };
    internal: {
      getNumberOfPages: () => number;
      pageSize: { 
        width: number; 
        getWidth: () => number; 
        height: number; 
        getHeight: () => number; 
      };
      events: PubSub;
      scaleFactor: number;
      pages: number[];
      getEncryptor(objectId: number): (data: string) => string;
    };
  }
}

export const generateFeedbackPDF = (feedback: FeedbackItem, companyName = 'GuestHaven') => {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138); // hotel-navy color
  doc.text(companyName, 105, 15, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Feedback Report', 105, 25, { align: 'center' });
  
  // Add metadata
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 105, 35, { align: 'center' });
  
  // Add guest information
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Guest Information', 20, 50);
  
  const guestInfo = [
    ['Name', feedback.name],
    ['Email', feedback.email],
    ['Submission Date', new Date(feedback.created_at).toLocaleString()],
    ['Status', feedback.status]
  ];
  
  if (feedback.room_number) {
    guestInfo.push(['Room Number', feedback.room_number]);
  }
  
  if (feedback.stay_date) {
    guestInfo.push(['Stay Date', feedback.stay_date]);
  }
  
  doc.autoTable({
    startY: 55,
    head: [['Field', 'Value']],
    body: guestInfo,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [30, 58, 138] },
  });
  
  // Calculate next Y position using the previous table's finalY
  const finalY1 = doc.autoTable.previous?.finalY || 120;
  
  // Add ratings
  doc.text('Ratings', 20, finalY1 + 15);
  
  const ratingsArray = Object.entries(feedback.ratings).map(([category, rating]) => {
    return [category.charAt(0).toUpperCase() + category.slice(1), rating];
  });
  
  doc.autoTable({
    startY: finalY1 + 20,
    head: [['Category', 'Rating (out of 5)']],
    body: ratingsArray,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [30, 58, 138] },
  });
  
  // Calculate next Y position using the previous table's finalY
  const finalY2 = doc.autoTable.previous?.finalY || 180;
  
  // Add comments
  doc.text('Comments', 20, finalY2 + 15);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const textLines = doc.splitTextToSize(feedback.comments, 170);
  doc.text(textLines, 20, finalY2 + 25);
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `${companyName} | Confidential | Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

export const generateBulkFeedbackPDF = (feedbackItems: FeedbackItem[], companyName = 'GuestHaven') => {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138); // hotel-navy color
  doc.text(companyName, 105, 15, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Bulk Feedback Report', 105, 25, { align: 'center' });
  
  // Add metadata
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 105, 35, { align: 'center' });
  doc.text(`Total Feedback Entries: ${feedbackItems.length}`, 105, 45, { align: 'center' });
  
  // Create table with feedback data
  const tableBody = feedbackItems.map(item => {
    const avgRating = Object.values(item.ratings).reduce((sum, rating) => sum + rating, 0) / 
                      Object.values(item.ratings).length;
    
    return [
      item.name,
      new Date(item.created_at).toLocaleDateString(),
      avgRating.toFixed(1),
      item.status,
      item.comments.length > 40 ? item.comments.substring(0, 40) + '...' : item.comments
    ];
  });
  
  doc.autoTable({
    startY: 55,
    head: [['Guest Name', 'Date', 'Avg. Rating', 'Status', 'Comments']],
    body: tableBody,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [30, 58, 138] },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 70 }
    }
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `${companyName} | Confidential | Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};
