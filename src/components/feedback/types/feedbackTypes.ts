
import { z } from "zod";

export const FeedbackFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  roomNumber: z.string().optional(),
  stayDate: z.string().optional(),
  hotelId: z.string().min(1, { message: "Please select a hotel." }),
  ratings: z.record(z.number().min(1).max(5)),
  comments: z.string().min(10, { message: "Please provide more detailed feedback." }),
});
