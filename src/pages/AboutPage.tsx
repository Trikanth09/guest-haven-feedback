
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-hotel-navy text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              About GuestHaven
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              We're on a mission to transform the hospitality industry by empowering hotels 
              with guest insights that drive exceptional experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-hotel-navy mb-6">
                Why Feedback Matters
              </h2>
              <p className="text-hotel-charcoal/80 mb-6">
                In the hospitality industry, guest satisfaction is everything. The difference 
                between a good stay and an exceptional one often comes down to how well hotels 
                understand and respond to their guests' needs.
              </p>
              <p className="text-hotel-charcoal/80 mb-6">
                GuestHaven was created to bridge the gap between hotels and their guests, 
                providing a seamless feedback system that helps hotels identify opportunities 
                for improvement and recognize exceptional service.
              </p>
              <p className="text-hotel-charcoal/80">
                By collecting and analyzing detailed guest feedback across multiple categories, 
                hotels gain valuable insights that help them enhance their service, improve 
                facilities, and create memorable experiences that keep guests coming back.
              </p>
            </div>
            <div className="bg-hotel-cream p-8 rounded-lg">
              <h3 className="font-playfair text-2xl font-semibold text-hotel-navy mb-6">
                Benefits of Guest Feedback
              </h3>
              <ul className="space-y-4">
                {[
                  "Identify areas for improvement in real-time",
                  "Recognize and reward outstanding staff performance",
                  "Track service quality trends over time",
                  "Make data-driven decisions about facility upgrades",
                  "Enhance guest satisfaction and loyalty",
                  "Turn negative experiences into opportunities",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-hotel-gold mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-hotel-lightgray">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl font-bold text-hotel-navy mb-4">
              How GuestHaven Works
            </h2>
            <p className="text-hotel-charcoal/80 max-w-2xl mx-auto">
              Our feedback system is designed to be simple for guests and powerful for hotels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "For Guests",
                steps: [
                  "Complete a simple feedback form after your stay",
                  "Rate different aspects of your experience",
                  "Share detailed comments and suggestions",
                  "Upload photos to highlight specific points",
                  "Submit in just a few minutes",
                ],
              },
              {
                title: "For Hotels",
                steps: [
                  "Access real-time feedback through the dashboard",
                  "Analyze ratings across different categories",
                  "Identify trends and areas for improvement",
                  "Respond directly to guest feedback",
                  "Track progress over time with analytics",
                ],
              },
              {
                title: "The Impact",
                steps: [
                  "Continuously improved guest experiences",
                  "Higher guest satisfaction and loyalty",
                  "Increased positive online reviews",
                  "Better staff morale through recognition",
                  "More informed business decisions",
                ],
              },
            ].map((section, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-playfair text-xl font-semibold text-hotel-navy mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="w-5 h-5 rounded-full bg-hotel-navy text-white flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-hotel-softblue/20">
        <div className="container-custom text-center">
          <h2 className="font-playfair text-3xl font-bold text-hotel-navy mb-6">
            Ready to Share Your Experience?
          </h2>
          <p className="text-hotel-charcoal/80 max-w-2xl mx-auto mb-8">
            Your feedback helps shape better hospitality experiences for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/feedback">
              <Button className="bg-hotel-navy hover:bg-hotel-navy/90">
                Submit Feedback
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-hotel-navy text-hotel-navy hover:bg-hotel-navy/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
