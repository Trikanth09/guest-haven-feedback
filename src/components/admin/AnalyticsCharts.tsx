
import { FeedbackItem } from "@/types/feedback";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AnalyticsChartsProps {
  feedback: FeedbackItem[];
}

const COLORS = ["#1e3a8a", "#a8c7dc", "#e3b04b"];

const AnalyticsCharts = ({ feedback }: AnalyticsChartsProps) => {
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
  );
};

export default AnalyticsCharts;
