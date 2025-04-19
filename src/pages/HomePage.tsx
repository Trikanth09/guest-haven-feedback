
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { ChevronRight, Star, BarChart2, Hotel, MessageSquare } from "lucide-react";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section text-white py-20 md:py-32 flex items-center justify-center">
        <div className="container-custom text-center">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Elevate Your Guest Experience with Valuable Feedback
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl mb-8">
            Collect, analyze, and respond to guest feedback to create unforgettable hotel experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/feedback" : "/auth"}>
              <Button 
                size="lg" 
                className="bg-hotel-gold hover:bg-hotel-gold/90 text-hotel-navy font-semibold px-8"
              >
                {user ? "Submit Feedback" : "Get Started"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/hotels">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white px-8"
              >
                Browse Hotels
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-hotel-navy dark:text-white mb-4">
              Powerful Feedback Management
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg">
              Our platform provides powerful tools for hotels to collect and analyze guest feedback, 
              turning insights into action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-hotel-cream dark:bg-hotel-charcoal p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-hotel-navy dark:bg-hotel-gold h-12 w-12 rounded-full flex items-center justify-center mb-6">
                <Star className="text-white h-6 w-6" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-hotel-navy dark:text-white mb-4">
                Comprehensive Ratings
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Collect detailed feedback on every aspect of the guest experience, 
                from cleanliness to staff service and amenities.
              </p>
            </div>

            <div className="bg-hotel-cream dark:bg-hotel-charcoal p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-hotel-navy dark:bg-hotel-gold h-12 w-12 rounded-full flex items-center justify-center mb-6">
                <BarChart2 className="text-white h-6 w-6" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-hotel-navy dark:text-white mb-4">
                Insightful Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Turn feedback into actionable insights with powerful analytics dashboards 
                designed specifically for hospitality businesses.
              </p>
            </div>

            <div className="bg-hotel-cream dark:bg-hotel-charcoal p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-hotel-navy dark:bg-hotel-gold h-12 w-12 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="text-white h-6 w-6" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-hotel-navy dark:text-white mb-4">
                Guest Engagement
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Engage directly with guest feedback, respond promptly, and build lasting 
                relationships that turn guests into loyal advocates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hotel-navy dark:bg-gray-800 text-white">
        <div className="container-custom text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Guest Experience?
          </h2>
          <p className="max-w-2xl mx-auto text-lg mb-8">
            Join hotels worldwide using our platform to collect valuable guest feedback and deliver exceptional experiences.
          </p>
          <Link to={user ? "/feedback" : "/auth"}>
            <Button 
              size="lg" 
              className="bg-hotel-gold hover:bg-hotel-gold/90 text-hotel-navy font-semibold px-8"
            >
              {user ? "Submit Feedback" : "Get Started"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section - Could be expanded in future */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-hotel-navy dark:text-white mb-4">
              Trusted by Hotels Worldwide
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how hotels are improving their guest experience with our feedback system.
            </p>
          </div>
          
          {/* Testimonial cards would go here */}
          <div className="text-center mt-8">
            <Link to="/about">
              <Button variant="outline" className="border-hotel-navy text-hotel-navy dark:border-white dark:text-white">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
