
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FeedbackItem } from '@/types/feedback';

// Extend the jsPDF types to include the autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

// Add missing internal properties
declare global {
  interface Window {
    jspdf: any;
  }
}

// Function to generate PDF for a single feedback item
export const generateFeedbackPDF = (feedbackItem: FeedbackItem): jsPDF => {
  const doc = new jsPDF();
  
  // Add a title
  doc.setFontSize(20);
  doc.setTextColor(33, 58, 138); // hotel-navy color
  doc.text("Guest Feedback Report", 105, 15, { align: 'center' });
  
  // Add metadata
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Guest: ${feedbackItem.name}`, 14, 30);
  doc.text(`Email: ${feedbackItem.email}`, 14, 38);
  
  if (feedbackItem.hotel_id) {
    doc.text(`Hotel ID: ${feedbackItem.hotel_id}`, 14, 46);
  }
  
  if (feedbackItem.room_number) {
    doc.text(`Room: ${feedbackItem.room_number}`, 14, 54);
  }
  
  if (feedbackItem.stay_date) {
    doc.text(`Stay Date: ${feedbackItem.stay_date}`, 14, 62);
  }
  
  doc.text(`Submission Date: ${new Date(feedbackItem.created_at).toLocaleDateString()}`, 14, 70);
  doc.text(`Status: ${feedbackItem.status || 'New'}`, 14, 78);
  
  // Add ratings table
  const ratingData = Object.entries(feedbackItem.ratings).map(([category, rating]) => [
    category.charAt(0).toUpperCase() + category.slice(1),
    rating
  ]);
  
  doc.autoTable({
    head: [['Category', 'Rating (out of 5)']],
    body: ratingData,
    startY: 90,
    headStyles: { fillColor: [33, 58, 138] }, // hotel-navy color
    alternateRowStyles: { fillColor: [241, 241, 241] } // light gray
  });
  
  // Add comments section
  let finalY = doc.lastAutoTable?.finalY || 90;
  
  doc.setFontSize(14);
  doc.text("Guest Comments:", 14, finalY + 15);
  
  doc.setFontSize(11);
  
  // Wrap text for comments
  const splitComments = doc.splitTextToSize(feedbackItem.comments, 180);
  doc.text(splitComments, 14, finalY + 25);
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Hotel Feedback Management System - Page ${i} of ${pageCount}`,
      105,
      (doc.internal as any).pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

// Function to generate PDF for multiple feedback items
export const generateBulkFeedbackPDF = (feedbackItems: FeedbackItem[]): jsPDF => {
  const doc = new jsPDF();
  
  // Add a title
  doc.setFontSize(20);
  doc.setTextColor(33, 58, 138); // hotel-navy color
  doc.text("Bulk Feedback Report", 105, 15, { align: 'center' });
  
  // Add metadata
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Feedback Items: ${feedbackItems.length}`, 14, 30);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 38);
  
  // Calculate average ratings
  const allRatings: { [key: string]: number[] } = {};
  
  feedbackItems.forEach(item => {
    Object.entries(item.ratings).forEach(([category, rating]) => {
      if (!allRatings[category]) {
        allRatings[category] = [];
      }
      allRatings[category].push(rating);
    });
  });
  
  const averageRatings = Object.entries(allRatings).map(([category, ratings]) => [
    category.charAt(0).toUpperCase() + category.slice(1),
    (ratings.reduce((sum, val) => sum + val, 0) / ratings.length).toFixed(1)
  ]);
  
  // Add average ratings table
  doc.autoTable({
    head: [['Category', 'Average Rating (out of 5)']],
    body: averageRatings,
    startY: 50,
    headStyles: { fillColor: [33, 58, 138] }, // hotel-navy color
    alternateRowStyles: { fillColor: [241, 241, 241] } // light gray
  });
  
  // Add feedback summary table
  const feedbackData = feedbackItems.map(item => [
    item.name,
    new Date(item.created_at).toLocaleDateString(),
    item.status || 'New',
    Object.values(item.ratings).reduce((sum, val) => sum + val, 0) / Object.values(item.ratings).length,
    item.comments.substring(0, 50) + (item.comments.length > 50 ? '...' : '')
  ]);
  
  let finalY = doc.lastAutoTable?.finalY || 50;
  
  doc.autoTable({
    head: [['Guest', 'Date', 'Status', 'Avg. Rating', 'Comments Preview']],
    body: feedbackData,
    startY: finalY + 20,
    headStyles: { fillColor: [33, 58, 138] }, // hotel-navy color
    alternateRowStyles: { fillColor: [241, 241, 241] }, // light gray
    columnStyles: {
      0: { cellWidth: 30 }, // Guest
      1: { cellWidth: 25 }, // Date
      2: { cellWidth: 25 }, // Status
      3: { cellWidth: 25 }, // Rating
      4: { cellWidth: 80 } // Comments
    }
  });
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Hotel Feedback Management System - Page ${i} of ${pageCount}`,
      105,
      (doc.internal as any).pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};
