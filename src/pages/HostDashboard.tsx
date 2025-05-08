
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddCarForm from "@/components/host/AddCarForm";
import HostDocumentVerification from "@/components/host/HostDocumentVerification";
import HostDashboardHeader from "@/components/host/HostDashboardHeader";
import { useEffect, useState } from "react";

const HostDashboard = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostData = async () => {
      try {
        setCars([
          { id: 1, make: 'Toyota', model: 'Corolla', status: 'available' },
          { id: 2, make: 'Honda', model: 'Civic', status: 'booked' }
        ]);
        
        setBookings([
          { id: 101, car: 'Honda Civic', renter: 'John Doe', startDate: '2023-04-28', endDate: '2023-04-30', status: 'confirmed' },
          { id: 102, car: 'Toyota Corolla', renter: 'Jane Smith', startDate: '2023-05-05', endDate: '2023-05-07', status: 'pending' }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching host data:", error);
        setLoading(false);
      }
    };
    
    fetchHostData();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <HostDashboardHeader />
      
      <Tabs defaultValue="cars" className="w-full">
        <TabsList>
          <TabsTrigger value="cars">My Cars</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="add-car">Add Car</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="cars">
          <Card>
            <CardHeader>
              <CardTitle>My Cars</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading cars...</p>
              ) : cars.length > 0 ? (
                <div className="grid gap-4">
                  {cars.map((car: any) => (
                    <div key={car.id} className="border p-4 rounded-lg">
                      <h3 className="font-medium">{car.make} {car.model}</h3>
                      <p className="text-sm text-gray-500">Status: <span className={`font-medium ${car.status === 'available' ? 'text-green-600' : 'text-amber-600'}`}>{car.status}</span></p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No cars added yet. Navigate to the "Add Car" tab to list your first car.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading bookings...</p>
              ) : bookings.length > 0 ? (
                <div className="grid gap-4">
                  {bookings.map((booking: any) => (
                    <div key={booking.id} className="border p-4 rounded-lg">
                      <h3 className="font-medium">{booking.car}</h3>
                      <p className="text-sm">Rented by: {booking.renter}</p>
                      <p className="text-sm">Dates: {booking.startDate} to {booking.endDate}</p>
                      <p className="text-sm">Status: <span className={`font-medium ${booking.status === 'confirmed' ? 'text-green-600' : 'text-amber-600'}`}>{booking.status}</span></p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No bookings yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-car">
          <Card>
            <CardHeader>
              <CardTitle>Add a New Car</CardTitle>
            </CardHeader>
            <CardContent>
              <AddCarForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <HostDocumentVerification />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="border p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">This Month</p>
                      <p className="text-2xl font-bold">$1,240</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Month</p>
                      <p className="text-2xl font-bold">$980</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Earnings</p>
                      <p className="text-2xl font-bold">$4,680</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
                  <div className="space-y-2">
                    <div className="border p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">Toyota Corolla Rental</p>
                        <p className="text-sm text-gray-500">April 15-17, 2023</p>
                      </div>
                      <p className="text-lg font-bold">$240</p>
                    </div>
                    <div className="border p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">Honda Civic Rental</p>
                        <p className="text-sm text-gray-500">April 10-14, 2023</p>
                      </div>
                      <p className="text-lg font-bold">$400</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HostDashboard;
