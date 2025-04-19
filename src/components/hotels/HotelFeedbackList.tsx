
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      <h2 className="font-playfair text-2xl font-bold text-hotel-navy mb-6">Guest Feedback</h2>
      
      {feedback.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-center mb-4">
              No feedback has been submitted for this hotel yet.
            </p>
            <Link to={`/feedback?hotel=${hotelId}`}>
              <Button className="bg-hotel-navy hover:bg-hotel-navy/90">
                Be the first to leave feedback
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {feedback.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-playfair">{item.name}</CardTitle>
                    <CardDescription>
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex">
                    {Object.values(item.ratings).length > 0 && (
                      <div className="flex items-center">
                        <span className="mr-2 font-medium">
                          {(Object.values(item.ratings).reduce((a, b) => a + b, 0) / 
                            Object.values(item.ratings).length).toFixed(1)}
                        </span>
                        <Star className="h-5 w-5 text-hotel-gold fill-hotel-gold" />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {Object.keys(item.ratings).length > 0 && (
                  <div className="mb-4 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(item.ratings).map(([category, rating]) => (
                          <TableRow key={category}>
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
                                          ? "text-hotel-gold fill-hotel-gold"
                                          : "text-gray-300"
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelFeedbackList;
