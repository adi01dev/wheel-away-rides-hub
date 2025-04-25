
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface BookingSummary {
  id: string;
  type: 'self-drive' | 'ride-share';
  source?: string;
  destination?: string;
  startDate: Date;
  endDate?: Date;
  amount: number;
  car?: {
    make: string;
    model: string;
  };
}

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingSummary;
  onConfirm: () => void;
}

const BookingConfirmationDialog = ({
  isOpen,
  onClose,
  bookingDetails,
  onConfirm
}: BookingConfirmationDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Create order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: bookingDetails.id,
          amount: bookingDetails.amount
        })
      });
      
      if (!orderResponse.ok) throw new Error('Failed to create order');
      
      const orderData = await orderResponse.json();
      
      // Initialize Razorpay payment
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'WheelAway',
        description: `Booking ${bookingDetails.type === 'self-drive' ? 'Car Rental' : 'Ride Share'}`,
        handler: async function(response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              bookingId: bookingDetails.id,
              razorpayOrderId: orderData.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              amount: orderData.amount,
              paymentMethod: 'razorpay'
            })
          });
          
          if (verifyResponse.ok) {
            toast({
              title: "Payment Successful",
              description: "Your booking has been confirmed!",
            });
            onConfirm();
          } else {
            throw new Error('Payment verification failed');
          }
        },
        prefill: {
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail')
        },
        theme: {
          color: '#0D9488'
        }
      };
      
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Summary</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Booking Type</p>
              <p className="capitalize">{bookingDetails.type.replace('-', ' ')}</p>
            </div>
            
            {bookingDetails.car && (
              <div>
                <p className="text-sm font-medium text-gray-500">Vehicle</p>
                <p>{`${bookingDetails.car.make} ${bookingDetails.car.model}`}</p>
              </div>
            )}
            
            {bookingDetails.source && (
              <div>
                <p className="text-sm font-medium text-gray-500">From</p>
                <p>{bookingDetails.source}</p>
              </div>
            )}
            
            {bookingDetails.destination && (
              <div>
                <p className="text-sm font-medium text-gray-500">To</p>
                <p>{bookingDetails.destination}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p>{bookingDetails.startDate.toLocaleDateString()}</p>
            </div>
            
            {bookingDetails.endDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p>{bookingDetails.endDate.toLocaleDateString()}</p>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Total Amount</p>
              <p className="text-xl font-bold">₹{bookingDetails.amount}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="bg-wheelteal-600 hover:bg-wheelteal-700"
          >
            {isProcessing ? "Processing..." : "Proceed to Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationDialog;
