
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FeedbackHeader from "@/components/feedback/FeedbackHeader";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackSuccess from "@/components/feedback/FeedbackSuccess";

const FeedbackPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const hotelIdParam = searchParams.get('hotel');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleFeedbackSubmitted = () => {
    setIsSuccess(true);
  };

  if (isSuccess) {
    return <FeedbackSuccess />;
  }

  return (
    <div className="container-custom section-padding fade-in">
      <div className="max-w-3xl mx-auto">
        <FeedbackHeader />
        <FeedbackForm 
          hotelIdParam={hotelIdParam}
          onFeedbackSubmitted={handleFeedbackSubmitted}
        />
      </div>
    </div>
  );
};

export default FeedbackPage;
