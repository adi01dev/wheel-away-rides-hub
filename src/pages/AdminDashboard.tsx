
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminHosts from "@/components/admin/AdminHosts";
import AdminCars from "@/components/admin/AdminCars";
import AdminRides from "@/components/admin/AdminRides";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'admin') {
      // Redirect to home if not admin
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="hosts">Hosts</TabsTrigger>
          <TabsTrigger value="cars">Cars</TabsTrigger>
          <TabsTrigger value="rides">Rides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-4">
          <AdminUsers />
        </TabsContent>
        
        <TabsContent value="hosts" className="mt-4">
          <AdminHosts />
        </TabsContent>
        
        <TabsContent value="cars" className="mt-4">
          <AdminCars />
        </TabsContent>
        
        <TabsContent value="rides" className="mt-4">
          <AdminRides />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
