
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
import { Car, CheckCircle, XCircle, Trash2 } from "lucide-react";

interface CarData {
  _id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  location: string;
  images: string[];
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  isVerified: boolean;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
}

const AdminCars = () => {
  const [cars, setCars] = useState<CarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/cars/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCars(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cars data",
        variant: "destructive",
      });
      console.error("Error fetching cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCar = async (carId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/cars/${carId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: "Success",
        description: "Car verified successfully",
      });
      
      fetchCars(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify car",
        variant: "destructive",
      });
      console.error("Error verifying car:", error);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/cars/${carId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast({
          title: "Success",
          description: "Car deleted successfully",
        });
        
        fetchCars(); // Refresh data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete car",
          variant: "destructive",
        });
        console.error("Error deleting car:", error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading cars data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Cars</h2>
        <Button onClick={fetchCars} variant="outline">Refresh</Button>
      </div>
      
      <Table>
        <TableCaption>List of all cars on the platform</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Car</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.length > 0 ? (
            cars.map((car) => (
              <TableRow key={car._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {car.images && car.images.length > 0 ? (
                      <img 
                        src={`http://localhost:5000${car.images[0]}`} 
                        alt={`${car.make} ${car.model}`} 
                        className="w-16 h-12 rounded-md object-cover" 
                      />
                    ) : (
                      <Car className="w-16 h-12 rounded-md bg-gray-200 p-2" />
                    )}
                    <div>
                      <div className="font-medium">{car.make} {car.model}</div>
                      <div className="text-sm text-gray-500">{car.year} • {car.category}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{car.owner?.name || "Unknown"}</TableCell>
                <TableCell>₹{car.price}/day</TableCell>
                <TableCell>{car.location}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={car.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {car.isVerified ? "Verified" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {car.ratings.count > 0 ? (
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span>{car.ratings.average.toFixed(1)}</span>
                      <span className="text-gray-400 text-xs ml-1">({car.ratings.count})</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No ratings</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {!car.isVerified && (
                      <Button 
                        onClick={() => handleVerifyCar(car._id)}
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600"
                      >
                        <CheckCircle size={16} />
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleDeleteCar(car._id)}
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
              <TableCell colSpan={7} className="text-center">No cars found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCars;
