
import { Button } from "@/components/ui/button";
import { User, LogIn, Car } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-wheelteal-700" />
            <span className="text-xl font-bold">WheelAway</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-wheelteal-600 transition-colors">
            Home
          </Link>
          <Link to="/cars" className="text-sm font-medium hover:text-wheelteal-600 transition-colors">
            Browse Cars
          </Link>
          <Link to="/become-host" className="text-sm font-medium hover:text-wheelteal-600 transition-colors">
            Become a Host
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="hidden md:flex items-center gap-2 bg-wheelteal-600 hover:bg-wheelteal-700">
              <User className="h-4 w-4" />
              <span>Sign Up</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
