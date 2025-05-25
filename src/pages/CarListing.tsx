import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Car, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CarRecommendation from "@/components/cars/CarRecommendation";

const carsData = [
  {
    id: 1,
    name: "Tesla Model 3",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1471&auto=format&fit=crop",
    price: 8090,
    location: "San Francisco",
    category: "Electric",
    rating: 4.9,
    features: ["Autopilot", "Premium Sound", "Climate Control"],
    seats: 5,
    transmission: "Automatic"
  },
  {
    id: 2,
    name: "BMW 3 Series",
    image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=1470&auto=format&fit=crop",
    price: 8005,
    location: "Los Angeles",
    category: "Midsize",
    rating: 4.7,
    features: ["Leather Seats", "Sunroof", "Navigation"],
    seats: 5,
    transmission: "Automatic"
  },
  {
    id: 3,
    name: "Jeep Wrangler",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop",
    price: 9050,
    location: "Denver",
    category: "SUV",
    rating: 4.8,
    features: ["4x4", "Removable Top", "Bluetooth"],
    seats: 5,
    transmission: "Manual"
  },
  {
    id: 4,
    name: "Ford Mustang",
    image: "https://images.unsplash.com/photo-1547744152-14d985cb937f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 10020,
    location: "Miami",
    category: "Sports",
    rating: 4.9,
    features: ["Convertible", "Premium Sound", "Leather Seats"],
    seats: 4,
    transmission: "Automatic"
  },
  {
    id: 5,
    name: "Toyota Camry",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1528&auto=format&fit=crop",
    price: 6050,
    location: "Chicago",
    category: "Economy",
    rating: 4.6,
    features: ["Bluetooth", "Backup Camera", "USB Ports"],
    seats: 5,
    transmission: "Automatic"
  },
  {
    id: 6,
    name: "Mercedes-Benz C-Class",
    image: "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?q=80&w=1471&auto=format&fit=crop",
    price: 11000,
    location: "New York",
    category: "Luxury",
    rating: 4.8,
    features: ["Heated Seats", "Premium Audio", "Sunroof"],
    seats: 5,
    transmission: "Automatic"
  },
  {
    id: 7,
    name: "Honda Civic",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1528&auto=format&fit=crop",
    price: 5050,
    location: "Seattle",
    category: "Economy",
    rating: 4.5,
    features: ["Fuel Efficient", "Bluetooth", "Backup Camera"],
    seats: 5,
    transmission: "Automatic"
  },
  {
    id: 8,
    name: "Chevrolet Corvette",
    image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q2hldnJvbGV0JTIwQ29ydmV0dGV8ZW58MHx8MHx8fDA%3D",
    price: 15000,
    location: "Las Vegas",
    category: "Sports",
    rating: 4.9,
    features: ["Convertible", "V8 Engine", "Premium Sound"],
    seats: 2,
    transmission: "Manual"
  }
];

const CarListing = () => {
  const [searchParams] = useSearchParams();
  const [carsData, setCarsData] = useState([]);
  const [filteredCars, setFilteredCars] = useState(carsData);
  const [searchLocation, setSearchLocation] = useState(searchParams.get('location') || "");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(searchParams.get('from') ? new Date(searchParams.get('from') || '') : undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(searchParams.get('to') ? new Date(searchParams.get('to') || '') : undefined);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [carType, setCarType] = useState<string>("");
  const [transmission, setTransmission] = useState<string>("");
  const [isMobilFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cars"); // <-- replace with your actual endpoint
        const data = await response.json();
        setCarsData(data);
        setFilteredCars(data); // initial filter
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  
  useEffect(() => {
    let filtered = [...carsData];

    if (searchLocation) {
      filtered = filtered.filter(car => 
        car.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    if (carType) {
      filtered = filtered.filter(car => car.category === carType);
    }

    if (transmission) {
      filtered = filtered.filter(car => car.transmission === transmission);
    }

    filtered = filtered.filter(car => 
      car.price >= priceRange[0] && car.price <= priceRange[1]
    );

    setFilteredCars(filtered);
  }, [searchLocation, priceRange, carType, transmission]);

  const handleRecommendation = (category: string) => {
    setCarType(category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:hidden mb-4">
          <Dialog open={isMobilFilterOpen} onOpenChange={setMobileFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Price Range</h3>
                  <div className="px-2">
                    <Slider 
                      defaultValue={priceRange} 
                      min={0} 
                      max={15000} 
                      step={1000} 
                      onValueChange={setPriceRange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div>₹{priceRange[0]}</div>
                      <div>₹{priceRange[1]}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Car Type</h3>
                  <Select value={carType} onValueChange={setCarType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Economy">Economy</SelectItem>
                      <SelectItem value="Compact">Compact</SelectItem>
                      <SelectItem value="Midsize">Midsize</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Transmission</h3>
                  <Select value={transmission} onValueChange={setTransmission}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any transmission</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={() => {
                    setMobileFilterOpen(false);
                  }} 
                  className="w-full bg-wheelteal-600 hover:bg-wheelteal-700"
                >
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="hidden md:block w-64 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Location"
                      className="pl-10"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Dates</h3>
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateFrom && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "PPP") : <span>From</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateTo && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "PPP") : <span>To</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                          disabled={(date) => date < (dateFrom || new Date())}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Price Range</h3>
                  <div className="px-2">
                    <Slider 
                      defaultValue={priceRange} 
                      min={0} 
                      max={15000} 
                      step={1000} 
                      onValueChange={setPriceRange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div>₹{priceRange[0]}</div>
                      <div>₹{priceRange[1]}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Car Type</h3>
                  <Select value={carType} onValueChange={setCarType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Economy">Economy</SelectItem>
                      <SelectItem value="Compact">Compact</SelectItem>
                      <SelectItem value="Midsize">Midsize</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Transmission</h3>
                  <Select value={transmission} onValueChange={setTransmission}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any transmission</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <CarRecommendation onRecommendationComplete={handleRecommendation} />
          
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {filteredCars.length} cars available
              {searchLocation ? ` in ${searchLocation}` : ''}
            </h1>
            <Select defaultValue="recommended">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <Link to={`/cars/${car.id}`} key={car.id}>
                  <Card className="car-card overflow-hidden h-full">
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
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Car className="h-4 w-4 mr-1" />
                        {car.location}
                      </div>
                      <div className="flex gap-1 flex-wrap mb-3">
                        {car.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-100">
                            {feature}
                          </Badge>
                        ))}
                        {car.features.length > 2 && (
                          <Badge variant="outline" className="bg-gray-100">
                            +{car.features.length - 2}
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-lg">₹{car.price}</span>
                          <span className="text-gray-500 text-sm"> / day</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No cars found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search filters to find more options
                </p>
                <Button
                  onClick={() => {
                    setSearchLocation("");
                    setPriceRange([0, 15000]);
                    setCarType("");
                    setTransmission("");
                  }}
                  variant="outline"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarListing;
