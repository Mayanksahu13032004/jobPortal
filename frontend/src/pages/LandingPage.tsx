import { useNavigate } from "react-router-dom";
import { Building2, UserSearch, Briefcase, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero opacity-5" />
        
        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 animate-fade-in">
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl gradient-primary shadow-lg">
                <Briefcase className="w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 text-primary-foreground" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                JobConnect
              </h1>
            </div>

            {/* Headline */}
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 opacity-0 animate-fade-in leading-tight"
              style={{ animationDelay: "0.1s" }}
            >
              Find Your Perfect{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-employer">
                Match
              </span>
            </h2>

            {/* Subheadline */}
            <p 
              className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-2 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Whether you're hiring top talent or searching for your dream job, 
              we connect the right people with the right opportunities.
            </p>

            {/* Role Selection Cards */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto opacity-0 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              {/* Employer Card */}
              <button
                onClick={() => navigate("/employer/login")}
                className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-card border-2 border-border hover:border-employer transition-all duration-300 hover:shadow-xl text-left"
              >
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-employer/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-employer-light flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-employer" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">
                    I'm an Employer
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                    Post jobs, review candidates, and build your dream team.
                  </p>
                  <div className="flex items-center gap-2 text-employer font-semibold text-sm sm:text-base">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </button>

              {/* Job Seeker Card */}
              <button
                onClick={() => navigate("/jobseeker/login")}
                className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-card border-2 border-border hover:border-jobseeker transition-all duration-300 hover:shadow-xl text-left"
              >
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-jobseeker/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-jobseeker-light flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <UserSearch className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-jobseeker" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">
                    I'm a Job Seeker
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                    Discover opportunities and land your next great position.
                  </p>
                  <div className="flex items-center gap-2 text-jobseeker font-semibold text-sm sm:text-base">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: "10K+", label: "Jobs Posted" },
              { value: "50K+", label: "Job Seekers" },
              { value: "5K+", label: "Companies" },
              { value: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;