
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  isSubmitting: boolean;
  isProcessing: boolean;
};

const SubmitButton = ({ isSubmitting, isProcessing }: SubmitButtonProps) => {
  let buttonText = "Submit Feedback";
  
  if (isSubmitting) {
    buttonText = "Submitting...";
  } else if (isProcessing) {
    buttonText = "Syncing with Excel...";
  }
  
  return (
    <Button 
      type="submit" 
      className="w-full bg-hotel-navy hover:bg-hotel-navy/90"
      disabled={isSubmitting || isProcessing}
    >
      {buttonText}
    </Button>
  );
};

export default SubmitButton;
