import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  LogOut,
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  User,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  name: string;
  email: string;
  role: string;
  companyRole?: string;
}

const EmployerHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from backend
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await apiFetch("/auth/me");

        if (res.user.role.toLowerCase() !== "employer") {
          navigate("/employer/login");
          return;
        }

        setUser(res.user);
      } catch (error) {
        navigate("/employer/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  // Logout
  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // even if logout API fails, continue
    }

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    navigate("/");
  };

  if (loading) return null;
  if (!user) return null;

  const stats = [
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: "12",
      color: "text-employer",
    },
    {
      icon: Users,
      label: "Total Applicants",
      value: "348",
      color: "text-primary",
    },
    {
      icon: FileText,
      label: "Pending Reviews",
      value: "24",
      color: "text-amber-500",
    },
    {
      icon: TrendingUp,
      label: "This Month",
      value: "+18%",
      color: "text-jobseeker",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-employer">
              <Building2 className="w-5 h-5 text-employer-foreground" />
            </div>
            <span className="text-lg font-bold">JobConnect</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/employer/profile")}
              className="
    hover:bg-employer
    hover:text-employer-foreground
    hover:shadow-md
  "
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/employer/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome, {user.name}
          </h1>
          <p className="text-muted-foreground">
            You are logged in as{" "}
            <span className="font-semibold text-employer">{user.role}</span>
            {user.companyRole && ` · ${user.companyRole}`}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="p-6 rounded-xl bg-card border hover:shadow-md animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <stat.icon className={`w-7 h-7 ${stat.color} mb-3`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-xl bg-card border animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="employer" size="sm">
              <Briefcase className="w-4 h-4 mr-2" />
              Post Job
            </Button>
            <Button variant="employer-outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Candidates
            </Button>
            <Button variant="secondary" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Applications
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerHome;
