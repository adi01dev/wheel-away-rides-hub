
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Car, User, Users } from "lucide-react";

interface AuthFormProps {
  defaultTab?: 'signin' | 'signup';
}

const AuthForm = ({ defaultTab = 'signin' }: AuthFormProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [userType, setUserType] = useState<'renter' | 'host'>('renter');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    // This would normally validate and send authentication request
    toast({
      title: "Success!",
      description: "You have successfully signed in.",
    });
    
    // Redirect based on user type
    if (userType === 'host') {
      navigate('/host-dashboard');
    } else {
      navigate('/');
    }
  };
  
  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault();
    // This would normally validate and create a new user
    toast({
      title: "Account created!",
      description: "Welcome to WheelAway! Your account has been created successfully.",
    });
    
    // Redirect based on user type
    if (userType === 'host') {
      navigate('/host-dashboard');
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className="max-w-md w-full mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to WheelAway</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={userType === 'renter' ? 'default' : 'outline'}
                className={`flex items-center gap-2 ${userType === 'renter' ? 'bg-wheelteal-600 hover:bg-wheelteal-700' : ''}`}
                onClick={() => setUserType('renter')}
              >
                <User className="h-4 w-4" />
                <span>I'm a Renter</span>
              </Button>
              <Button
                type="button"
                variant={userType === 'host' ? 'default' : 'outline'}
                className={`flex items-center gap-2 ${userType === 'host' ? 'bg-wheelteal-600 hover:bg-wheelteal-700' : ''}`}
                onClick={() => setUserType('host')}
              >
                <Car className="h-4 w-4" />
                <span>I'm a Host</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue={defaultTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="you@example.com" type="email" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="/forgot-password" className="text-xs text-wheelteal-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full bg-wheelteal-600 hover:bg-wheelteal-700">
                  Sign In
                </Button>
              </form>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or continue with</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button variant="outline" type="button" className="flex items-center gap-2">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    <span>Google</span>
                  </Button>
                  <Button variant="outline" type="button" className="flex items-center gap-2">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10s-10 4.477-10 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54v-2.203c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fill="currentColor"/>
                    </svg>
                    <span>Facebook</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                  <Input id="email" placeholder="you@example.com" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" required />
                </div>
                <Button type="submit" className="w-full bg-wheelteal-600 hover:bg-wheelteal-700">
                  Create Account
                </Button>
              </form>
              <div className="mt-6">
                <p className="text-center text-sm text-muted-foreground">
                  By creating an account, you agree to our{' '}
                  <a href="/terms" className="underline underline-offset-4 hover:text-wheelteal-600">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="underline underline-offset-4 hover:text-wheelteal-600">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
