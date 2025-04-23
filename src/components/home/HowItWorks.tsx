
import { Car, Calendar, CreditCard } from "lucide-react";

// Define the Search component before using it in the steps array
const Search = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const steps = [
  {
    icon: Search,
    title: "Find the perfect car",
    description: "Browse thousands of cars based on your search criteria and read reviews from other drivers."
  },
  {
    icon: Calendar,
    title: "Book your trip",
    description: "Book the car that's right for you. Choose a convenient pickup location and time."
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    description: "Pay through our secure platform and get instant confirmation for your booking."
  },
  {
    icon: Car,
    title: "Enjoy the ride",
    description: "Meet the car owner, pick up the keys, and enjoy your journey with confidence."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How WheelAway Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Renting a car has never been easier. Follow these simple steps to get started on your journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="rounded-full bg-wheelteal-100 p-4 mb-4">
                <step.icon className="h-8 w-8 text-wheelteal-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
