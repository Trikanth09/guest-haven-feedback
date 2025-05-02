
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FeedbackHeader from "@/components/feedback/FeedbackHeader";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackSuccess from "@/components/feedback/FeedbackSuccess";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const FeedbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const hotelIdParam = searchParams.get('hotel');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Add effect to optimize initial loading
  useEffect(() => {
    // Simulate preloading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, isMobile ? 50 : 100); // Faster loading on mobile devices
    
    return () => clearTimeout(timer);
  }, [isMobile]);
  
  const handleFeedbackSubmitted = () => {
    setIsSuccess(true);
  };

  if (isSuccess) {
    return <FeedbackSuccess />;
  }

  return (
    <div className="container-custom section-padding fade-in bg-white dark:bg-hotel-charcoal">
      <div className="max-w-3xl mx-auto">
        <FeedbackHeader />
        {isLoading ? (
          <div className="space-y-4 mt-6">
            <Skeleton className="h-10 w-3/4 bg-hotel-cream dark:bg-hotel-navy/60" />
            <Skeleton className="h-32 w-full bg-hotel-cream dark:bg-hotel-navy/60" />
            <Skeleton className="h-10 w-full bg-hotel-cream dark:bg-hotel-navy/60" />
            <Skeleton className="h-10 w-1/2 bg-hotel-cream dark:bg-hotel-navy/60" />
          </div>
        ) : (
          <FeedbackForm 
            hotelIdParam={hotelIdParam}
            onFeedbackSubmitted={handleFeedbackSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
