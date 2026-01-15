import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, IndianRupee, ArrowLeft } from "lucide-react";
import axios from "axios";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
}

const JobSeekerJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (filters: any = {}) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/jobs/search", {
        params: filters,
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = () => {
    const filters: any = {};
    if (keyword) filters.keyword = keyword;
    if (location) filters.location = location;
    if (minSalary) filters.minSalary = minSalary;
    if (maxSalary) filters.maxSalary = maxSalary;

    fetchJobs(filters);
  };

  const handleClear = () => {
    setKeyword("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        {/*  Back Button */}
        <button
          onClick={() => navigate("/jobseeker/home")}
          className="flex items-center gap-2 mb-4 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Job Listings</h1>

        {/* Search Filters */}
        <div className="grid gap-4 sm:grid-cols-4 mb-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Keyword..."
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location..."
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />

          <input
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            placeholder="Min Salary"
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />

          <input
            type="number"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            placeholder="Max Salary"
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Clear
          </button>
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="flex justify-center mt-10">
            <p>Loading jobs...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="p-5 rounded-xl bg-card border border-border hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/jobseeker/jobs/${job._id}`)}
              >
                <h2 className="text-lg font-semibold mb-2">{job.title}</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  {job.description}
                </p>

                <div className="flex items-center gap-3 text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    <span>
                      {job.salaryMin.toLocaleString()} –{" "}
                      {job.salaryMax.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {jobs.length === 0 && (
              <p className="text-center text-muted-foreground mt-8">
                No jobs found.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobSeekerJobs;
