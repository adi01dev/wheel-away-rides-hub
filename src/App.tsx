
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import CarListing from "./pages/CarListing";
import CarDetail from "./pages/CarDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BecomeHost from "./pages/BecomeHost";
import HostDashboard from "./pages/HostDashboard";
import BookingConfirmation from "./pages/BookingConfirmation";
import RideSharing from "./pages/RideSharing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/cars" element={<CarListing />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/become-host" element={<BecomeHost />} />
            <Route path="/host-dashboard" element={<HostDashboard />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/ride-sharing" element={<RideSharing />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
