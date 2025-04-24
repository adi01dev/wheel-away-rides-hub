
import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Car, CalendarIcon, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const carCategories = [
  "Economy",
  "Compact",
  "Midsize",
  "SUV",
  "Van",
  "Luxury"
];

const AddCarForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [carData, setCarData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    category: "",
    price: "",
    location: "",
    description: "",
    features: "",
  });
  
  const [availableFrom, setAvailableFrom] = useState<Date | undefined>(new Date());
  const [availableTo, setAvailableTo] = useState<Date | undefined>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Default to 30 days from now
  
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [documents, setDocuments] = useState<{
    registration: File | null;
    insurance: File | null;
    puc: File | null;
  }>({
    registration: null,
    insurance: null,
    puc: null
  });
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCarData({
      ...carData,
      [name]: value
    });
  };
  
  const handleCategoryChange = (value: string) => {
    setCarData({
      ...carData,
      category: value
    });
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Create URLs for preview
      const newImageUrls = selectedFiles.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...selectedFiles]);
      setImageUrls(prev => [...prev, ...newImageUrls]);
    }
  };
  
  const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>, type: 'registration' | 'insurance' | 'puc') => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({
        ...documents,
        [type]: e.target.files[0]
      });
    }
  };
  
  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
    
    // Also remove from the preview URLs and revoke object URL to free memory
    const urlToRevoke = imageUrls[indexToRemove];
    URL.revokeObjectURL(urlToRevoke);
    setImageUrls(imageUrls.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (
      !carData.make ||
      !carData.model ||
      !carData.category ||
      !carData.price ||
      !carData.location ||
      !availableFrom ||
      !availableTo ||
      images.length === 0 ||
      !documents.registration ||
      !documents.insurance ||
      !documents.puc
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields and upload all required documents",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create form data to send files
      const formData = new FormData();
      formData.append('make', carData.make);
      formData.append('model', carData.model);
      formData.append('year', carData.year.toString());
      formData.append('category', carData.category);
      formData.append('price', carData.price);
      formData.append('location', carData.location);
      formData.append('description', carData.description);
      formData.append('features', JSON.stringify(carData.features.split(',').map(f => f.trim())));
      formData.append('availableFrom', availableFrom.toISOString());
      formData.append('availableTo', availableTo.toISOString());
      
      // Append car images
      images.forEach(image => {
        formData.append('images', image);
      });
      
      // Append documents
      if (documents.registration) {
        formData.append('registration', documents.registration);
      }
      
      if (documents.insurance) {
        formData.append('insurance', documents.insurance);
      }
      
      if (documents.puc) {
        formData.append('puc', documents.puc);
      }
      
      const token = localStorage.getItem('token');
      
      // Send request to add car
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cars`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast({
        title: "Success",
        description: "Car added successfully",
      });
      
      // Call success callback to refresh data
      onSuccess();
      
    } catch (error) {
      console.error('Error adding car:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add car",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Add New Car
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input 
                id="make" 
                name="make" 
                placeholder="e.g. Toyota" 
                value={carData.make}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input 
                id="model" 
                name="model" 
                placeholder="e.g. Camry" 
                value={carData.model}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input 
                id="year" 
                name="year" 
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                value={carData.year}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={carData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {carCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹ per day) *</Label>
              <Input 
                id="price" 
                name="price" 
                type="number"
                min="100"
                placeholder="₹ 1000" 
                value={carData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input 
                id="location" 
                name="location" 
                placeholder="e.g. Mumbai" 
                value={carData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Describe your car..." 
                value={carData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="features">Features (comma separated)</Label>
              <Input 
                id="features" 
                name="features" 
                placeholder="e.g. Air Conditioning, Bluetooth, GPS" 
                value={carData.features}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Available From *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {availableFrom ? format(availableFrom, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={availableFrom}
                    onSelect={setAvailableFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Available To *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {availableTo ? format(availableTo, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={availableTo}
                    onSelect={setAvailableTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="block mb-2">Car Images *</Label>
              <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                <Input 
                  id="images" 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => document.getElementById('images')?.click()}
                >
                  Upload Images
                </Button>
              </div>
            </div>
            
            {imageUrls.length > 0 && (
              <div>
                <Label className="block mb-2">Selected Images ({imageUrls.length})</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative rounded overflow-hidden h-24">
                      <img 
                        src={url} 
                        alt={`Upload ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Car Documents
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="registration">Registration Certificate *</Label>
                <Input 
                  id="registration" 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={(e) => handleDocumentChange(e, 'registration')}
                />
                {documents.registration && (
                  <p className="text-xs text-green-600 mt-1">
                    {documents.registration.name} selected
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Certificate *</Label>
                <Input 
                  id="insurance" 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={(e) => handleDocumentChange(e, 'insurance')}
                />
                {documents.insurance && (
                  <p className="text-xs text-green-600 mt-1">
                    {documents.insurance.name} selected
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="puc">PUC Certificate *</Label>
                <Input 
                  id="puc" 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={(e) => handleDocumentChange(e, 'puc')}
                />
                {documents.puc && (
                  <p className="text-xs text-green-600 mt-1">
                    {documents.puc.name} selected
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-wheelteal-600 hover:bg-wheelteal-700" disabled={isSubmitting}>
              {isSubmitting ? "Adding Car..." : "Add Car"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCarForm;
