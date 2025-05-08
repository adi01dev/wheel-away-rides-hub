
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const DashboardLink = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    navigate('/');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <Link to={userRole === 'host' ? "/host-dashboard" : userRole === 'admin' ? "/admin" : "/dashboard"}>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>
            {userRole === 'host' ? 'Host Dashboard' : 
             userRole === 'admin' ? 'Admin Panel' : 
             'Dashboard'}
          </span>
        </Button>
      </Link>
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

export default DashboardLink;
