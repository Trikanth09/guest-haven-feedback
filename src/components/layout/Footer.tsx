
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-hotel-navy dark:bg-hotel-charcoal text-white pt-12 pb-6 transition-colors duration-300">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-playfair text-xl font-semibold">GuestHaven</h3>
            <p className="text-sm text-gray-300">
              Helping hotels transform guest feedback into exceptional experiences.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-hotel-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-hotel-gold transition-colors">
                  Submit Feedback
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-hotel-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-hotel-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Hotels</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/admin/dashboard" className="hover:text-hotel-gold transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/benefits" className="hover:text-hotel-gold transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-hotel-gold transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>contact@guesthaven.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Hospitality Way</li>
              <li>Suite 456</li>
              <li>Hotel District, HD 12345</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} GuestHaven. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
