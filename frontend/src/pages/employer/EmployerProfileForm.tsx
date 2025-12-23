import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

interface User {
  name: string;
  email: string;
  role: string;
  companyRole?: string;
}

interface FormData {
  companyName: string;
  industry: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
}

interface FormErrors {
  companyName?: string;
  industry?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const EmployerProfileForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    industry: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Load user + existing profile (LOGIC FIXED)
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1️⃣ AUTH CHECK (ONLY THIS CAN REDIRECT)
        const meRes = await apiFetch("/auth/me");

        if (!meRes.user || meRes.user.role.toLowerCase() !== "employer") {
          navigate("/employer/login");
          return;
        }

        setUser(meRes.user);

        // LOAD PROFILE
        try {
          const profileRes = await apiFetch("/employer/profile/me");

          setFormData({
            companyName: profileRes.companyName || "",
            industry: profileRes.industry || "",
            website: profileRes.website || "",
            contactEmail: profileRes.contactEmail || meRes.user.email,
            contactPhone: profileRes.contactPhone || "",
          });
        } catch {
          //New employer – profile not created yet
          setFormData((prev) => ({
            ...prev,
            contactEmail: meRes.user.email,
          }));
        }
      } catch {
        navigate("/employer/login");
      } finally {
        setLoadingPage(false);
      }
    };

    loadData();
  }, [navigate]);

  // Logout
  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {}

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    navigate("/");
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }

    if (formData.website.trim()) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
      if (!urlPattern.test(formData.website)) {
        newErrors.website = "Please enter a valid website URL";
      }
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    }

    if (formData.contactPhone.trim()) {
      const phonePattern = /^[\d\s\-\+\(\)]{10,20}$/;
      if (!phonePattern.test(formData.contactPhone)) {
        newErrors.contactPhone = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SAVE PROFILE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await apiFetch("/employer/profile", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast({
        title: "Profile Saved",
        description: "Company profile updated successfully.",
      });

      navigate("/employer/profile");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (loadingPage || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-employer">
              <Building2 className="w-5 h-5 text-employer-foreground" />
            </div>
            <span className="font-bold text-lg">JobConnect</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto max-w-2xl px-6 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/employer/profile")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Company Name *</Label>
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={errors.companyName ? "border-destructive" : ""}
            />
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName}</p>
            )}
          </div>

          <div>
            <Label>Industry *</Label>
            <Input
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={errors.industry ? "border-destructive" : ""}
            />
          </div>

          <div>
            <Label>Website</Label>
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Contact Email *</Label>
            <Input
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Contact Phone</Label>
            <Input
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            variant="employer"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default EmployerProfileForm;
