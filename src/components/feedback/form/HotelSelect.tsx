
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FeedbackFormSchema } from "../types/feedbackTypes";

type HotelSelectProps = {
  form: UseFormReturn<z.infer<typeof FeedbackFormSchema>>;
  hotels: { id: string; name: string; }[];
};

const HotelSelect = ({ form, hotels }: HotelSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="hotelId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Hotel</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a hotel" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {hotels.map((hotel) => (
                <SelectItem key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default HotelSelect;
