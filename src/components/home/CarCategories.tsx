
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "luxury",
    name: "Luxury",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1528&auto=format&fit=crop",
    count: 84
  },
  {
    id: "suv",
    name: "SUV",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop",
    count: 112
  },
  {
    id: "electric",
    name: "Electric",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1471&auto=format&fit=crop",
    count: 65
  },
  {
    id: "sports",
    name: "Sports",
    image: "https://i.pinimg.com/736x/9d/b8/7e/9db87e3b023a31c722e98c04ad34e8df.jpg",
    count: 45
  },
  {
    id: "convertible",
    name: "Convertible",
    image: "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?q=80&w=1471&auto=format&fit=crop",
    count: 36
  },
  {
    id: "economy",
    name: "Economy",
    image: "https://media.ed.edmunds-media.com/chevrolet/cruze/2015/fe/2015_chevrolet_cruze_actf34_fe_1105141_500.jpg",
    count: 92
  }
];

const CarCategories = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link to={`/cars?category=${category.id}`} key={category.id}>
              <Card className="car-card overflow-hidden h-64 relative">
                <div className="absolute inset-0">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <CardContent className="relative z-10 flex flex-col justify-end h-full p-6">
                  <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  <p className="text-white/80">{category.count} cars</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarCategories;
