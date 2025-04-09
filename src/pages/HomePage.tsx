
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star } from "lucide-react";

const HomePage = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section bg-hotel-navy text-white py-20 md:py-32">
        <div className="container-custom text-center">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your Voice Matters to Us
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Share your experience and help us create better stays for everyone.
          </p>
          <Link to="/feedback">
            <Button className="bg-hotel-gold text-hotel-navy hover:bg-hotel-gold/90 hover:text-hotel-navy font-medium text-lg px-8 py-6">
              Leave Feedback <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-hotel-cream">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-hotel-navy mb-4">
              Why Your Feedback Matters
            </h2>
            <p className="text-hotel-charcoal/80 max-w-2xl mx-auto">
              Your insights help us continuously improve and tailor our services
              to exceed your expectations on your next stay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Improve Service",
                description:
                  "Your feedback helps us identify opportunities to enhance our service quality.",
              },
              {
                title: "Better Experiences",
                description:
                  "We use your suggestions to create more memorable and comfortable stays.",
              },
              {
                title: "Recognize Excellence",
                description:
                  "Help us recognize staff members who went above and beyond for you.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-hotel-softblue/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="text-hotel-navy" size={24} />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-hotel-navy mb-3">
                  {benefit.title}
                </h3>
                <p className="text-hotel-charcoal/80">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-hotel-navy mb-4">
              What Our Guests Say
            </h2>
            <p className="text-hotel-charcoal/80 max-w-2xl mx-auto">
              We value every piece of feedback from our guests and use it to
              continuously improve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "New York",
                feedback:
                  "The staff went above and beyond to make our anniversary special. Thank you for the wonderful experience!",
                rating: 5,
              },
              {
                name: "David Miller",
                location: "Chicago",
                feedback:
                  "Clean rooms, friendly staff, and amazing breakfast. Will definitely stay here again on my next business trip.",
                rating: 4,
              },
              {
                name: "Emma Thompson",
                location: "Los Angeles",
                feedback:
                  "The concierge recommendations made our trip so much better. Thank you for helping us discover the city!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-hotel-lightgray p-6 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < testimonial.rating
                          ? "text-hotel-gold fill-hotel-gold"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-hotel-charcoal/80 mb-4 italic">
                  "{testimonial.feedback}"
                </p>
                <div className="font-medium">
                  <span className="text-hotel-navy">{testimonial.name}</span>
                  <span className="text-muted-foreground text-sm ml-2">
                    {testimonial.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-hotel-navy text-white">
        <div className="container-custom text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
            Ready to Share Your Experience?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Your feedback helps us create better experiences for all our guests.
            Take a moment to share your thoughts.
          </p>
          <Link to="/feedback">
            <Button className="bg-hotel-gold text-hotel-navy hover:bg-hotel-gold/90 hover:text-hotel-navy font-medium text-lg px-8 py-6">
              Submit Feedback
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
