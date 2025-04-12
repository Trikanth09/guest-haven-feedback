
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Search, Calendar, Filter, Star, Download, FileDown, Printer, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FeedbackItem, FeedbackFilterOptions, FeedbackRatings } from "@/types/feedback";
import { toast } from "@/hooks/use-toast";
import { generateFeedbackPDF, generateBulkFeedbackPDF } from "@/utils/pdfGenerator";

const COLORS = ["#1e3a8a", "#a8c7dc", "#e3b04b"];

const AdminDashboard = () => {
  const { user } = useAuth();
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

  const getStatusCounts = () => {
    const counts = {
      new: 0,
      'in-progress': 0,
      resolved: 0
    };
    
    feedback.forEach(item => {
      if (item.status === 'new') counts.new++;
      else if (item.status === 'in-progress') counts['in-progress']++;
      else if (item.status === 'resolved') counts.resolved++;
    });
    
    return [
      { name: "New", value: counts.new },
      { name: "In Progress", value: counts['in-progress'] },
      { name: "Resolved", value: counts.resolved }
    ];
  };

  const getRatingData = () => {
    const categories = ['cleanliness', 'staff', 'comfort', 'amenities', 'value', 'food'];
    const result = [];
    
    for (const category of categories) {
      let total = 0;
      let count = 0;
      
      feedback.forEach(item => {
        if (item.ratings[category as keyof typeof item.ratings] !== undefined) {
          total += item.ratings[category as keyof typeof item.ratings] as number;
          count++;
        }
      });
      
      if (count > 0) {
        result.push({
          name: category.charAt(0).toUpperCase() + category.slice(1),
          average: parseFloat((total / count).toFixed(1))
        });
      }
    }
    
    return result;
  };

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="dark:bg-hotel-charcoal dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium dark:text-white">Total Feedback</CardTitle>
              <CardDescription className="dark:text-gray-400">All time submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white">{feedback.length}</div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-hotel-charcoal dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium dark:text-white">Average Rating</CardTitle>
              <CardDescription className="dark:text-gray-400">Across all categories</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="text-3xl font-bold dark:text-white">{getAverageRating(feedback)}</div>
              <Star className="h-5 w-5 ml-2 text-hotel-gold fill-hotel-gold" />
            </CardContent>
          </Card>
          
          <Card className="dark:bg-hotel-charcoal dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium dark:text-white">Pending Response</CardTitle>
              <CardDescription className="dark:text-gray-400">Feedback needing attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white">
                {feedback.filter(f => f.status === "new").length}
              </div>
            </CardContent>
          </Card>
        </div>

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
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between gap-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                      <Input
                        placeholder="Search by guest name or feedback content"
                        className="pl-8 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-[150px]">
                        <Select 
                          value={filters.status}
                          onValueChange={(value) => setFilters({...filters, status: value})}
                        >
                          <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      onClick={resetFilters}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={exportSelectedFeedback}
                      disabled={selectedRows.length === 0 || isExporting}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={backupFeedback}
                      disabled={isBackingUp || feedback.length === 0}
                      title={lastBackup ? `Last backup: ${new Date(lastBackup).toLocaleString()}` : ''}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Backup
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/50 dark:bg-gray-800">
                        <TableRow className="dark:border-gray-700">
                          <TableHead className="w-8">
                            <input
                              type="checkbox"
                              checked={filteredFeedback.length > 0 && selectedRows.length === filteredFeedback.length}
                              onChange={handleSelectAll}
                              className="rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                          </TableHead>
                          <TableHead className="dark:text-gray-300">Guest</TableHead>
                          <TableHead className="dark:text-gray-300">Date</TableHead>
                          <TableHead className="text-center dark:text-gray-300">Rating</TableHead>
                          <TableHead className="dark:text-gray-300">Comments</TableHead>
                          <TableHead className="text-center dark:text-gray-300">Status</TableHead>
                          <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center dark:text-gray-300 dark:border-gray-700">
                              Loading feedback data...
                            </TableCell>
                          </TableRow>
                        ) : filteredFeedback.length > 0 ? (
                          filteredFeedback.map((feedback) => {
                            const ratings = Object.values(feedback.ratings);
                            const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                            
                            return (
                              <TableRow key={feedback.id} className="dark:border-gray-700 dark:hover:bg-gray-800">
                                <TableCell className="dark:text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={selectedRows.includes(feedback.id)}
                                    onChange={() => handleRowSelect(feedback.id)}
                                    className="rounded dark:bg-gray-700 dark:border-gray-600"
                                  />
                                </TableCell>
                                <TableCell className="font-medium dark:text-gray-300">
                                  <div>{feedback.name}</div>
                                  <div className="text-xs text-muted-foreground dark:text-gray-400">{feedback.email}</div>
                                </TableCell>
                                <TableCell className="dark:text-gray-300">
                                  {new Date(feedback.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-center dark:text-gray-300">
                                  <div className="flex items-center justify-center">
                                    {avgRating.toFixed(1)}
                                    <Star className="h-3.5 w-3.5 ml-1 text-hotel-gold fill-hotel-gold" />
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-xs dark:text-gray-300">
                                  <div className="truncate">{feedback.comments}</div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Select 
                                    value={feedback.status || 'new'} 
                                    onValueChange={(value) => handleUpdateStatus(feedback.id, value)}
                                  >
                                    <SelectTrigger className="h-7 w-32 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                      <SelectValue>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                          feedback.status === "new" 
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                            : feedback.status === "in-progress"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        }`}>
                                          {feedback.status === "new" 
                                            ? "New" 
                                            : feedback.status === "in-progress" 
                                            ? "In Progress" 
                                            : "Resolved"}
                                        </span>
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="in-progress">In Progress</SelectItem>
                                      <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => exportSingleFeedback(feedback)}
                                    className="dark:text-gray-300 dark:hover:bg-gray-700"
                                  >
                                    <Printer className="h-4 w-4 mr-1" />
                                    Export
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground dark:text-gray-400 dark:border-gray-700">
                              No feedback found matching your filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dark:bg-hotel-charcoal dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Average Ratings by Category</CardTitle>
                  <CardDescription className="dark:text-gray-400">How guests rate different aspects of their stay</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getRatingData()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis domain={[0, 5]} stroke="#999" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ color: '#999' }} />
                        <Bar dataKey="average" fill="#1e3a8a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-hotel-charcoal dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Feedback Status Distribution</CardTitle>
                  <CardDescription className="dark:text-gray-400">Current state of feedback items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getStatusCounts()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {getStatusCounts().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 dark:bg-hotel-charcoal dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Feedback Trends</CardTitle>
                  <CardDescription className="dark:text-gray-400">Average rating over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: "Jan", rating: 4.1 },
                          { month: "Feb", rating: 4.2 },
                          { month: "Mar", rating: 4.3 },
                          { month: "Apr", rating: 4.5 },
                          { month: "May", rating: 4.2 },
                          { month: "Jun", rating: 4.0 },
                          { month: "Jul", rating: 3.9 },
                          { month: "Aug", rating: 4.1 },
                          { month: "Sep", rating: 4.3 },
                          { month: "Oct", rating: 4.4 },
                          { month: "Nov", rating: 4.5 },
                          { month: "Dec", rating: 4.6 },
                        ]}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                        <XAxis dataKey="month" stroke="#999" />
                        <YAxis domain={[0, 5]} stroke="#999" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ color: '#999' }} />
                        <Bar dataKey="rating" name="Average Rating" fill="#e3b04b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
