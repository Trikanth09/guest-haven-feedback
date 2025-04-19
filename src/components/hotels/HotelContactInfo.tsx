
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";

type HotelContactInfoProps = {
  location: string;
  contactInfo: string;
};

const HotelContactInfo = ({ location, contactInfo }: HotelContactInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-hotel-navy mt-0.5" />
          <div>
            <p className="font-medium">Address</p>
            <p className="text-muted-foreground">{location}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-hotel-navy mt-0.5" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{contactInfo}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Phone className="h-5 w-5 text-hotel-navy mt-0.5" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-muted-foreground">Please contact via email</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelContactInfo;
