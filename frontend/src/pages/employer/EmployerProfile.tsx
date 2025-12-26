import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  LogOut,
  User,
  Mail,
  Briefcase,
  Globe,
  Phone,
  Factory,
  ArrowLeft,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

interface User {
  name: string;
  email: string;
  role: string;
  companyRole?: string;
}

interface EmployerProfileData {
  companyName?: string;
  industry?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const EmployerProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<EmployerProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user + profile from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get logged-in user
        const meRes = await apiFetch("/auth/me");

        if (meRes.user.role.toLowerCase() !== "employer") {
          toast({
            title: "Access Denied",
            description: "This page is only accessible to Employers.",
            variant: "destructive",
          });
          navigate("/jobseeker/home");
          return;
        }

        setUser(meRes.user);

        // Get employer profile
        const profileRes = await apiFetch("/employer/profile/me");
        setProfile(profileRes);
      } catch (error) {
        navigate("/employer/login");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Logout
  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // ignore error, still logout
    }

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    navigate("/");
  };

  if (loading || !user) return null;

  const profileFields = [
    {
      icon: Building2,
      label: "Company Name",
      value: profile?.companyName || "Not set",
    },
    { icon: Factory, label: "Industry", value: profile?.industry || "Not set" },
    { icon: Globe, label: "Website", value: profile?.website || "Not set" },
    {
      icon: Mail,
      label: "Contact Email",
      value: profile?.contactEmail || user.email,
    },
    {
      icon: Phone,
      label: "Contact Phone",
      value: profile?.contactPhone || "Not set",
    },
  ];

  const isProfileComplete =
    profile?.companyName && profile?.industry && profile?.contactEmail;

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
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/employer/home")}
          className="mb-6 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Profile Header */}
        <div className="mb-8 animate-fade-in flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-employer-light flex items-center justify-center">
              <User className="w-8 h-8 text-employer" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">
                <span className="font-semibold text-employer">{user.role}</span>
                {user.companyRole && ` · ${user.companyRole}`}
              </p>
            </div>
          </div>

          <Button
            variant="employer"
            size="sm"
            onClick={() => navigate("/employer/profile/edit")}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isProfileComplete ? "Edit Profile" : "Complete Profile"}
          </Button>
        </div>

        {/* Incomplete Banner */}
        {!isProfileComplete && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-8 animate-fade-in">
            <p className="text-amber-600 dark:text-amber-400">
              <strong>Complete your profile</strong> to attract more candidates.
            </p>
          </div>
        )}

        {/* Company Info */}
        <div className="p-6 rounded-xl bg-card border animate-fade-in">
          <h2 className="text-lg font-semibold mb-6">Company Information</h2>
          <div className="grid gap-6">
            {profileFields.map((field) => (
              <div
                key={field.label}
                className="flex items-start gap-4 pb-4 border-b last:border-0"
              >
                <div className="p-2 rounded-lg bg-muted">
                  <field.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{field.label}</p>
                  <p
                    className={`font-medium ${
                      field.value === "Not set"
                        ? "italic text-muted-foreground/50"
                        : "text-foreground"
                    }`}
                  >
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="p-6 rounded-xl bg-card border mt-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-6">Account Information</h2>
          <div className="grid gap-6">
            <div className="flex items-start gap-4 pb-4 border-b">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Account Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium text-employer">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerProfile;
