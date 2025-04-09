
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const categories = [
  { id: "cleanliness", name: "Cleanliness" },
  { id: "staff", name: "Staff Service" },
  { id: "amenities", name: "Amenities" },
  { id: "comfort", name: "Room Comfort" },
  { id: "food", name: "Food & Beverage" },
  { id: "value", name: "Value for Money" },
];

const FeedbackFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  roomNumber: z.string().optional(),
  stayDate: z.string().optional(),
  ratings: z.record(z.number().min(1).max(5)),
  comments: z.string().min(10, { message: "Please provide more detailed feedback." }),
});

const FeedbackPage = () => {
  const { toast } = useToast();
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof FeedbackFormSchema>>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues: {
      name: "",
      email: "",
      roomNumber: "",
      stayDate: "",
      ratings: {},
      comments: "",
    },
  });

  const handleStarClick = (categoryId: string, rating: number) => {
    setSelectedRatings((prev) => ({
      ...prev,
      [categoryId]: rating,
    }));
    
    form.setValue("ratings", {
      ...form.getValues().ratings,
      [categoryId]: rating,
    });
  };

  const onSubmit = async (data: z.infer<typeof FeedbackFormSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      // In a real app, you would submit to an API here
      console.log("Submitted feedback data:", data);
      
      setTimeout(() => {
        setIsSubmitting(false);
        form.reset();
        setSelectedRatings({});
        
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your valuable feedback!",
        });
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container-custom section-padding fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-hotel-navy mb-4">
            Share Your Experience
          </h1>
          <p className="text-muted-foreground">
            We value your feedback to continuously improve our services and exceed your expectations.
          </p>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-playfair text-2xl">Feedback Form</CardTitle>
            <CardDescription>
              Please rate your experience and provide any additional comments.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roomNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Room number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stayDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stay Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormLabel>Ratings</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category.name}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={20}
                                className={`cursor-pointer ${
                                  selectedRatings[category.id] >= star
                                    ? "text-hotel-gold fill-hotel-gold"
                                    : "text-gray-300"
                                }`}
                                onClick={() => handleStarClick(category.id, star)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.ratings && (
                    <p className="text-sm font-medium text-destructive">
                      Please rate at least one category
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please share your thoughts, suggestions, or any issues you encountered..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Upload Photos (Optional)</FormLabel>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                    <div className="mt-4 flex justify-center text-sm">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary/80"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                        />
                      </label>
                      <p className="pl-1 text-muted-foreground">or drag and drop</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-hotel-navy hover:bg-hotel-navy/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackPage;
