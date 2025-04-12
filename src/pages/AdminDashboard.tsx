
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useFeedbackData } from "@/hooks/useFeedbackData";
import FilterBar from "@/components/admin/FilterBar";
import FeedbackList from "@/components/admin/FeedbackList";
import SummaryCards from "@/components/admin/SummaryCards";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
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
    getAverageRating
  } = useFeedbackData();

  return (
    <div className="container-custom section-padding fade-in">
      <div className="flex flex-col">
        <div className="mb-6">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-hotel-navy dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground dark:text-gray-300">
            Manage and analyze guest feedback
          </p>
        </div>

        <SummaryCards 
          feedback={feedback} 
          getAverageRating={getAverageRating} 
        />

        <Tabs defaultValue="feedback" className="w-full">
          <TabsList className="dark:bg-hotel-charcoal dark:text-white">
            <TabsTrigger value="feedback">Feedback List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feedback">
            <Card className="dark:bg-hotel-charcoal dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Guest Feedback</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  View and manage feedback submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FilterBar 
                  filters={filters}
                  setFilters={setFilters}
                  resetFilters={resetFilters}
                  exportSelectedFeedback={exportSelectedFeedback}
                  backupFeedback={backupFeedback}
                  selectedRows={selectedRows}
                  isExporting={isExporting}
                  isBackingUp={isBackingUp}
                  feedbackLength={feedback.length}
                  lastBackup={lastBackup}
                />

                <FeedbackList 
                  isLoading={isLoading}
                  filteredFeedback={filteredFeedback}
                  selectedRows={selectedRows}
                  handleRowSelect={handleRowSelect}
                  handleSelectAll={handleSelectAll}
                  handleUpdateStatus={handleUpdateStatus}
                  exportSingleFeedback={exportSingleFeedback}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsCharts feedback={feedback} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
