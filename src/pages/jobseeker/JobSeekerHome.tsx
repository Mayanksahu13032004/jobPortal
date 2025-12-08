import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserSearch, LogOut, Search, Bookmark, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface User {
  name: string;
  email: string;
  role: string;
}

const JobSeekerHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/jobseeker/login");
      return;
    }
    
    const userData = JSON.parse(storedUser);
    if (userData.role !== "Job Seeker") {
      navigate("/jobseeker/login");
      return;
    }
    
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (!user) {
    return null;
  }

  const stats = [
    { icon: Search, label: "Jobs Viewed", value: "42", color: "text-jobseeker" },
    { icon: Send, label: "Applications Sent", value: "8", color: "text-primary" },
    { icon: Bookmark, label: "Saved Jobs", value: "15", color: "text-amber-500" },
    { icon: Clock, label: "Interviews", value: "3", color: "text-employer" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl gradient-jobseeker">
              <UserSearch className="w-4 h-4 sm:w-5 sm:h-5 text-jobseeker-foreground" />
            </div>
            <span className="text-base sm:text-lg font-bold text-foreground">JobConnect</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 md:mb-10 animate-fade-in">
          <div className="flex items-start sm:items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-jobseeker-light flex items-center justify-center flex-shrink-0">
              <UserSearch className="w-5 h-5 sm:w-6 sm:h-6 text-jobseeker" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                Welcome, {user.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                You are logged in as <span className="font-semibold text-jobseeker">{user.role}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl bg-card border border-border hover:shadow-md transition-shadow opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <stat.icon className={`w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 ${stat.color} mb-2 sm:mb-3`} />
              <div className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div 
          className="p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl bg-card border border-border opacity-0 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button variant="jobseeker" size="sm" className="text-xs sm:text-sm">
              <Search className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Search Jobs</span>
              <span className="sm:hidden">Search</span>
            </Button>
            <Button variant="jobseeker-outline" size="sm" className="text-xs sm:text-sm">
              <Bookmark className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Saved Jobs</span>
              <span className="sm:hidden">Saved</span>
            </Button>
            <Button variant="secondary" size="sm" className="text-xs sm:text-sm">
              <Send className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">My Applications</span>
              <span className="sm:hidden">Applications</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSeekerHome;