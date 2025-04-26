
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Car } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Check if user is logged in from localStorage
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

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo section */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-wheelteal-700" />
            <span className="text-xl font-bold">WheelAway</span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-wheelteal-600 transition-colors">
            Home
          </Link>
          <Link to="/cars" className="text-sm font-medium hover:text-wheelteal-600 transition-colors">
            Browse Cars
          </Link>
          <Link to="/ride-sharing" className="text-sm font-medium hover:text-wheelteal-600 transition-colors">
            Ride Sharing
          </Link>
          <Link to="/become-host" className="text-sm font-medium hover:text-wheelteal-600 transition-colors">
            Become a Host
          </Link>
          {isLoggedIn && userRole === 'admin' && (
            <Link to="/admin" className="text-sm font-medium hover:text-wheelteal-600 transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Authentication buttons */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to={userRole === 'host' ? "/host-dashboard" : userRole === 'admin' ? "/admin" : "/dashboard"}>
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>
                    {userRole === 'host' ? 'Host Dashboard' : 
                     userRole === 'admin' ? 'Admin Panel' : 
                     'Dashboard'}
                  </span>
                </Button>
              </Link>
              <Button 
                size="sm" 
                className="hidden md:flex items-center gap-2 bg-wheelteal-600 hover:bg-wheelteal-700"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </>
          ) : isHomePage && (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Log In</span>
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="hidden md:flex items-center gap-2 bg-wheelteal-600 hover:bg-wheelteal-700">
                  <LogIn className="h-4 w-4" />
                  <span>Sign Up</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
