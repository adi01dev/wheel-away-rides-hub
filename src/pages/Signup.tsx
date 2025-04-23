
import AuthForm from "@/components/auth/AuthForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm defaultTab="signup" />
    </div>
  );
};

export default Signup;
