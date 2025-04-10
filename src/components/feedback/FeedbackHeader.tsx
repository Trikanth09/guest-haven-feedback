
import React from 'react';
import { useAuth } from "@/context/AuthContext";

const FeedbackHeader = () => {
  const { user } = useAuth();
  
  return (
    <div className="text-center mb-10">
      <h1 className="font-playfair text-3xl md:text-4xl font-bold text-hotel-navy mb-4">
        Share Your Experience
      </h1>
      <p className="text-muted-foreground mb-2">
        We value your feedback to continuously improve our services and exceed your expectations.
      </p>
      {user && (
        <p className="text-sm text-primary mt-2">
          Your feedback will be submitted as {user.email}
        </p>
      )}
    </div>
  );
};

export default FeedbackHeader;
