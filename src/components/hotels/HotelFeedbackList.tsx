
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SocialShareButtons from "@/components/feedback/SocialShareButtons";

type Feedback = {
  id: string;
  name: string;
  ratings: Record<string, number>;
  comments: string;
  created_at: string;
};

type HotelFeedbackListProps = {
  feedback: Feedback[];
  hotelId: string;
};

const HotelFeedbackList = ({ feedback, hotelId }: HotelFeedbackListProps) => {
  return (
    <div className="mt-8">
      <h2 className="font-playfair text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6">Guest Feedback</h2>
      
      {feedback.length === 0 ? (
        <Card className="border-blue-100 dark:border-blue-900">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-center mb-4">
              No feedback has been submitted for this hotel yet.
            </p>
            <Link to={`/feedback?hotel=${hotelId}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Be the first to leave feedback
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {feedback.map((item) => (
            <Card key={item.id} className="border-blue-100 dark:border-blue-900">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-playfair text-blue-900 dark:text-blue-100">{item.name}</CardTitle>
                    <CardDescription>
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {Object.values(item.ratings).length > 0 && (
                      <div className="flex items-center">
                        <span className="mr-2 font-medium text-blue-800 dark:text-blue-200">
                          {(Object.values(item.ratings).reduce((a, b) => a + b, 0) / 
                            Object.values(item.ratings).length).toFixed(1)}
                        </span>
                        <Star className="h-5 w-5 text-blue-500 fill-blue-500" />
                      </div>
                    )}
                    <SocialShareButtons feedbackItem={item} compact />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {Object.keys(item.ratings).length > 0 && (
                  <div className="mb-4 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-blue-200 dark:border-blue-800">
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(item.ratings).map(([category, rating]) => (
                          <TableRow key={category} className="border-blue-100 dark:border-blue-900">
                            <TableCell className="capitalize">
                              {category.replace('_', ' ')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end">
                                <span className="mr-2">{rating}</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={14}
                                      className={`${
                                        rating >= star
                                          ? "text-blue-500 fill-blue-500"
                                          : "text-gray-300 dark:text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                <p className="text-muted-foreground">{item.comments}</p>
                <div className="mt-4 flex justify-end">
                  <SocialShareButtons feedbackItem={item} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelFeedbackList;
