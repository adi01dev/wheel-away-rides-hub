
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const UserBookings = () => {
  const downloadReceipt = (bookingId: string) => {
    // Here you would normally generate and download the receipt
    console.log("Downloading receipt for booking:", bookingId);
  };

  return (
    <Tabs defaultValue="current">
      <TabsList>
        <TabsTrigger value="current">Current Bookings</TabsTrigger>
        <TabsTrigger value="history">Booking History</TabsTrigger>
      </TabsList>

      <TabsContent value="current">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Tesla Model 3</TableCell>
              <TableCell>Apr 24 - Apr 26</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>$240</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => downloadReceipt("123")}>
                  <Download className="h-4 w-4 mr-2" />
                  Receipt
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="history">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>BMW X5</TableCell>
              <TableCell>Mar 15 - Mar 17</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>$320</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => downloadReceipt("456")}>
                  <Download className="h-4 w-4 mr-2" />
                  Receipt
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
};

export default UserBookings;
