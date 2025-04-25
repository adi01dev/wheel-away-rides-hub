
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
import { User, Edit, Trash2 } from "lucide-react";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  profileImage?: string;
  digilockerVerified: boolean;
  createdAt: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users data",
        variant: "destructive",
      });
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/auth/verify-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: "Success",
        description: "User verified successfully",
      });
      
      fetchUsers(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify user",
        variant: "destructive",
      });
      console.error("Error verifying user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        
        fetchUsers(); // Refresh data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
        console.error("Error deleting user:", error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading users data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Users</h2>
        <Button onClick={fetchUsers} variant="outline">Refresh</Button>
      </div>
      
      <Table>
        <TableCaption>List of all users on the platform</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="flex items-center gap-2">
                  {user.profileImage ? (
                    <img 
                      src={`http://localhost:5000${user.profileImage}`} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                  ) : (
                    <User className="w-8 h-8 rounded-full bg-gray-200 p-1" />
                  )}
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'host' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                <TableCell>
                  {user.digilockerVerified ? 
                    <span className="text-green-600">Yes</span> : 
                    <span className="text-red-600">No</span>}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {!user.digilockerVerified && (
                      <Button 
                        onClick={() => handleVerifyUser(user._id)}
                        variant="ghost" 
                        size="sm"
                      >
                        Verify
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleDeleteUser(user._id)}
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
              <TableCell colSpan={7} className="text-center">No users found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsers;
