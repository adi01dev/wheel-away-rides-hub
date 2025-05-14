
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

interface AuthFormProps {
  defaultTab?: 'signin' | 'signup';
}

const AuthForm = ({ defaultTab = 'signin' }: AuthFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [userType, setUserType] = useState<'renter' | 'host'>('renter');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSignIn = async (event: React.FormEvent) => {
  event.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);
    
    if (!response.ok) {
      toast({
        title: "Login failed",
        description: data.message || "Invalid credentials",
      });
      return;
    }

    localStorage.setItem("token", data.token);

    toast({
      title: "Success!",
      description: "You have successfully signed in.",
    });

    navigate(userType === "host" ? "/host-dashboard" : "/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    toast({
      title: "Login failed",
      description: "An error occurred during sign in.",
    });
  }
};
  



  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }
  const formData = {
    
    name ,
    email ,
    password ,
    role : userType === 'host' ? 'host' : 'user' 
  };

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      toast({ title: 'Signup failed', description: data.message || 'Error creating account' });
      return;
    }

    localStorage.setItem('token', data.token);

    toast({
      title: 'Account created!',
      description: 'Welcome to WheelAway! Your account has been created successfully.',
    });

    navigate(userType === 'host' ? '/host-dashboard' : '/dashboard');
  } catch (err) {
    console.error(err);
    toast({ title: 'Signup failed', description: 'Something went wrong.' });
  }
};

  




  const handleGoogleSignIn = () => {
    toast({
      title: "Google Sign In",
      description: "Signing in with Google...",
    });
    
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify({ 
      role: userType,
      name: 'Demo User',
      email: 'demo@example.com'
    }));
    
    if (userType === 'host') {
      navigate('/host-dashboard');
    } else {
      navigate('/dashboard');
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
                <span>I'm a Renter</span>
              </Button>
              <Button
                type="button"
                variant={userType === 'host' ? 'default' : 'outline'}
                className={`flex items-center gap-2 ${userType === 'host' ? 'bg-wheelteal-600 hover:bg-wheelteal-700' : ''}`}
                onClick={() => setUserType('host')}
              >
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
                  <Input id="email" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="/forgot-password" className="text-xs text-wheelteal-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleGoogleSignIn}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign in with Google</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  
                    <Label htmlFor="firstName">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-wheelteal-600 hover:bg-wheelteal-700">
                  Create Account
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
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleGoogleSignIn}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign up with Google</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
