import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LottiePlayer from "../components/LottiePlayer";
import successAnimData from "../assets/animations/successAnimation.json";
import api from "../api";
import { 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Send,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch((err) => setMessage(err.response?.data?.message || "Could not load job details"));
  }, [id]);

  const apply = async () => {
    if (!user) return navigate("/login");
    if (user.role !== "jobseeker") {
      setIsSuccess(false);
      return setMessage("Only candidates with job seeker accounts can apply for open positions.");
    }

    setSubmitting(true);
    setMessage("");
    try {
      await api.post("/applications", { jobId: id });
      setIsSuccess(true);
      setMessage("Your application has been submitted successfully!");
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || "Application submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return "Competitive (As per Market Standards)";
    if (salary.includes("₹") || salary.includes("LPA")) return salary;
    return `₹${salary}`;
  };

  if (!job && !message) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
        <div className="user-avatar" style={{ margin: "0 auto 16px", width: 46, height: 46 }}>
          <Sparkles size={22} />
        </div>
        <p style={{ fontSize: 16 }}>Loading role specifications...</p>
      </div>
    );
  }

  if (!job && message) {
    return (
      <div className="card details-card" style={{ textAlign: "center" }}>
        <div className="error">
          <AlertCircle size={20} />
          <span>{message}</span>
        </div>
        <Link to="/jobs" className="button secondary">
          <ArrowLeft size={16} />
          <span>Back to All Jobs</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <Link to="/jobs" className="button secondary small-button" style={{ marginBottom: 20 }}>
        <ArrowLeft size={15} />
        <span>Back to All Jobs</span>
      </Link>

      <article className="card details-card">
        <div className="details-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div>
              <span className="tag" style={{ marginBottom: 10 }}>{job.jobType || "Full-time"}</span>
              <h2>{job.title}</h2>
              <h3 style={{ display: "flex", alignItems: "center", gap: 8, color: "#4f46e5" }}>
                <Building2 size={20} />
                <span>{job.company}</span>
              </h3>
            </div>
            <div className="company-badge" style={{ width: 60, height: 60, fontSize: 26 }}>
              {job.company ? job.company.charAt(0).toUpperCase() : "C"}
            </div>
          </div>
        </div>

        {/* Quick Highlights Grid with Rupee Symbol */}
        <div className="details-grid">
          <div className="detail-item-box">
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <MapPin size={14} color="#0284c7" /> Location
            </span>
            <p>{job.location}</p>
          </div>

          <div className="detail-item-box">
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#059669" }}>₹</span> CTC / Salary
            </span>
            <p style={{ color: "#059669" }}>{formatSalary(job.salary)}</p>
          </div>

          <div className="detail-item-box">
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={14} color="#d97706" /> Experience
            </span>
            <p>{job.experience || "Fresher / Not Specified"}</p>
          </div>
        </div>

        {/* Skills Requirements */}
        {job.skills && job.skills.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h4 className="details-section-title">Required Skills & Tech Stack</h4>
            <div className="skills-wrap">
              {job.skills.map((skill, idx) => (
                <span key={idx} className="skill-pill" style={{ padding: "6px 14px", fontSize: 13 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Description */}
        <div style={{ marginBottom: 30 }}>
          <h4 className="details-section-title">Role Overview & Responsibilities</h4>
          <p className="preline">{job.description}</p>
        </div>

        {/* Feedback Message */}
        {message && (
          <div className={isSuccess ? "success" : "error"} style={{ marginBottom: 20 }}>
            {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{message}</span>
          </div>
        )}

        {/* Success Animation if Applied */}
        {isSuccess && (
          <div style={{ width: 140, height: 140, margin: "0 auto 20px" }}>
            <LottiePlayer animationData={successAnimData} loop={false} />
          </div>
        )}

        {/* Action Button */}
        <div className="actions" style={{ marginTop: 10 }}>
          {user?.role === "jobseeker" || !user ? (
            <button 
              className="button" 
              onClick={apply} 
              disabled={submitting || isSuccess}
              style={{ minWidth: 170 }}
            >
              <Send size={16} />
              <span>{submitting ? "Submitting..." : isSuccess ? "Applied Successfully!" : "Apply for Role"}</span>
            </button>
          ) : (
            <Link className="button" to="/recruiter">
              <span>Go to Recruiter Dashboard</span>
            </Link>
          )}

          {isSuccess && (
            <Link to="/applications" className="button secondary">
              <span>View My Applications</span>
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
