
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLink from "./DashboardLink";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo section */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-6 w-6 text-wheelteal-700">🚗</span>
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
        </nav>

        {/* Authentication buttons */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <DashboardLink />
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
