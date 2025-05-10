
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UserDashboardHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      <Button 
        size="sm" 
        className="flex items-center gap-2 bg-wheelteal-600 hover:bg-wheelteal-700"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>Log Out</span>
      </Button>
    </div>
  );
};

export default UserDashboardHeader;
