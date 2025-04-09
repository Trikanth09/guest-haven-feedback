
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond shortly.",
      });
      // Would reset form here in a real implementation
    }, 1500);
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-hotel-navy text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-playfair text-4xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-gray-300">
              Have questions or need assistance? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-playfair text-2xl font-semibold text-hotel-navy mb-6">
                Get in Touch
              </h2>
              <p className="text-hotel-charcoal/80 mb-8">
                Whether you have a question about our feedback system, need help with your account, 
                or want to learn more about how GuestHaven can benefit your hotel, our team is 
                ready to assist you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-hotel-softblue/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-hotel-navy" />
                  </div>
                  <div>
                    <h3 className="font-medium text-hotel-navy mb-1">Our Location</h3>
                    <p className="text-muted-foreground">
                      SRM University, TechPark 2<br />
                      Potheri, Kattankulathur<br />
                      Chennai, Tamil Nadu 603203<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-hotel-softblue/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-5 w-5 text-hotel-navy" />
                  </div>
                  <div>
                    <h3 className="font-medium text-hotel-navy mb-1">Email</h3>
                    <p className="text-muted-foreground">trikanth09@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-hotel-softblue/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="h-5 w-5 text-hotel-navy" />
                  </div>
                  <div>
                    <h3 className="font-medium text-hotel-navy mb-1">Phone</h3>
                    <p className="text-muted-foreground">+91 9963673767</p>
                    <p className="text-muted-foreground">+91 8838035389</p>
                    <p className="text-muted-foreground">+91 9966976111</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-hotel-softblue/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-5 w-5 text-hotel-navy" />
                  </div>
                  <div>
                    <h3 className="font-medium text-hotel-navy mb-1">Working Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 9am - 6pm IST</p>
                    <p className="text-muted-foreground">Saturday: 10am - 4pm IST</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Doe" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input id="phone" type="tel" placeholder="+91 9963673767" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="feedback">Feedback System</SelectItem>
                          <SelectItem value="hotels">Hotel Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="How can we help you?" 
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-hotel-navy hover:bg-hotel-navy/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-12">
        <div className="w-full h-96 bg-gray-200">
          <div className="w-full h-full flex items-center justify-center bg-hotel-softblue/10">
            <div className="text-center">
              <div className="font-medium text-lg mb-2">Interactive Map</div>
              <p className="text-muted-foreground text-sm">
                A map would be embedded here in a production environment
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
