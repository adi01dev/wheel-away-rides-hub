
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Car, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock data for car detail
const carData = {
  id: 1,
  name: "Tesla Model 3",
  images: [
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1471&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551300361-f8151275d258?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562175976-76c8cc0b5b89?q=80&w=1374&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592839898726-8ef907c4b56f?q=80&w=1471&auto=format&fit=crop",
  ],
  price: 89,
  location: "San Francisco",
  category: "Electric",
  rating: 4.9,
  trips: 127,
  description: "Experience the future of driving with this sleek Tesla Model 3. This all-electric sedan combines cutting-edge technology with exceptional performance. Featuring Tesla's renowned Autopilot system, premium interior with minimalist design, and impressive range of over 300 miles per charge.",
  features: [
    "Autopilot",
    "Premium Sound",
    "Climate Control",
    "360° Camera",
    "Supercharger Access",
    "Heated Seats",
    "Glass Roof",
    "Long Range Battery"
  ],
  specifications: {
    year: "2022",
    make: "Tesla",
    model: "Model 3",
    color: "Midnight Silver",
    doors: 4,
    seats: 5,
    mpg: "N/A (Electric)",
    transmission: "Automatic",
    drivetrain: "All-Wheel Drive",
    fuelType: "Electric"
  },
  host: {
    name: "Michael S.",
    joinedDate: "February 2020",
    responseRate: 99,
    responseTime: "within 1 hour",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  reviews: [
    {
      id: 1,
      user: "Jessica T.",
      date: "October 2023",
      rating: 5,
      comment: "The car was immaculate and Michael was super responsive and helpful. Would definitely rent again!"
    },
    {
      id: 2,
      user: "David R.",
      date: "September 2023",
      rating: 5,
      comment: "Amazing experience! The Tesla was in perfect condition and Michael made the pickup and drop-off process very smooth."
    },
    {
      id: 3,
      user: "Sarah M.",
      date: "August 2023",
      rating: 4,
      comment: "Great car, very clean and fun to drive. Pickup location was a bit difficult to find, but otherwise excellent experience."
    }
  ]
};

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [activeImage, setActiveImage] = useState(0);
  
  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * carData.price;
  };
  
  const handleBooking = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Please select dates",
        description: "You need to select both pickup and return dates.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would submit the booking to an API
    toast({
      title: "Booking successful!",
      description: `You've booked the ${carData.name} from ${format(startDate, "MMM dd, yyyy")} to ${format(endDate, "MMM dd, yyyy")}.`,
    });
    
    // Navigate to a confirmation page
    navigate("/booking-confirmation");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Car details */}
        <div className="lg:w-2/3">
          {/* Car image gallery */}
          <div className="mb-6">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
              <img 
                src={carData.images[activeImage]} 
                alt={carData.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {carData.images.map((image, index) => (
                <div 
                  key={index}
                  className={`aspect-[4/3] rounded-md overflow-hidden cursor-pointer ${activeImage === index ? 'ring-2 ring-wheelteal-600' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${carData.name} view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Car info */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold">{carData.name}</h1>
              <Badge className="bg-wheelteal-600">{carData.category}</Badge>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="ml-1 font-semibold">{carData.rating}</span>
                <span className="text-gray-500 ml-1">({carData.trips} trips)</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Car className="h-4 w-4 mr-1" />
                <span>{carData.location}</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{carData.description}</p>
            
            <Tabs defaultValue="features">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {carData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-wheelteal-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="specs" className="py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(carData.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="py-4">
                <div className="space-y-6">
                  {carData.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">{review.user}</div>
                        <div className="text-gray-500 text-sm">{review.date}</div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, idx) => (
                          <svg
                            key={idx}
                            className={`w-4 h-4 ${idx < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Host info */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">Meet Your Host</h2>
            <div className="flex items-center gap-4">
              <img 
                src={carData.host.avatar} 
                alt={carData.host.name} 
                className="h-14 w-14 rounded-full"
              />
              <div>
                <p className="font-semibold text-lg">{carData.host.name}</p>
                <p className="text-gray-500 text-sm">Joined {carData.host.joinedDate}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">{carData.host.responseRate}% response rate</span> • 
                  <span className="text-gray-500"> Responds {carData.host.responseTime}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Booking widget */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="font-bold text-2xl">${carData.price}</span>
                    <span className="text-gray-500"> / day</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="ml-1 font-semibold">{carData.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => date < (startDate || new Date())}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {startDate && endDate && (
                  <div className="mt-6 border-t pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        ${carData.price} x {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service fee</span>
                      <span>${Math.round(calculateTotal() * 0.1)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-3 mt-3">
                      <span>Total</span>
                      <span>${calculateTotal() + Math.round(calculateTotal() * 0.1)}</span>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleBooking}
                  className="w-full mt-6 bg-wheelteal-600 hover:bg-wheelteal-700"
                >
                  {startDate && endDate ? 'Book Now' : 'Check Availability'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
