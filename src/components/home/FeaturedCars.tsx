import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Mock data for featured cars
const featuredCars = [
  {
    id: 1,
    name: "Tesla Model 3",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1471&auto=format&fit=crop",
    price: 89,
    location: "San Francisco",
    category: "Electric",
    rating: 4.9
  },
  {
    id: 2,
    name: "BMW 3 Series",
    image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=1470&auto=format&fit=crop",
    price: 105,
    location: "Los Angeles",
    category: "Luxury",
    rating: 4.7
  },
  {
    id: 3,
    name: "Jeep Wrangler",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop",
    price: 95,
    location: "Denver",
    category: "SUV",
    rating: 4.8
  },
  {
    id: 4,
    name: "Ford Mustang",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f8?q=80&w=1470&auto=format&fit=crop",
    price: 120,
    location: "Miami",
    category: "Sports",
    rating: 4.9
  }
];

const FeaturedCars = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Cars</h2>
          <Link to="/cars" className="text-wheelteal-600 hover:text-wheelteal-700 font-medium">
            View All Cars
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCars.map((car) => (
            <Link to={`/cars/${car.id}`} key={car.id}>
              <Card className="car-card overflow-hidden">
                <div className="relative h-48 w-full">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-wheelteal-600">{car.category}</Badge>
                </div>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{car.name}</h3>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="ml-1 text-sm font-semibold">{car.rating}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">{car.location}</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg">₹{car.price}</span>
                      <span className="text-gray-500 text-sm"> / day</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
