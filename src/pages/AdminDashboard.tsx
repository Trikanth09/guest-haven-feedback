
import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Search, Calendar, Filter, Star } from "lucide-react";

// Mock data for feedback
const feedbackData = [
  {
    id: 1,
    guest: "John Smith",
    date: "2025-04-02",
    ratings: { cleanliness: 4, staff: 5, amenities: 4, comfort: 5, food: 5, value: 4 },
    comments: "Exceptional stay! The staff was very attentive and the room was spotless. Will definitely return.",
    status: "new",
  },
  {
    id: 2,
    guest: "Maria Garcia",
    date: "2025-04-01",
    ratings: { cleanliness: 5, staff: 4, amenities: 3, comfort: 4, food: 2, value: 3 },
    comments: "Room was great but the restaurant service was slow. Food quality could be improved.",
    status: "in-progress",
  },
  {
    id: 3,
    guest: "David Lee",
    date: "2025-03-29",
    ratings: { cleanliness: 3, staff: 5, amenities: 4, comfort: 3, food: 4, value: 3 },
    comments: "Staff was amazing but room carpet had some stains. Bathroom was very clean though.",
    status: "resolved",
  },
  {
    id: 4,
    guest: "Sarah Johnson",
    date: "2025-03-27",
    ratings: { cleanliness: 5, staff: 5, amenities: 5, comfort: 5, food: 5, value: 5 },
    comments: "Perfect in every way! A true 5-star experience from check-in to check-out.",
    status: "new",
  },
  {
    id: 5,
    guest: "Michael Brown",
    date: "2025-03-25",
    ratings: { cleanliness: 4, staff: 3, amenities: 4, comfort: 4, food: 4, value: 3 },
    comments: "Good overall, but receptionist could be more friendly. Room was comfortable.",
    status: "resolved",
  },
];

// Mock data for analytics charts
const ratingData = [
  { name: "Cleanliness", average: 4.2 },
  { name: "Staff", average: 4.4 },
  { name: "Amenities", average: 4.0 },
  { name: "Comfort", average: 4.2 },
  { name: "Food", average: 4.0 },
  { name: "Value", average: 3.6 },
];

const statusData = [
  { name: "New", value: 40 },
  { name: "In Progress", value: 30 },
  { name: "Resolved", value: 30 },
];

const COLORS = ["#1e3a8a", "#a8c7dc", "#e3b04b"];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredFeedback, setFilteredFeedback] = useState(feedbackData);

  const filterFeedback = () => {
    return feedbackData.filter((feedback) => {
      const matchesSearch = 
        feedback.guest.toLowerCase().includes(searchTerm.toLowerCase()) || 
        feedback.comments.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === "all" || feedback.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const handleSearch = () => {
    setFilteredFeedback(filterFeedback());
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setFilteredFeedback(
      feedbackData.filter((feedback) => {
        const matchesSearch = 
          feedback.guest.toLowerCase().includes(searchTerm.toLowerCase()) || 
          feedback.comments.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesStatus = value === "all" || feedback.status === value;
        
        return matchesSearch && matchesStatus;
      })
    );
  };

  const getAverageRating = (feedback: typeof feedbackData) => {
    if (feedback.length === 0) return 0;
    
    let total = 0;
    let count = 0;
    
    feedback.forEach(item => {
      Object.values(item.ratings).forEach(rating => {
        total += rating;
        count++;
      });
    });
    
    return (total / count).toFixed(1);
  };

  return (
    <div className="container-custom section-padding fade-in">
      <div className="flex flex-col">
        <div className="mb-6">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-hotel-navy mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and analyze guest feedback
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Feedback</CardTitle>
              <CardDescription>All time submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{feedbackData.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Average Rating</CardTitle>
              <CardDescription>Across all categories</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="text-3xl font-bold">{getAverageRating(feedbackData)}</div>
              <Star className="h-5 w-5 ml-2 text-hotel-gold fill-hotel-gold" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Pending Response</CardTitle>
              <CardDescription>Feedback needing attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {feedbackData.filter(f => f.status === "new").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feedback" className="w-full">
          <TabsList>
            <TabsTrigger value="feedback">Feedback List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Guest Feedback</CardTitle>
                <CardDescription>
                  View and manage feedback submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by guest name or feedback content"
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-[180px]">
                      <Select 
                        defaultValue="all" 
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button variant="outline" onClick={handleSearch}>
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-sm font-medium">Guest</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">Avg. Rating</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Comments</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFeedback.length > 0 ? (
                          filteredFeedback.map((feedback) => {
                            const ratings = Object.values(feedback.ratings);
                            const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                            
                            return (
                              <tr key={feedback.id} className="border-t hover:bg-muted/30">
                                <td className="px-4 py-3 text-sm">{feedback.guest}</td>
                                <td className="px-4 py-3 text-sm">{feedback.date}</td>
                                <td className="px-4 py-3 text-sm text-center">
                                  <div className="flex items-center justify-center">
                                    {avgRating.toFixed(1)}
                                    <Star className="h-3.5 w-3.5 ml-1 text-hotel-gold fill-hotel-gold" />
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm max-w-xs">
                                  <div className="truncate">{feedback.comments}</div>
                                </td>
                                <td className="px-4 py-3 text-sm text-center">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      feedback.status === "new" 
                                        ? "bg-blue-100 text-blue-800"
                                        : feedback.status === "in-progress"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {feedback.status === "new" 
                                      ? "New" 
                                      : feedback.status === "in-progress" 
                                      ? "In Progress" 
                                      : "Resolved"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-muted-foreground">
                              No feedback found matching your filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Average Ratings by Category</CardTitle>
                  <CardDescription>How guests rate different aspects of their stay</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ratingData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" fill="#1e3a8a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feedback Status Distribution</CardTitle>
                  <CardDescription>Current state of feedback items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Feedback Trends</CardTitle>
                  <CardDescription>Average rating over time</CardDescription>
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Legend />
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
