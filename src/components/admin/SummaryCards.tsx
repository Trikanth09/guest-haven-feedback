
import { FeedbackItem } from "@/types/feedback";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface SummaryCardsProps {
  feedback: FeedbackItem[];
  getAverageRating: (feedbackItems: FeedbackItem[]) => number;
}

const SummaryCards = ({ feedback, getAverageRating }: SummaryCardsProps) => {
  return (
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
  );
};

export default SummaryCards;
