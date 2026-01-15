import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserSearch, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "../../config.js";

const JobSeekerLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/jobseeker/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Login successful!",
          description: `Welcome back, ${data.user.name}`,
        });

        // Save JWT token and user info
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        navigate("/jobseeker/home");
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Check your credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Decorative Section */}
      <div className="lg:flex-1 gradient-jobseeker flex items-center justify-center p-8 sm:p-10 lg:p-12 min-h-[200px] sm:min-h-[250px] lg:min-h-0">
        <div className="max-w-md text-center text-jobseeker-foreground">
          <UserSearch className="w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 mx-auto mb-4 sm:mb-6 lg:mb-8 opacity-90" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">
            Your Next Opportunity Awaits
          </h2>
          <p className="text-sm sm:text-base lg:text-lg opacity-90 hidden sm:block">
            Discover thousands of jobs from top companies and take the next step
            in your career journey.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-20 py-8 sm:py-12 lg:py-0">
        <div className="w-full max-w-sm mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Back to home</span>
          </button>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-jobseeker-light">
                <UserSearch className="w-5 h-5 sm:w-6 sm:h-6 text-jobseeker" />
              </div>
              <span className="text-base sm:text-lg font-semibold text-foreground">
                Job Seeker Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
              Welcome back
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sign in to your account to continue your job search.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="jobseeker"
              size="lg"
              className="w-full h-11 sm:h-12 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-4 sm:mt-6 text-center text-sm sm:text-base text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/jobseeker/signup"
              className="text-jobseeker font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerLogin;
