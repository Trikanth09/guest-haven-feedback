
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const FeedbackSuccess = () => {
  const { user } = useAuth();
  
  return (
    <div className="container-custom section-padding fade-in">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-md text-center py-8">
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="font-playfair text-2xl font-bold mb-2">Feedback Submitted</h2>
            <p className="text-muted-foreground mb-2">
              Thank you for sharing your experience! Your feedback is valuable to us.
            </p>
            {user && (
              <p className="text-sm text-muted-foreground mb-4">
                Submitted as {user.email}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Redirecting you back to the hotel page...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackSuccess;
