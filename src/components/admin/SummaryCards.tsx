
import { FeedbackItem } from "@/types/feedback";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Clock, Users } from "lucide-react";

interface SummaryCardsProps {
  feedback: FeedbackItem[];
  getAverageRating: (feedbackItems: FeedbackItem[]) => number;
}

const SummaryCards = ({ feedback, getAverageRating }: SummaryCardsProps) => {
  // Calculate total number of unique users who submitted feedback
  const getUniqueUsers = () => {
    const uniqueEmails = new Set(feedback.map(item => item.email));
    return uniqueEmails.size;
  };

  // Calculate the average response time (placeholder - would need actual data)
  const getAverageResponseTime = () => {
    const resolvedFeedback = feedback.filter(f => f.status === "resolved");
    return resolvedFeedback.length > 0 ? "48h" : "N/A";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="dark:bg-hotel-charcoal dark:border-gray-700 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-hotel-navy dark:text-hotel-gold" />
            Total Feedback
          </CardTitle>
          <CardDescription className="dark:text-gray-400">All time submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold dark:text-white">{feedback.length}</div>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-hotel-charcoal dark:border-gray-700 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium dark:text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-hotel-navy dark:text-hotel-gold" />
            Average Rating
          </CardTitle>
          <CardDescription className="dark:text-gray-400">Across all categories</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center">
          <div className="text-3xl font-bold dark:text-white">{getAverageRating(feedback)}</div>
          <Star className="h-5 w-5 ml-2 text-hotel-gold fill-hotel-gold" />
        </CardContent>
      </Card>
      
      <Card className="dark:bg-hotel-charcoal dark:border-gray-700 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-hotel-navy dark:text-hotel-gold" />
            Pending Response
          </CardTitle>
          <CardDescription className="dark:text-gray-400">Feedback needing attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold dark:text-white">
            {feedback.filter(f => f.status === "new").length}
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-hotel-charcoal dark:border-gray-700 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-hotel-navy dark:text-hotel-gold" />
            Avg. Response Time
          </CardTitle>
          <CardDescription className="dark:text-gray-400">Time to resolve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold dark:text-white">{getAverageResponseTime()}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
