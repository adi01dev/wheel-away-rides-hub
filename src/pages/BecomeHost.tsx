
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Car, Upload, CheckCircle } from "lucide-react";

const BecomeHost = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    // Handle final submission
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Application submitted!",
        description: "We've received your host application. Our team will review it shortly."
      });
      setStep(4); // Show success step
    }, 1500);
  };
  
  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-wheeldark-800 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1470&auto=format&fit=crop')"
            }}
          ></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Earn Money Sharing Your Car</h1>
            <p className="text-xl mb-8">
              Turn your car into a second income by listing it on WheelAway. 
              Our hosts earn an average of $700 per month with minimal effort.
            </p>
            <Button 
              size="lg" 
              className="bg-wheelteal-600 hover:bg-wheelteal-700"
              onClick={() => window.scrollTo({ top: document.getElementById('host-form')?.offsetTop || 0, behavior: 'smooth' })}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>
      
      {/* Benefits section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Host with WheelAway?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-wheelteal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-wheelteal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Extra Income</h3>
              <p className="text-gray-600">
                Set your own availability and pricing. Your car earns money when you're not using it.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-wheelteal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-wheelteal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Insurance Coverage</h3>
              <p className="text-gray-600">
                Rest easy with our $1 million insurance policy that covers every trip.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-wheelteal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-wheelteal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Support</h3>
              <p className="text-gray-600">
                Get 24/7 customer support and roadside assistance for you and your guests.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Steps section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm relative">
              <div className="bg-wheelteal-600 text-white w-8 h-8 rounded-full flex items-center justify-center absolute -top-4 left-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">List your car</h3>
              <p className="text-gray-600 mb-4">
                Create your listing with photos, availability, and pricing. It's free and takes just minutes.
              </p>
            </div>
            
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm relative">
              <div className="bg-wheelteal-600 text-white w-8 h-8 rounded-full flex items-center justify-center absolute -top-4 left-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">Get bookings</h3>
              <p className="text-gray-600 mb-4">
                Once approved, travelers can book your car. You'll get notified instantly.
              </p>
            </div>
            
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm relative">
              <div className="bg-wheelteal-600 text-white w-8 h-8 rounded-full flex items-center justify-center absolute -top-4 left-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">Get paid</h3>
              <p className="text-gray-600 mb-4">
                You'll earn money each time your car is booked. Payments are direct deposited.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Application form */}
      <section id="host-form" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Become a WheelAway Host</h2>
            <p className="text-center text-gray-600 mb-8">
              Fill out the form below to get started with hosting your car
            </p>
            
            <Card>
              <CardContent className="p-6">
                {step === 1 && (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Step 1: Tell us about yourself</h3>
                          <span className="text-sm text-gray-500">Step 1 of 3</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-wheelteal-600 rounded-full" style={{ width: '33.3%' }}></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" required />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" required />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input id="zip" required />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-wheelteal-600 hover:bg-wheelteal-700">
                        Continue
                      </Button>
                    </div>
                  </form>
                )}
                
                {step === 2 && (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Step 2: Vehicle Information</h3>
                          <span className="text-sm text-gray-500">Step 2 of 3</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-wheelteal-600 rounded-full" style={{ width: '66.6%' }}></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="year">Year</Label>
                          <Input id="year" type="number" min="1990" max="2025" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="make">Make</Label>
                          <Input id="make" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Model</Label>
                          <Input id="model" required />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="color">Color</Label>
                          <Input id="color" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="licensePlate">License Plate</Label>
                          <Input id="licensePlate" required />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="seats">Number of Seats</Label>
                          <Select defaultValue="5">
                            <SelectTrigger id="seats">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8+">8+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transmission">Transmission</Label>
                          <Select defaultValue="automatic">
                            <SelectTrigger id="transmission">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="automatic">Automatic</SelectItem>
                              <SelectItem value="manual">Manual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="carType">Car Type</Label>
                        <Select defaultValue="sedan">
                          <SelectTrigger id="carType">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedan">Sedan</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="convertible">Convertible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-between gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-wheelteal-600 hover:bg-wheelteal-700"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
                
                {step === 3 && (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Step 3: Additional Details</h3>
                          <span className="text-sm text-gray-500">Step 3 of 3</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-wheelteal-600 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Vehicle Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Tell potential renters about your car's features, condition, and what makes it special."
                          className="min-h-[120px]"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="photos">Vehicle Photos</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Upload photos of your vehicle</p>
                          <p className="text-xs text-gray-400 mb-4">Drag and drop files or click to browse</p>
                          <Input 
                            id="photos" 
                            type="file" 
                            multiple 
                            accept="image/*"
                            className="hidden"
                          />
                          <Button 
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("photos")?.click()}
                          >
                            Choose Files
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Daily Rate ($)</Label>
                        <Input 
                          id="price" 
                          type="number" 
                          min="10"
                          placeholder="How much would you like to charge per day?"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Our hosts typically charge between $35-$150 per day depending on the vehicle
                        </p>
                      </div>
                      
                      <div className="flex justify-between gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setStep(2)}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="flex-1 bg-wheelteal-600 hover:bg-wheelteal-700"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
                
                {step === 4 && (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Application Submitted!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for applying to be a WheelAway host. Our team will review your application 
                      and get back to you within 24-48 hours.
                    </p>
                    <div>
                      <Button 
                        className="bg-wheelteal-600 hover:bg-wheelteal-700"
                        onClick={() => window.location.href = '/'}
                      >
                        Return to Home
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeHost;
