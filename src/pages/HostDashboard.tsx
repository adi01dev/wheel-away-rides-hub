import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Car, DollarSign, Calendar, Users, ChevronRight, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for host dashboard
const hostData = {
  name: "Michael S.",
  carsListed: 2,
  totalEarnings: 3456.78,
  totalTrips: 27,
  pendingBookings: 2,
  thisMonth: {
    earnings: 845.25,
    trips: 6
  }
};

const carListings = [
  {
    id: 1,
    name: "Tesla Model 3",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1471&auto=format&fit=crop",
    price: 89,
    trips: 17,
    rating: 4.9,
    status: "active"
  },
  {
    id: 2,
    name: "BMW X5",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1470&auto=format&fit=crop",
    price: 115,
    trips: 10,
    rating: 4.8,
    status: "active"
  }
];

const bookings = [
  {
    id: 1,
    car: "Tesla Model 3",
    renter: "Jessica T.",
    startDate: "2023-11-10",
    endDate: "2023-11-14",
    status: "upcoming",
    totalAmount: 356,
    image: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: 2,
    car: "BMW X5",
    renter: "David R.",
    startDate: "2023-11-18",
    endDate: "2023-11-20",
    status: "upcoming",
    totalAmount: 230,
    image: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 3,
    car: "Tesla Model 3",
    renter: "Sarah M.",
    startDate: "2023-11-01",
    endDate: "2023-11-03",
    status: "completed",
    totalAmount: 178,
    image: "https://i.pravatar.cc/150?img=26"
  },
  {
    id: 4,
    car: "BMW X5",
    renter: "Robert L.",
    startDate: "2023-10-25",
    endDate: "2023-10-28",
    status: "completed",
    totalAmount: 345,
    image: "https://i.pravatar.cc/150?img=13"
  }
];

const HostDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-wheelteal-100 flex items-center justify-center text-wheelteal-700 font-bold">
                {hostData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold">{hostData.name}</p>
                <p className="text-sm text-gray-500">Host</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Button 
                variant={activeTab === "dashboard" ? "default" : "ghost"} 
                className={`w-full justify-start ${activeTab === "dashboard" ? "bg-wheelteal-600 hover:bg-wheelteal-700" : ""}`}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </Button>
              <Button 
                variant={activeTab === "listings" ? "default" : "ghost"} 
                className={`w-full justify-start ${activeTab === "listings" ? "bg-wheelteal-600 hover:bg-wheelteal-700" : ""}`}
                onClick={() => setActiveTab("listings")}
              >
                My Cars
              </Button>
              <Button 
                variant={activeTab === "bookings" ? "default" : "ghost"} 
                className={`w-full justify-start ${activeTab === "bookings" ? "bg-wheelteal-600 hover:bg-wheelteal-700" : ""}`}
                onClick={() => setActiveTab("bookings")}
              >
                Bookings
              </Button>
              <Button 
                variant={activeTab === "earnings" ? "default" : "ghost"} 
                className={`w-full justify-start ${activeTab === "earnings" ? "bg-wheelteal-600 hover:bg-wheelteal-700" : ""}`}
                onClick={() => setActiveTab("earnings")}
              >
                Earnings
              </Button>
              <Button 
                variant={activeTab === "profile" ? "default" : "ghost"} 
                className={`w-full justify-start ${activeTab === "profile" ? "bg-wheelteal-600 hover:bg-wheelteal-700" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </Button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* Dashboard tab */}
            <TabsContent value="dashboard">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <Button variant="outline" className="hidden md:flex">
                    <Calendar className="mr-2 h-4 w-4" />
                    November 2023
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Earnings</p>
                          <p className="text-2xl font-bold">${hostData.totalEarnings.toFixed(2)}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Trips</p>
                          <p className="text-2xl font-bold">{hostData.totalTrips}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Cars Listed</p>
                          <p className="text-2xl font-bold">{hostData.carsListed}</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                          <Car className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Pending Bookings</p>
                          <p className="text-2xl font-bold">{hostData.pendingBookings}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Your Cars</CardTitle>
                      <Button 
                        variant="ghost" 
                        className="text-wheelteal-600 hover:text-wheelteal-700"
                        onClick={() => setActiveTab("listings")}
                      >
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {carListings.map((car) => (
                        <div key={car.id} className="flex gap-4 items-center border rounded-md p-4">
                          <div className="w-20 h-20 rounded overflow-hidden shrink-0">
                            <img 
                              src={car.image} 
                              alt={car.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="font-medium truncate">{car.name}</p>
                              <Badge className="bg-green-500">{car.status}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span className="mr-3">${car.price}/day</span>
                              <span>{car.trips} trips</span>
                            </div>
                            <div className="flex items-center mt-2">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                              <span className="ml-1 text-sm font-semibold">{car.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Upcoming Bookings</CardTitle>
                      <Button 
                        variant="ghost" 
                        className="text-wheelteal-600 hover:text-wheelteal-700"
                        onClick={() => setActiveTab("bookings")}
                      >
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {bookings.filter(b => b.status === "upcoming").map((booking) => (
                        <div key={booking.id} className="flex items-center gap-4 border rounded-md p-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                            <img 
                              src={booking.image} 
                              alt={booking.renter} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium">{booking.renter}</p>
                              <span className="text-sm font-semibold">${booking.totalAmount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500 flex items-center">
                                <Car className="h-3 w-3 mr-1" />
                                <span>{booking.car}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Listings tab */}
            <TabsContent value="listings">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">My Cars</h1>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-wheelteal-600 hover:bg-wheelteal-700">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Car
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a new car</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-center text-gray-500">
                          This feature is coming soon! Check back later to add more cars to your fleet.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {carListings.map((car) => (
                    <Card key={car.id} className="overflow-hidden">
                      <div className="h-48 w-full">
                        <img 
                          src={car.image} 
                          alt={car.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{car.name}</h3>
                          <Badge className={`${car.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}`}>
                            {car.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="mr-3">${car.price}/day</span>
                          <span>{car.trips} trips</span>
                        </div>
                        
                        <div className="flex items-center mb-4">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="ml-1 text-sm font-semibold">{car.rating}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="w-full">Edit</Button>
                          <Button variant="default" className="w-full bg-wheelteal-600 hover:bg-wheelteal-700">
                            View Bookings
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Bookings tab */}
            <TabsContent value="bookings">
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Bookings</h1>
                
                <Tabs defaultValue="upcoming" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {bookings.filter(b => b.status === "upcoming").map((booking) => (
                            <div key={booking.id} className="flex flex-col md:flex-row md:items-center gap-4 border rounded-md p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                  <img 
                                    src={booking.image} 
                                    alt={booking.renter} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{booking.renter}</p>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Car className="h-3 w-3 mr-1" />
                                    <span>{booking.car}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="md:ml-auto flex flex-wrap items-center gap-x-6 gap-y-2">
                                <div className="text-sm">
                                  <span className="text-gray-500">Dates: </span>
                                  {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">Amount: </span>
                                  <span className="font-semibold">${booking.totalAmount}</span>
                                </div>
                                <Button size="sm" className="ml-auto bg-wheelteal-600 hover:bg-wheelteal-700">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="completed">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {bookings.filter(b => b.status === "completed").map((booking) => (
                            <div key={booking.id} className="flex flex-col md:flex-row md:items-center gap-4 border rounded-md p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                  <img 
                                    src={booking.image} 
                                    alt={booking.renter} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{booking.renter}</p>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Car className="h-3 w-3 mr-1" />
                                    <span>{booking.car}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="md:ml-auto flex flex-wrap items-center gap-x-6 gap-y-2">
                                <div className="text-sm">
                                  <span className="text-gray-500">Dates: </span>
                                  {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">Amount: </span>
                                  <span className="font-semibold">${booking.totalAmount}</span>
                                </div>
                                <Button size="sm" variant="outline" className="ml-auto">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="cancelled">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-10 text-gray-500">
                          No cancelled bookings
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            
            {/* Other tabs would be implemented similarly */}
            <TabsContent value="earnings">
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Earnings</h1>
                <Card>
                  <CardContent className="p-6 text-center py-10">
                    <p className="text-gray-500">Earnings details will be available soon</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="profile">
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Profile</h1>
                <Card>
                  <CardContent className="p-6 text-center py-10">
                    <p className="text-gray-500">Profile settings will be available soon</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
