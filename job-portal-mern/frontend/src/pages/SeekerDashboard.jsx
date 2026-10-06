import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LottiePlayer from "../components/LottiePlayer";
import heroAnimData from "../assets/animations/heroAnimation.json";
import emptyAnimData from "../assets/animations/emptyAnimation.json";
import api from "../api";
import { 
  Search, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  MapPin, 
  Clock, 
  Award, 
  Video, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FileCode,
  Calendar
} from "lucide-react";

export default function SeekerDashboard() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/applications/mine")
      .then(({ data }) => setApplications(data))
      .catch((err) => setError(err.response?.data?.message || "Could not load application statistics"))
      .finally(() => setLoading(false));
  }, []);

  // Compute metrics
  const totalApplied = applications.length;
  const inAssessments = applications.filter((a) => a.status === "Online Assessment").length;
  const inInterviews = applications.filter((a) => a.status === "Technical Interview" || a.status === "HR Interview").length;
  const offersReceived = applications.filter((a) => a.status === "Offer Released" || a.status === "Accepted").length;

  const getStageBadge = (status) => {
    switch (status) {
      case "Accepted":
        return <span className="tag tag-emerald">🎉 Hired / Accepted</span>;
      case "Offer Released":
        return <span className="tag" style={{ background: "rgba(168, 85, 247, 0.12)", color: "#7e22ce", borderColor: "rgba(168, 85, 247, 0.3)" }}>🎁 Offer Released</span>;
      case "Technical Interview":
        return <span className="tag tag-cyan">💻 Tech Round</span>;
      case "HR Interview":
        return <span className="tag" style={{ background: "rgba(236, 72, 153, 0.12)", color: "#db2777" }}>🤝 HR Round</span>;
      case "Online Assessment":
        return <span className="tag tag-blue">📝 Assessment</span>;
      case "Rejected":
        return <span className="tag tag-rose">❌ Closed</span>;
      default:
        return <span className="tag">📨 Applied</span>;
    }
  };

  const getNextActionText = (item) => {
    switch (item.status) {
      case "Online Assessment":
        return item.stageDetails?.assessment?.deadline 
          ? `Assessment due by ${new Date(item.stageDetails.assessment.deadline).toLocaleDateString("en-IN")}`
          : "Coding test link available";
      case "Technical Interview":
        return item.stageDetails?.technicalInterview?.scheduledAt
          ? `Interview: ${new Date(item.stageDetails.technicalInterview.scheduledAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
          : "Meeting link ready";
      case "HR Interview":
        return item.stageDetails?.hrInterview?.scheduledAt
          ? `HR Call: ${new Date(item.stageDetails.hrInterview.scheduledAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
          : "HR discussion scheduled";
      case "Offer Released":
        return `🎉 Review Offer Letter (₹ ${item.stageDetails?.offer?.ctc || '—'} LPA)`;
      case "Accepted":
        return "Offer signed! Awaiting onboarding details.";
      case "Rejected":
        return "Application closed.";
      default:
        return "Under review by recruitment team.";
    }
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
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 249, 255, 0.9))",
          border: "1px solid rgba(2, 132, 199, 0.2)"
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <div className="hero-pill-badge" style={{ marginBottom: 10 }}>
            <Sparkles size={14} />
            <span>Job Seeker Career Portal</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 30, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>
            Welcome back, {user?.name || "Candidate"}!
          </h2>
          <p style={{ color: "#475569", fontSize: 15.5, lineHeight: 1.6 }}>
            Track the status of your applications, prepare for scheduled technical and HR interviews, and review your job offers.
          </p>
        </div>

        <div style={{ width: 120, height: 120 }}>
          <LottiePlayer animationData={heroAnimData} loop={true} />
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
          <div className="stat-card-icon bg-blue">
            <Briefcase size={22} color="#0284c7" />
          </div>
          <div>
            <span className="stat-card-label">Total Applied</span>
            <strong className="stat-card-value">{totalApplied}</strong>
          </div>
        </div>

        <div className="card stat-card-mini">
          <div className="stat-card-icon bg-cyan">
            <FileCode size={22} color="#06b6d4" />
          </div>
          <div>
            <span className="stat-card-label">In Assessments</span>
            <strong className="stat-card-value">{inAssessments}</strong>
          </div>
        </div>

        <div className="card stat-card-mini">
          <div className="stat-card-icon bg-purple">
            <Video size={22} color="#9333ea" />
          </div>
          <div>
            <span className="stat-card-label">Interview Rounds</span>
            <strong className="stat-card-value">{inInterviews}</strong>
          </div>
        </div>

        <div className="card stat-card-mini">
          <div className="stat-card-icon bg-emerald">
            <Award size={22} color="#10b981" />
          </div>
          <div>
            <span className="stat-card-label">Offers Received</span>
            <strong className="stat-card-value">{offersReceived}</strong>
          </div>
        </div>
      </div>

      {/* Applications Pipeline Breakdown & Direct Navigation List */}
      <div className="card" style={{ padding: "24px 28px", marginBottom: 30 }}>
        <div className="row-between" style={{ marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, color: "#0f172a" }}>
              My Applications & Active Pipeline
            </h3>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>
              Click on any applied job to open its full step-by-step progress tracker and meeting links.
            </p>
          </div>
          <Link to="/jobs" className="button small-button">
            <Search size={15} />
            <span>Find More Tech Jobs</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
            <Sparkles size={24} style={{ margin: "0 auto 10px" }} />
            <p>Loading your active pipeline...</p>
          </div>
        ) : applications.length > 0 ? (
          <div className="seeker-apps-list" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {applications.map((item) => (
              <div 
                key={item._id}
                className="seeker-app-row-card"
                onClick={() => navigate(`/applications?appId=${item._id}`)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 22px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="company-badge" style={{ width: 44, height: 44, fontSize: 18 }}>
                    {item.job?.company ? item.job.company.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <h4 style={{ margin: 0, fontSize: 16, color: "#0f172a", fontWeight: 700 }}>
                        {item.job?.title || "Software Engineer"}
                      </h4>
                      {getStageBadge(item.status)}
                    </div>
                    <div className="job-meta-row" style={{ marginTop: 4 }}>
                      <span className="meta-item">
                        <Briefcase size={13} color="#0284c7" />
                        <strong>{item.job?.company}</strong>
                      </span>
                      <span className="meta-item">
                        <MapPin size={13} color="#64748b" />
                        {item.job?.location}
                      </span>
                      {item.job?.salary && (
                        <span className="meta-item" style={{ color: "#059669", fontWeight: 700 }}>
                          ₹ {item.job.salary.replace("₹", "")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16, textAlign: "right" }}>
                  <div style={{ display: "none", md: "block" }}>
                    <span style={{ fontSize: 11, textTransform: "uppercase", color: "#94a3b8", fontWeight: 700, letterSpacing: 0.5, display: "block" }}>
                      Next Action / Note
                    </span>
                    <strong style={{ fontSize: 13, color: "#334155" }}>
                      {getNextActionText(item)}
                    </strong>
                  </div>
                  <div className="button secondary small-button" style={{ padding: "6px 14px" }}>
                    <span>Track Progress</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: "40px 20px" }}>
            <div style={{ width: 140, height: 140, margin: "0 auto" }}>
              <LottiePlayer animationData={emptyAnimData} loop={true} />
            </div>
            <h4 style={{ fontSize: 18, marginTop: 12 }}>No Job Applications Submitted Yet</h4>
            <p style={{ fontSize: 14, color: "#64748b", margin: "6px 0 16px" }}>
              Apply to high-paying Indian tech roles across Bangalore, Hyderabad, Pune, and remote teams.
            </p>
            <Link to="/jobs" className="button">
              <Search size={15} />
              <span>Explore Tech Jobs in India</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
