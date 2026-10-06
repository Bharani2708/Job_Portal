import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LottiePlayer from "../components/LottiePlayer";
import emptyAnimData from "../assets/animations/emptyAnimation.json";
import heroAnimData from "../assets/animations/heroAnimation.json";
import api from "../api";
import { 
  PlusCircle, 
  Trash2, 
  ExternalLink, 
  MapPin, 
  Briefcase, 
  AlertCircle, 
  Sparkles, 
  Users, 
  Video, 
  Award, 
  CheckCircle2, 
  TrendingUp,
  ArrowRight
} from "lucide-react";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get("/jobs/mine"),
        api.get("/applications/recruiter")
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load recruiter dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const removeJob = async (id) => {
    if (!window.confirm("Are you sure you want to remove this job posting?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  // Metrics
  const totalJobs = jobs.length;
  const totalApplicants = applications.length;
  const inInterviews = applications.filter((a) => a.status === "Technical Interview" || a.status === "HR Interview").length;
  const offersAndHires = applications.filter((a) => a.status === "Offer Released" || a.status === "Accepted").length;

  const getApplicantCountForJob = (jobId) => {
    return applications.filter((a) => a.job?._id === jobId || a.job === jobId).length;
  };

  return (
    <section>
      {/* Welcome Banner */}
      <div 
        className="card" 
        style={{ 
          marginBottom: 28, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 243, 255, 0.9))",
          border: "1px solid rgba(124, 58, 237, 0.2)"
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <div className="hero-pill-badge" style={{ marginBottom: 10, background: "#f3e8ff", borderColor: "#d8b4fe", color: "#7e22ce" }}>
            <Sparkles size={14} />
            <span>Recruiter Talent Command Center</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 30, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>
            Hiring & Candidate Management
          </h2>
          <p style={{ color: "#475569", fontSize: 15.5, lineHeight: 1.6 }}>
            Track your open tech positions, review candidate test submissions, schedule video interviews, and release formal offer letters.
          </p>
        </div>

        <div className="actions" style={{ gap: 12 }}>
          <Link className="button" to="/create-job">
            <PlusCircle size={18} />
            <span>Post New Job</span>
          </Link>
          <Link className="button secondary" to="/recruiter/applications">
            <Users size={18} />
            <span>Hiring Pipeline</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Counter Grid */}
      <div className="dashboard-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16, marginBottom: 30 }}>
        <div className="card stat-card-mini">
          <div className="stat-card-icon bg-purple">
            <Briefcase size={22} color="#7e22ce" />
          </div>
          <div>
            <span className="stat-card-label">Active Job Postings</span>
            <strong className="stat-card-value">{totalJobs}</strong>
          </div>
        </div>

        <div className="card stat-card-mini">
          <div className="stat-card-icon bg-blue">
            <Users size={22} color="#0284c7" />
          </div>
          <div>
            <span className="stat-card-label">Total Applicants</span>
            <strong className="stat-card-value">{totalApplicants}</strong>
          </div>
        </div>

        <div className="card stat-card-mini">
          <div className="stat-card-icon bg-cyan">
            <Video size={22} color="#06b6d4" />
          </div>
          <div>
            <span className="stat-card-label">Interviews Scheduled</span>
            <strong className="stat-card-value">{inInterviews}</strong>
          </div>
        </div>

        <div className="card stat-card-mini">
          <div className="stat-card-icon bg-emerald">
            <Award size={22} color="#10b981" />
          </div>
          <div>
            <span className="stat-card-label">Offers & Hires</span>
            <strong className="stat-card-value">{offersAndHires}</strong>
          </div>
        </div>
      </div>

      {/* Posted Jobs Grid */}
      <div className="page-heading row-between" style={{ marginTop: 20 }}>
        <div>
          <h3>My Active Job Postings ({jobs.length})</h3>
          <p>Manage postings and view applicants per role.</p>
        </div>
        <Link to="/create-job" className="button small-button">
          <PlusCircle size={15} />
          <span>Create Posting</span>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
          <Sparkles size={24} style={{ margin: "0 auto 10px" }} />
          <p>Loading your jobs & applicant numbers...</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {jobs.map((job) => {
              const appCount = getApplicantCountForJob(job._id);
              return (
                <article className="card job-card" key={job._id}>
                  <div>
                    <div className="job-card-header">
                      <div className="company-badge">
                        {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                      </div>
                      <span className="tag tag-cyan">
                        {appCount} {appCount === 1 ? "Applicant" : "Applicants"}
                      </span>
                    </div>

                    <h3>{job.title}</h3>
                    <div className="job-meta-row">
                      <span className="meta-item">
                        <Briefcase size={14} color="#0284c7" />
                        <strong>{job.company}</strong>
                      </span>
                      <span className="meta-item">
                        <MapPin size={14} color="#64748b" />
                        {job.location}
                      </span>
                    </div>

                    {job.salary && (
                      <div className="job-meta-row">
                        <span className="meta-item" style={{ color: "#059669", fontWeight: 700 }}>
                          ₹ {job.salary.replace("₹", "")}
                        </span>
                      </div>
                    )}

                    {job.skills && job.skills.length > 0 && (
                      <div className="skills-wrap" style={{ marginTop: 10 }}>
                        {job.skills.map((skill, idx) => (
                          <span key={idx} className="skill-pill">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="actions" style={{ marginTop: 20 }}>
                    <Link className="button" style={{ flex: 1 }} to="/recruiter/applications">
                      <Users size={15} />
                      <span>Pipeline ({appCount})</span>
                    </Link>
                    <button className="danger" onClick={() => removeJob(job._id)} title="Delete Job">
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {jobs.length === 0 && (
            <div className="empty-state">
              <div style={{ width: 160, height: 160, margin: "0 auto" }}>
                <LottiePlayer animationData={emptyAnimData} loop={true} />
              </div>
              <h3>No Job Openings Posted Yet</h3>
              <p>Post your company's tech openings to start receiving verified Indian engineer profiles.</p>
              <Link className="button" to="/create-job">
                <PlusCircle size={18} />
                <span>Post Your First Job</span>
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
