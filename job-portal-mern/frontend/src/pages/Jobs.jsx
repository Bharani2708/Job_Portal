import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LottiePlayer from "../components/LottiePlayer";
import emptyAnimData from "../assets/animations/emptyAnimation.json";
import api from "../api";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Sparkles, 
  SlidersHorizontal,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "");
  const [error, setError] = useState("");

  const loadJobs = async (overrideParams) => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      const s = overrideParams?.search ?? search;
      const l = overrideParams?.location ?? location;
      const t = overrideParams?.jobType ?? jobType;

      if (s) params.search = s;
      if (l) params.location = l;
      if (t) params.jobType = t;

      const { data } = await api.get("/jobs", { params });
      setJobs(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const qSearch = searchParams.get("search") || "";
    const qLocation = searchParams.get("location") || "";
    const qJobType = searchParams.get("jobType") || "";

    setSearch(qSearch);
    setLocation(qLocation);
    setJobType(qJobType);

    loadJobs({ search: qSearch, location: qLocation, jobType: qJobType });
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const newParams = {};
    if (search) newParams.search = search;
    if (location) newParams.location = location;
    if (jobType) newParams.jobType = jobType;
    setSearchParams(newParams);
    loadJobs();
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setSearchParams({});
    loadJobs({ search: "", location: "", jobType: "" });
  };

  const getTagColorClass = (type) => {
    switch (type?.toLowerCase()) {
      case "full-time":
        return "tag-cyan";
      case "part-time":
        return "tag-amber";
      case "internship":
        return "tag-rose";
      default:
        return "tag-emerald";
    }
  };

  // Helper to format salary with Indian Rupee symbol
  const formatSalary = (salary) => {
    if (!salary) return "";
    if (salary.includes("₹") || salary.includes("LPA")) return salary;
    return `₹${salary}`;
  };

  return (
    <section>
      <div className="page-heading">
        <div className="row-between">
          <div>
            <h2>Explore Tech Opportunities</h2>
            <p>Discover verified tech, product, and engineering roles across Bangalore, Hyderabad, Pune, Chennai, and Remote.</p>
          </div>
          {(search || location || jobType) && (
            <button className="button secondary small-button" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Light Glassmorphic Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="filter-bar">
        <div className="input-with-icon">
          <Search size={18} className="input-icon" />
          <input
            placeholder="Search role, skills, or company (e.g. React, Zoho, TCS)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="input-with-icon">
          <MapPin size={18} className="input-icon" />
          <input
            placeholder="Location (e.g. Bangalore, Chennai, Remote)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="input-with-icon">
          <SlidersHorizontal size={18} className="input-icon" />
          <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <button className="button" type="submit">
          <Search size={16} />
          <span>Search</span>
        </button>
      </form>

      {error && (
        <div className="error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "70px 0", color: "#64748b" }}>
          <div className="user-avatar" style={{ margin: "0 auto 16px", width: 46, height: 46 }}>
            <Sparkles size={22} />
          </div>
          <p style={{ fontSize: 16 }}>Discovering matched job opportunities in India...</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {jobs.map((job) => (
              <article className="card job-card" key={job._id}>
                <div>
                  <div className="job-card-header">
                    <div className="company-badge">
                      {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                    </div>
                    <span className={`tag ${getTagColorClass(job.jobType)}`}>
                      {job.jobType || "Full-time"}
                    </span>
                  </div>

                  <h3>{job.title}</h3>
                  <div className="job-meta-row">
                    <span className="meta-item">
                      <Briefcase size={15} color="#4f46e5" />
                      <strong>{job.company}</strong>
                    </span>
                    <span className="meta-item">
                      <MapPin size={15} color="#0284c7" />
                      {job.location}
                    </span>
                  </div>

                  <div className="job-meta-row">
                    {job.salary && (
                      <span className="meta-item" style={{ color: "#059669", fontWeight: 700 }}>
                        <span style={{ fontSize: 16, fontWeight: 800 }}>₹</span>
                        {formatSalary(job.salary).replace("₹", "")}
                      </span>
                    )}
                    {job.experience && (
                      <span className="meta-item">
                        <Clock size={15} color="#d97706" />
                        {job.experience}
                      </span>
                    )}
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="skills-wrap">
                      {job.skills.map((skill, idx) => (
                        <span key={idx} className="skill-pill">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 20 }}>
                  <Link className="button" style={{ width: "100%" }} to={`/jobs/${job._id}`}>
                    <span>View Role Details</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="empty-state">
              <div style={{ width: 170, height: 170, margin: "0 auto" }}>
                <LottiePlayer animationData={emptyAnimData} loop={true} />
              </div>
              <h3>No Opportunities Found</h3>
              <p>Try refining your search keywords or location filters (e.g. Bangalore, React, Chennai) to explore more openings.</p>
              <button className="button secondary small-button" onClick={clearFilters}>
                Reset All Filters
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
