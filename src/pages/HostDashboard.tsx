
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Car, IndianRupee, Calendar, Users, ChevronRight, PlusCircle, Shield, Upload, Edit, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import HostDocumentVerification from "@/components/host/HostDocumentVerification";
import CarDocumentVerification from "@/components/cars/CarDocumentVerification";
import { useToast } from "@/hooks/use-toast";
import AddCarForm from "@/components/host/AddCarForm";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

// Temporary mock data (will be replaced with actual data from API)
const initialHostData = {
  name: "Michael S.",
  email: "michael@example.com",
  phoneNumber: "+91 9876543210",
  address: "123 Main Street, Mumbai, Maharashtra",
  carsListed: 2,
  totalEarnings: 3456.78,
  totalTrips: 27,
  pendingBookings: 2,
  thisMonth: {
    earnings: 845.25,
    trips: 6
  },
  documents: {
    drivingLicense: {
      file: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=1374&auto=format&fit=crop",
      verified: true,
      verificationDate: "2023-10-15"
    },
    identityProof: {
      file: null,
      verified: false
    }
  }
};

const initialCarListings = [
  {
    id: 1,
    name: "Tesla Model 3",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1471&auto=format&fit=crop",
    price: 89,
    trips: 17,
    rating: 4.9,
    status: "active",
    documents: {
      registrationCertificate: {
        file: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1364&auto=format&fit=crop",
        verified: true,
        verificationDate: "2023-09-22"
      },
      insurance: {
        file: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1364&auto=format&fit=crop",
        verified: true,
        verificationDate: "2023-09-22"
      },
      pucCertificate: {
        file: null,
        verified: false
      }
    }
  },
  {
    id: 2,
    name: "BMW X5",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1470&auto=format&fit=crop",
    price: 115,
    trips: 10,
    rating: 4.8,
    status: "active",
    documents: {
      registrationCertificate: {
        file: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1364&auto=format&fit=crop",
        verified: true,
        verificationDate: "2023-08-15"
      },
      insurance: {
        file: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1364&auto=format&fit=crop",
        verified: true,
        verificationDate: "2023-08-15"
      },
      pucCertificate: {
        file: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1364&auto=format&fit=crop",
        verified: true,
        verificationDate: "2023-08-16"
      }
    }
  }
];

const initialBookings = [
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

// Sample earnings data for the chart
const generateEarningsData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, index) => ({
    month,
    earnings: index <= currentMonth 
      ? Math.round(Math.random() * 30000 + 15000) // Past months have real data 
      : null // Future months are null
  })).filter((item, index) => {
    // Only show last 6 months with data and current month
    return (index >= currentMonth - 5 && index <= currentMonth);
  });
};

const HostDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const { toast } = useToast();
  const [earningsData] = useState(generateEarningsData());
  
  const [hostData, setHostData] = useState(initialHostData);
  const [carListings, setCarListings] = useState(initialCarListings);
  const [bookings, setBookings] = useState(initialBookings);
  
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: hostData.name,
    email: hostData.email,
    phoneNumber: hostData.phoneNumber,
    address: hostData.address,
  });

  // In a real app, these functions would make API calls to get data
  useEffect(() => {
    // Fetch host data from API
    const fetchHostData = async () => {
      try {
        // const response = await axios.get('/api/host/profile');
        // setHostData(response.data);
        setHostData(initialHostData); // Using mock data for now
      } catch (error) {
        console.error("Error fetching host data:", error);
      }
    };
    
    // Fetch car listings from API
    const fetchCarListings = async () => {
      try {
        // const response = await axios.get('/api/host/cars');
        // setCarListings(response.data);
        setCarListings(initialCarListings); // Using mock data for now
      } catch (error) {
        console.error("Error fetching car listings:", error);
      }
    };
    
    // Fetch bookings from API
    const fetchBookings = async () => {
      try {
        // const response = await axios.get('/api/host/bookings');
        // setBookings(response.data);
        setBookings(initialBookings); // Using mock data for now
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    
    fetchHostData();
    fetchCarListings();
    fetchBookings();
  }, []);
  
  const handleUploadDocument = async (documentType: string, file: File) => {
    console.log(`Uploading ${documentType} document:`, file);
    
    // In a real app, this would make an API call to upload the document
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          file: URL.createObjectURL(file)
        });
      }, 1500);
    });
  };
  
  const handleVerifyDocument = async (documentType: string) => {
    console.log(`Verifying ${documentType} document`);
    
    // In a real app, this would make an API call to DigiLocker for verification
    return new Promise((resolve) => {
      setTimeout(() => {
        const digilockerWindow = window.open(
          "https://digilocker.gov.in", 
          "DigiLocker Authentication",
          "width=600,height=600"
        );
        
        setTimeout(() => {
          if (digilockerWindow) {
            digilockerWindow.close();
          }
          toast({
            title: "Verification Successful",
            description: "Your document has been verified through DigiLocker."
          });
          resolve({ success: true });
        }, 3000);
      }, 1000);
    });
  };
  
  const handleVerifyCarDocument = async (documentType: string) => {
    console.log(`Verifying car ${documentType} document`);
    return handleVerifyDocument(documentType);
  };
  
  const handleAddCarSuccess = () => {
    setIsAddCarDialogOpen(false);
    toast({
      title: "Success",
      description: "Car added successfully!"
    });
    
    // Refetch car listings
    // In a real app, this would make an API call
    // For now, we'll just add a mock car to the list
    const newCar = {
      id: carListings.length + 1,
      name: "New Car Added",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2970&auto=format&fit=crop",
      price: 95,
      trips: 0,
      rating: 0,
      status: "active",
      documents: {
        registrationCertificate: {
          file: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1364&auto=format&fit=crop",
          verified: false,
          verificationDate: null
        },
        insurance: {
          file: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1364&auto=format&fit=crop",
          verified: false,
          verificationDate: null
        },
        pucCertificate: {
          file: null,
          verified: false,
          verificationDate: null
        }
      }
    };
    
    setCarListings([...carListings, newCar]);
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would make an API call to update the profile
    try {
      // const response = await axios.put('/api/host/profile', profileData);
      // Update local state with the response data
      
      // For now, we'll just update the local state
      setHostData({
        ...hostData,
        name: profileData.name,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address
      });
      
      setIsEditingProfile(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
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
                variant={activeTab === "documents" ? "default" : "ghost"} 
                className={`w-full justify-start ${activeTab === "documents" ? "bg-wheelteal-600 hover:bg-wheelteal-700" : ""}`}
                onClick={() => setActiveTab("documents")}
              >
                <Shield className="mr-2 h-4 w-4" />
                Documents
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
        
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsContent value="dashboard">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <Button variant="outline" className="hidden md:flex">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(), "MMMM yyyy")}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Earnings</p>
                          <p className="text-2xl font-bold">₹{hostData.totalEarnings.toFixed(2)}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <IndianRupee className="h-6 w-6 text-green-600" />
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
                              <span className="mr-3">₹{car.price}/day</span>
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
                              <span className="text-sm font-semibold">₹{booking.totalAmount}</span>
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
            
            <TabsContent value="listings">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">My Cars</h1>
                  <Dialog open={isAddCarDialogOpen} onOpenChange={setIsAddCarDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-wheelteal-600 hover:bg-wheelteal-700">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Car
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add a new car</DialogTitle>
                      </DialogHeader>
                      <AddCarForm onSuccess={handleAddCarSuccess} />
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
                          <span className="mr-3">₹{car.price}/day</span>
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
                                  <span className="font-semibold">₹{booking.totalAmount}</span>
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
                                  <span className="font-semibold">₹{booking.totalAmount}</span>
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
            
            <TabsContent value="documents">
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Document Verification</h1>
                
                <Tabs defaultValue="personal" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="personal">Personal Documents</TabsTrigger>
                    <TabsTrigger value="cars">Car Documents</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal">
                    <HostDocumentVerification
                      drivingLicense={hostData.documents.drivingLicense}
                      identityProof={hostData.documents.identityProof}
                      onUpload={handleUploadDocument}
                      onVerify={handleVerifyDocument}
                    />
                  </TabsContent>
                  
                  <TabsContent value="cars">
                    {selectedCar !== null ? (
                      <div>
                        <Button 
                          variant="outline" 
                          className="mb-4"
                          onClick={() => setSelectedCar(null)}
                        >
                          ← Back to cars
                        </Button>
                        
                        <h2 className="text-xl font-semibold mb-4">{carListings[selectedCar].name} Documents</h2>
                        
                        <CarDocumentVerification
                          carId={carListings[selectedCar].id.toString()}
                          documents={carListings[selectedCar].documents}
                          onUpload={handleUploadDocument}
                          onVerify={handleVerifyCarDocument}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 mb-6">
                          Select a car to manage its documents. All cars require verified registration, 
                          insurance, and PUC certificates.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {carListings.map((car, index) => {
                            const totalDocs = 3; // RC, Insurance, PUC
                            const verifiedDocs = [
                              car.documents.registrationCertificate?.verified,
                              car.documents.insurance?.verified,
                              car.documents.pucCertificate?.verified
                            ].filter(Boolean).length;
                            
                            return (
                              <Card key={car.id} className="cursor-pointer hover:border-wheelteal-500 transition-colors"
                                    onClick={() => setSelectedCar(index)}>
                                <div className="flex gap-4 p-4">
                                  <div className="w-20 h-20 rounded overflow-hidden shrink-0">
                                    <img 
                                      src={car.image} 
                                      alt={car.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">{car.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-sm text-gray-500">{verifiedDocs} of {totalDocs} documents verified</span>
                                      <Badge className={verifiedDocs === totalDocs ? "bg-green-500" : "bg-amber-500"}>
                                        {verifiedDocs === totalDocs ? "Verified" : "Incomplete"}
                                      </Badge>
                                    </div>
                                    <div className="mt-2">
                                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-wheelteal-600 rounded-full" 
                                          style={{ width: `${(verifiedDocs/totalDocs) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            
            <TabsContent value="earnings">
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Earnings</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <IndianRupee className="h-5 w-5 mr-2 text-green-600" />
                        <span className="text-3xl font-bold">₹{hostData.totalEarnings.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <IndianRupee className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="text-3xl font-bold">₹{hostData.thisMonth.earnings.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{hostData.thisMonth.trips} trips completed</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Average Per Trip</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <IndianRupee className="h-5 w-5 mr-2 text-purple-600" />
                        <span className="text-3xl font-bold">
                          ₹{hostData.totalTrips > 0 ? (hostData.totalEarnings / hostData.totalTrips).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={earningsData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis 
                            tickFormatter={(value) => `₹${value/1000}k`}
                          />
                          <Tooltip 
                            formatter={(value) => [`₹${value}`, 'Earnings']}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="earnings" 
                            stroke="#10b981" 
                            strokeWidth={2} 
                            dot={{ r: 4 }} 
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left py-3 px-4 border-b">Month</th>
                            <th className="text-left py-3 px-4 border-b">Trips</th>
                            <th className="text-left py-3 px-4 border-b">Total Earnings</th>
                            <th className="text-left py-3 px-4 border-b">Average Per Trip</th>
                          </tr>
                        </thead>
                        <tbody>
                          {earningsData.map((item) => {
                            const tripsCount = Math.floor(Math.random() * 10) + 1;
                            const avgPerTrip = item.earnings ? item.earnings / tripsCount : 0;
                            
                            return (
                              <tr key={item.month} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b">{item.month}</td>
                                <td className="py-3 px-4 border-b">{tripsCount}</td>
                                <td className="py-3 px-4 border-b">₹{item.earnings ? item.earnings.toFixed(2) : '0.00'}</td>
                                <td className="py-3 px-4 border-b">₹{avgPerTrip.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6 text-center">
                  <Button className="bg-wheelteal-600 hover:bg-wheelteal-700">
                    Download Earnings Report
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="profile">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Profile</h1>
                  {!isEditingProfile && (
                    <Button 
                      onClick={() => setIsEditingProfile(true)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
                
                <Card>
                  <CardContent className="p-6">
                    {isEditingProfile ? (
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={profileData.name} 
                              onChange={handleProfileChange} 
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email" 
                              value={profileData.email} 
                              onChange={handleProfileChange} 
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input 
                              id="phoneNumber" 
                              name="phoneNumber" 
                              value={profileData.phoneNumber} 
                              onChange={handleProfileChange} 
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="profileImage">Profile Image</Label>
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-wheelteal-100 rounded-full flex items-center justify-center text-wheelteal-700 font-bold text-xl">
                                {profileData.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <Input 
                                id="profileImage" 
                                name="profileImage" 
                                type="file" 
                                className="flex-1" 
                              />
                            </div>
                          </div>
                          
                          <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea 
                              id="address" 
                              name="address" 
                              value={profileData.address} 
                              onChange={handleProfileChange} 
                              rows={3}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setIsEditingProfile(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-wheelteal-600 hover:bg-wheelteal-700"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/4 flex justify-center">
                            <div className="w-32 h-32 bg-wheelteal-100 rounded-full flex items-center justify-center text-wheelteal-700 font-bold text-4xl">
                              {hostData.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                          
                          <div className="md:w-3/4 space-y-4">
                            <div>
                              <h2 className="text-2xl font-semibold">{hostData.name}</h2>
                              <Badge className="mt-2">Host</Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-500" />
                                <span>{hostData.email}</span>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-500" />
                                <span>{hostData.phoneNumber}</span>
                              </div>
                              
                              <div className="flex items-center gap-3 md:col-span-2">
                                <MapPin className="h-5 w-5 text-gray-500" />
                                <span>{hostData.address}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="font-medium mb-4">Verification Status</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between border rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <Shield className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium">ID Verification</p>
                                  <p className="text-sm text-gray-500">Identity proof status</p>
                                </div>
                              </div>
                              <Badge className={hostData.documents.identityProof?.verified ? "bg-green-500" : "bg-amber-500"}>
                                {hostData.documents.identityProof?.verified ? "Verified" : "Pending"}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between border rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                  <Car className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium">Driving License</p>
                                  <p className="text-sm text-gray-500">License verification status</p>
                                </div>
                              </div>
                              <Badge className={hostData.documents.drivingLicense?.verified ? "bg-green-500" : "bg-amber-500"}>
                                {hostData.documents.drivingLicense?.verified ? "Verified" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
