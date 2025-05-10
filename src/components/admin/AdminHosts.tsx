
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
import { User, Trash2 } from "lucide-react";

interface HostData {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  documents: {
    drivingLicense: {
      file: string;
      verified: boolean;
    };
    identityProof: {
      file: string;
      verified: boolean;
    };
  };
  digilockerVerified: boolean;
  createdAt: string;
  carCount?: number;
}

const AdminHosts = () => {
  const [hosts, setHosts] = useState<HostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHosts();
  }, []);

  const fetchHosts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/hosts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHosts(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hosts data",
        variant: "destructive",
      });
      console.error("Error fetching hosts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyHost = async (hostId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/auth/verify-host/${hostId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: "Success",
        description: "Host verified successfully",
      });
      
      fetchHosts(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify host",
        variant: "destructive",
      });
      console.error("Error verifying host:", error);
    }
  };

  const handleDeleteHost = async (hostId: string) => {
    if (window.confirm("Are you sure you want to delete this host?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/auth/user/${hostId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast({
          title: "Success",
          description: "Host deleted successfully",
        });
        
        fetchHosts(); // Refresh data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete host",
          variant: "destructive",
        });
        console.error("Error deleting host:", error);
      }
    }
  };

  const handleViewDocuments = (host: HostData) => {
    toast({
      title: "View Documents",
      description: "Document viewer would open here",
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading hosts data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Hosts</h2>
        <Button onClick={fetchHosts} variant="outline">Refresh</Button>
      </div>
      
      <Table>
        <TableCaption>List of all hosts on the platform</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Host</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cars</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hosts.length > 0 ? (
            hosts.map((host) => (
              <TableRow key={host._id}>
                <TableCell className="flex items-center gap-2">
                  {host.profileImage ? (
                    <img 
                      src={`http://localhost:5000${host.profileImage}`} 
                      alt={host.name} 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                  ) : (
                    <User className="w-8 h-8 rounded-full bg-gray-200 p-1" />
                  )}
                  {host.name}
                </TableCell>
                <TableCell>
                  <div>{host.email}</div>
                  <div className="text-sm text-gray-500">{host.phoneNumber || "No phone"}</div>
                </TableCell>
                <TableCell>
                  <Button 
                    onClick={() => handleViewDocuments(host)} 
                    variant="outline" 
                    size="sm"
                  >
                    View Documents
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={host.digilockerVerified ? "default" : "outline"}
                    className={host.digilockerVerified ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                  >
                    {host.digilockerVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {host.carCount || 0}
                </TableCell>
                <TableCell>
                  {new Date(host.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {!host.digilockerVerified && (
                      <Button 
                        onClick={() => handleVerifyHost(host._id)}
                        variant="ghost" 
                        size="sm"
                      >
                        Verify
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleDeleteHost(host._id)}
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
              <TableCell colSpan={7} className="text-center">No hosts found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminHosts;
