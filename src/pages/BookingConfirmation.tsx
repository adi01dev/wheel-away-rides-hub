
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const BookingConfirmation = () => {
  const [bookingDetails, setBookingDetails] = useState({
    id: "BOK-" + Math.floor(100000 + Math.random() * 900000),
    car: "Tesla Model 3",
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    endDate: new Date(Date.now() + (24 * 60 * 60 * 1000 * 5)), // 5 days later
    location: "San Francisco",
    totalAmount: 445
  });

  // In a real app, you'd fetch the booking details from an API

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600">
                Your car rental booking has been successful. Below are your booking details.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <div className="text-sm text-gray-500 mb-1">Booking Reference</div>
                <div className="font-semibold">{bookingDetails.id}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Car</div>
                  <div className="font-semibold">{bookingDetails.car}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div className="font-semibold">{bookingDetails.location}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Pick-up Date</div>
                  <div className="font-semibold">
                    {bookingDetails.startDate.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Return Date</div>
                  <div className="font-semibold">
                    {bookingDetails.endDate.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div className="text-gray-500">Total Amount</div>
                  <div className="text-xl font-bold">${bookingDetails.totalAmount}</div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-blue-50">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Important:</span> Please bring your driver's license, credit card, and a valid ID for the vehicle pickup.
                </p>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <Button asChild className="w-full bg-wheelteal-600 hover:bg-wheelteal-700">
                <Link to="/">Return to Home</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="#">Download Receipt</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmation;
