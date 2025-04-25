
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Route, Car, Trash2 } from "lucide-react";

interface RideData {
  _id: string;
  driver: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  source: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  price: number;
  status: string;
  car?: {
    make: string;
    model: string;
  };
  passengers: Array<{
    user: {
      _id: string;
      name: string;
    };
    status: string;
  }>;
  createdAt: string;
}

const AdminRides = () => {
  const [rides, setRides] = useState<RideData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/rideshares/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRides(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rides data",
        variant: "destructive",
      });
      console.error("Error fetching rides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRide = async (rideId: string) => {
    if (window.confirm("Are you sure you want to cancel this ride?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:5000/api/rideshares/${rideId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast({
          title: "Success",
          description: "Ride cancelled successfully",
        });
        
        fetchRides(); // Refresh data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel ride",
          variant: "destructive",
        });
        console.error("Error cancelling ride:", error);
      }
    }
  };

  const handleDeleteRide = async (rideId: string) => {
    if (window.confirm("Are you sure you want to delete this ride?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/rideshares/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast({
          title: "Success",
          description: "Ride deleted successfully",
        });
        
        fetchRides(); // Refresh data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete ride",
          variant: "destructive",
        });
        console.error("Error deleting ride:", error);
      }
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading rides data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Rides</h2>
        <Button onClick={fetchRides} variant="outline">Refresh</Button>
      </div>
      
      <Table>
        <TableCaption>List of all rides on the platform</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Route</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Departure</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Passengers</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rides.length > 0 ? (
            rides.map((ride) => (
              <TableRow key={ride._id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Route className="w-5 h-5 text-wheelteal-700" />
                    <div>
                      <div className="font-medium">{ride.source}</div>
                      <div className="text-sm text-gray-500">to {ride.destination}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{ride.driver?.name || "Unknown"}</TableCell>
                <TableCell>{formatDateTime(ride.departureTime)}</TableCell>
                <TableCell>₹{ride.price}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      ride.status === 'scheduled' ? "bg-blue-100 text-blue-800" :
                      ride.status === 'in-progress' ? "bg-yellow-100 text-yellow-800" :
                      ride.status === 'completed' ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }
                  >
                    {ride.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {ride.passengers.length} / {ride.availableSeats}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {ride.status === 'scheduled' && (
                      <Button 
                        onClick={() => handleCancelRide(ride._id)}
                        variant="ghost" 
                        size="sm" 
                        className="text-yellow-600"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleDeleteRide(ride._id)}
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No rides found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminRides;
