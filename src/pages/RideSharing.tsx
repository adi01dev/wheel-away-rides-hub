
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, Clock, Navigation, Search, Users } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Mock ride sharing data
const availableRides = [
  {
    id: 1,
    driver: "John Doe",
    source: "San Francisco",
    destination: "Los Angeles",
    date: new Date(2025, 4, 28),
    time: "08:00 AM",
    price: 45,
    availableSeats: 3,
    car: "Tesla Model 3",
    rating: 4.8
  },
  {
    id: 2,
    driver: "Emma Wilson",
    source: "San Francisco",
    destination: "San Jose",
    date: new Date(2025, 4, 28),
    time: "09:30 AM",
    price: 25,
    availableSeats: 2,
    car: "Toyota Prius",
    rating: 4.6
  },
  {
    id: 3,
    driver: "Michael Brown",
    source: "Los Angeles",
    destination: "San Diego",
    date: new Date(2025, 4, 29),
    time: "10:00 AM",
    price: 35,
    availableSeats: 4,
    car: "Honda Accord",
    rating: 4.7
  },
  {
    id: 4,
    driver: "Sophia Williams",
    source: "Seattle",
    destination: "Portland",
    date: new Date(2025, 4, 30),
    time: "07:45 AM",
    price: 40,
    availableSeats: 3,
    car: "Subaru Outback",
    rating: 4.9
  }
];

// Mock ride requests
const rideRequests = [
  {
    id: 101,
    rider: "Jessica Garcia",
    source: "San Francisco",
    destination: "Oakland",
    date: new Date(2025, 4, 28),
    time: "08:30 AM",
    price: 20,
    passengers: 1
  },
  {
    id: 102,
    rider: "David Thompson",
    source: "San Jose",
    destination: "San Francisco",
    date: new Date(2025, 4, 29),
    time: "07:00 AM",
    price: 25,
    passengers: 2
  },
  {
    id: 103,
    rider: "Amanda Martinez",
    source: "Los Angeles",
    destination: "Santa Monica",
    date: new Date(2025, 4, 30),
    time: "09:15 AM",
    price: 15,
    passengers: 1
  }
];

// Time slot options for the select dropdown
const timeSlots = [
  "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", 
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", 
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", 
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", 
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", 
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", 
  "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM"
];

const RideSharing = () => {
  const [activeTab, setActiveTab] = useState("find");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");
  
  const [filteredRides, setFilteredRides] = useState(availableRides);
  
  // Filter rides based on search criteria
  const handleSearch = () => {
    if (!source || !destination || !date) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const filtered = availableRides.filter(ride => 
      ride.source.toLowerCase().includes(source.toLowerCase()) &&
      ride.destination.toLowerCase().includes(destination.toLowerCase()) &&
      ride.date.toDateString() === date.toDateString()
    );
    
    setFilteredRides(filtered);
    toast.success(`Found ${filtered.length} rides matching your criteria`);
  };
  
  // Request a new ride
  const handleRequestRide = () => {
    if (!source || !destination || !date || !time) {
      toast.error("Please fill all required fields");
      return;
    }
    
    toast.success("Ride request submitted successfully!");
    
    // Reset form
    setSource("");
    setDestination("");
    setDate(undefined);
    setTime("");
    setPassengers("1");
  };
  
  // Book a ride
  const handleBookRide = (rideId: number) => {
    toast.success("Booking request sent to the driver!");
  };
  
  // Accept a ride request
  const handleAcceptRequest = (requestId: number) => {
    toast.success("You've accepted the ride request!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Ride Sharing</h1>
          <p className="text-gray-600">Save money and reduce your carbon footprint by sharing rides</p>
        </div>
        
        <Tabs defaultValue="find" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="find" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find a Ride
            </TabsTrigger>
            <TabsTrigger value="offer" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Offer a Ride
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="find" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Find Available Rides</CardTitle>
                <CardDescription>Search for rides that match your travel needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Departure City"
                        className="pl-10"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Destination City"
                        className="pl-10"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger>
                        <SelectValue placeholder="Number of passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 passenger</SelectItem>
                        <SelectItem value="2">2 passengers</SelectItem>
                        <SelectItem value="3">3 passengers</SelectItem>
                        <SelectItem value="4">4 passengers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-wheelteal-600 hover:bg-wheelteal-700"
                >
                  Search Rides
                </Button>
              </CardContent>
            </Card>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Available Rides</h2>
              {filteredRides.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRides.map((ride) => (
                    <Card key={ride.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Badge className="bg-wheelteal-100 text-wheelteal-800 hover:bg-wheelteal-200 mb-2">
                                {format(ride.date, "MMM d, yyyy")}
                              </Badge>
                            </div>
                            <p className="font-medium">{ride.source}</p>
                            <p className="text-sm text-gray-500">to</p>
                            <p className="font-medium">{ride.destination}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{ride.time}</span>
                            </div>
                            <div className="flex items-center">
                              <Car className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{ride.car}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{ride.availableSeats} seats available</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                              <span>{ride.rating}</span>
                              <span className="ml-2 text-gray-500">{ride.driver}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end justify-between h-full">
                            <div className="font-bold text-xl">${ride.price}</div>
                            <Button 
                              onClick={() => handleBookRide(ride.id)}
                              className="bg-wheelteal-600 hover:bg-wheelteal-700"
                            >
                              Book Ride
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center p-8">
                  <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No rides available</h3>
                  <p className="text-gray-500 mb-6">
                    Try different search criteria or create a ride request below
                  </p>
                  <Button 
                    onClick={() => setActiveTab("offer")}
                    className="bg-wheelteal-600 hover:bg-wheelteal-700"
                  >
                    Request a Ride
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="offer" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Request a Ride</CardTitle>
                <CardDescription>Create a ride request or offer a ride to others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Departure City"
                        className="pl-10"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Destination City"
                        className="pl-10"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Departure time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger>
                        <SelectValue placeholder="Number of passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 passenger</SelectItem>
                        <SelectItem value="2">2 passengers</SelectItem>
                        <SelectItem value="3">3 passengers</SelectItem>
                        <SelectItem value="4">4 passengers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  onClick={handleRequestRide}
                  className="w-full md:w-auto bg-wheelteal-600 hover:bg-wheelteal-700"
                >
                  Request Ride
                </Button>
              </CardContent>
            </Card>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Ride Requests</h2>
              <div className="grid grid-cols-1 gap-4">
                {rideRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Badge className="bg-wheelteal-100 text-wheelteal-800 hover:bg-wheelteal-200 mb-2">
                              {format(request.date, "MMM d, yyyy")}
                            </Badge>
                          </div>
                          <p className="font-medium">{request.source}</p>
                          <p className="text-sm text-gray-500">to</p>
                          <p className="font-medium">{request.destination}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-500 mr-2" />
                            <span>{request.time}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-500 mr-2" />
                            <span>{request.passengers} {request.passengers === 1 ? 'passenger' : 'passengers'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-gray-500">{request.rider}</span>
                        </div>
                        
                        <div className="flex flex-col items-end justify-between h-full">
                          <div className="font-bold text-xl">${request.price}</div>
                          <Button 
                            onClick={() => handleAcceptRequest(request.id)}
                            className="bg-wheelteal-600 hover:bg-wheelteal-700"
                          >
                            Accept Request
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RideSharing;
