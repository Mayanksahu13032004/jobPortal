import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  FileText,
  LogOut,
  UserSearch,
  ArrowLeft,
  MapPin,
  Briefcase,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRef } from "react";

interface UserData {
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  skills?: string;
  experience?: string;
}

const JobSeekerProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  // Profile completion fields
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // useEffect(() => {
  //   const storedUser = sessionStorage.getItem("user");
  //   if (!storedUser) {
  //     navigate("/jobseeker/login");
  //     return;
  //   }

  //   const userData = JSON.parse(storedUser);
  //   if (userData.role !== "jobseeker") {
  //     navigate("/jobseeker/login");
  //     return;
  //   }

  //   setUser(userData);
  //   setPhone(userData.phone || "");
  // }, [navigate]);
  
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/jobseeker/login");
      return;
    }

    const userData = JSON.parse(storedUser);

    if (userData.role !== "jobseeker") {
      navigate("/jobseeker/login");
      return;
    }

    setUser(userData);

    fetch("http://localhost:5000/api/jobseeker/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((profile) => {
        if (!profile) return;

        setPhone(profile.phone || "");
        setLocation(profile.location || "");
        setSkills(profile.skills?.join(", ") || "");
        setExperience(profile.experience?.toString() || "");
        setResumeName(
          profile.resumeUrl ? profile.resumeUrl.split("/").pop() : null
        );
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Unable to load profile",
          variant: "destructive",
        });
      });
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Only PDF resumes are allowed",
        variant: "destructive",
      });
      return;
    }

    setResumeFile(file);
    setResumeName(file.name);

    toast({
      title: "Resume selected",
      description: "Resume ready to upload",
    });
  };
  // const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   if (file.type !== "application/pdf") {
  //     toast({
  //       title: "Invalid file",
  //       description: "Please upload a PDF resume only.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setResumeName(file.name);
  //   toast({
  //     title: "Resume uploaded",
  //     description: "Your resume has been uploaded successfully.",
  //   });
  // };
  /// const handleSaveProfile = () => {
  //   toast({
  //     title: "Profile updated",
  //     description: "Your profile details have been saved successfully.",
  ///   });
  // };
  const handleSaveProfile = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("location", location);
    formData.append("skills", skills);
    formData.append("experience", experience);

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      const res = await fetch("http://localhost:5000/api/jobseeker/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast({
        title: "Profile Saved",
        description: "Your profile details have been saved successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-jobseeker">
              <UserSearch className="w-5 h-5 text-jobseeker-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              JobConnect
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
          My Profile
        </h1>
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/jobseeker/home")}
          className="mb-6 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid gap-6">
          {/* Personal Info */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-jobseeker" />
                <span>{user.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-jobseeker" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {/* Contact & Profile Details */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold mb-4">Profile Details</h2>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 text-muted-foreground">
                  Phone
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full border border-border rounded-md px-3 py-2 bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-muted-foreground">
                  Location
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="w-full border border-border rounded-md px-3 py-2 bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-muted-foreground">
                  Skills
                </label>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <input
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, Node.js, SQL"
                    className="w-full border border-border rounded-md px-3 py-2 bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-muted-foreground">
                  Experience
                </label>
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 mt-2 text-primary" />
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Briefly describe your experience"
                    rows={3}
                    className="w-full border border-border rounded-md px-3 py-2 bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resume */}

          <div className="p-5 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold mb-4">Resume</h2>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-jobseeker" />
                <span>{resumeName || "No resume uploaded"}</span>
              </div>

              {/* hidden input */}
              <input
                ref={resumeInputRef}
                type="file"
                accept="application/pdf"
                hidden
                onChange={handleResumeUpload}
              />

              {/* button triggers input */}
              <Button
                variant="jobseeker-outline"
                size="sm"
                onClick={() => resumeInputRef.current?.click()}
              >
                {resumeName ? "Replace Resume" : "Upload Resume"}
              </Button>
            </div>
          </div>

          {/* Save */}
          <Button
            variant="jobseeker"
            onClick={handleSaveProfile}
            className="w-fit"
          >
            Save Profile
          </Button>
        </div>
      </main>
    </div>
  );
};

export default JobSeekerProfile;
