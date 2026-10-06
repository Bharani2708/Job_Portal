import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LottiePlayer from "../components/LottiePlayer";
import emptyAnimData from "../assets/animations/emptyAnimation.json";
import api from "../api";
import { 
  Users, 
  Mail, 
  Briefcase, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  Video,
  FileCheck,
  Send,
  X,
  Award,
  Filter,
  ArrowUpRight
} from "lucide-react";

const STAGES = [
  "Applied",
  "Online Assessment",
  "Technical Interview",
  "HR Interview",
  "Offer Released",
  "Accepted",
  "Rejected"
];

export default function RecruiterApplications() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [activeApp, setActiveApp] = useState(null);
  const [modalStage, setModalStage] = useState("Online Assessment");
  const [modalNote, setModalNote] = useState("");
  const [stageForm, setStageForm] = useState({
    assessment: { link: "", deadline: "", platform: "HackerRank / LeetCode", instructions: "" },
    technicalInterview: { scheduledAt: "", meetingLink: "", interviewer: "", notes: "" },
    hrInterview: { scheduledAt: "", meetingLink: "", interviewer: "", notes: "" },
    offer: { ctc: "", baseSalary: "", joiningDate: "", offerLetterNotes: "" }
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/applications/recruiter")
      .then(({ data }) => {
        setItems(data);
        setFilteredItems(data);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load candidate pipeline"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Filter effect
  useEffect(() => {
    if (selectedFilter === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.status === selectedFilter));
    }
  }, [selectedFilter, items]);

  const openStageModal = (app) => {
    setActiveApp(app);
    setModalStage(app.status === "Applied" ? "Online Assessment" : app.status);
    setModalNote("");
    setStageForm({
      assessment: {
        link: app.stageDetails?.assessment?.link || "",
        deadline: app.stageDetails?.assessment?.deadline ? app.stageDetails.assessment.deadline.substring(0, 16) : "",
        platform: app.stageDetails?.assessment?.platform || "HackerRank",
        instructions: app.stageDetails?.assessment?.instructions || ""
      },
      technicalInterview: {
        scheduledAt: app.stageDetails?.technicalInterview?.scheduledAt ? app.stageDetails.technicalInterview.scheduledAt.substring(0, 16) : "",
        meetingLink: app.stageDetails?.technicalInterview?.meetingLink || "",
        interviewer: app.stageDetails?.technicalInterview?.interviewer || "",
        notes: app.stageDetails?.technicalInterview?.notes || ""
      },
      hrInterview: {
        scheduledAt: app.stageDetails?.hrInterview?.scheduledAt ? app.stageDetails.hrInterview.scheduledAt.substring(0, 16) : "",
        meetingLink: app.stageDetails?.hrInterview?.meetingLink || "",
        interviewer: app.stageDetails?.hrInterview?.interviewer || "",
        notes: app.stageDetails?.hrInterview?.notes || ""
      },
      offer: {
        ctc: app.stageDetails?.offer?.ctc || "",
        baseSalary: app.stageDetails?.offer?.baseSalary || "",
        joiningDate: app.stageDetails?.offer?.joiningDate ? app.stageDetails.offer.joiningDate.substring(0, 10) : "",
        offerLetterNotes: app.stageDetails?.offer?.offerLetterNotes || ""
      }
    });
  };

  const handleUpdateStage = async (e) => {
    e.preventDefault();
    if (!activeApp) return;

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        stage: modalStage,
        note: modalNote,
        stageDetails: stageForm
      };

      const { data } = await api.patch(`/applications/${activeApp._id}/stage`, payload);
      setSuccessMsg(`Candidate moved to "${modalStage}" successfully! Notification & email dispatched.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setActiveApp(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update hiring stage.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStageBadge = (status) => {
    switch (status) {
      case "Accepted":
        return <span className="tag tag-emerald">🎉 Offer Accepted</span>;
      case "Offer Released":
        return <span className="tag" style={{ background: "rgba(168, 85, 247, 0.12)", color: "#7e22ce", borderColor: "rgba(168, 85, 247, 0.3)" }}>📄 Offer Released</span>;
      case "Technical Interview":
        return <span className="tag tag-cyan">💻 Tech Round</span>;
      case "HR Interview":
        return <span className="tag" style={{ background: "rgba(236, 72, 153, 0.12)", color: "#db2777", borderColor: "rgba(236, 72, 153, 0.3)" }}>🤝 HR Round</span>;
      case "Online Assessment":
        return <span className="tag tag-blue">📝 Assessment</span>;
      case "Rejected":
        return <span className="tag tag-rose">❌ Rejected</span>;
      default:
        return <span className="tag">📨 Applied</span>;
    }
  };

  return (
    <section>
      <div className="page-heading row-between">
        <div>
          <h2>Candidate Hiring Pipeline</h2>
          <p>Manage candidate stages from Online Assessment to Technical & HR Interviews and releasing Offer Letters.</p>
        </div>
        <Link to="/recruiter" className="button secondary small-button">
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {error && (
        <div className="error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="success">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pipeline Stage Filter Pills */}
      <div className="pipeline-filter-bar">
        <div className="filter-pill-item">
          <Filter size={14} color="#64748b" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>Filter by Stage:</span>
        </div>
        {["All", ...STAGES].map((stg) => {
          const count = stg === "All" ? items.length : items.filter((i) => i.status === stg).length;
          return (
            <button
              key={stg}
              className={`pipeline-filter-pill ${selectedFilter === stg ? "active" : ""}`}
              onClick={() => setSelectedFilter(stg)}
            >
              <span>{stg}</span>
              <span className="pill-count">{count}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "70px 0", color: "#64748b" }}>
          <div className="user-avatar" style={{ margin: "0 auto 16px", width: 46, height: 46 }}>
            <Sparkles size={22} />
          </div>
          <p style={{ fontSize: 16 }}>Loading candidates...</p>
        </div>
      ) : (
        <>
          {filteredItems.length > 0 ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Target Role</th>
                    <th>Email Contact</th>
                    <th>Current Pipeline Stage</th>
                    <th>Next Action</th>
                    <th>Manage Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="user-avatar" style={{ background: "linear-gradient(135deg, #0284c7, #4f46e5)" }}>
                            {item.applicant?.name ? item.applicant.name.charAt(0).toUpperCase() : "C"}
                          </div>
                          <div>
                            <strong style={{ color: "#0f172a", display: "block" }}>{item.applicant?.name || "Candidate"}</strong>
                            <span style={{ fontSize: 12, color: "#64748b" }}>
                              Applied {new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {item.job ? (
                          <Link 
                            to={`/jobs/${item.job._id}`} 
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#0284c7", fontWeight: 700 }}
                          >
                            <span>{item.job.title}</span>
                            <ExternalLink size={13} />
                          </Link>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>Job Closed</span>
                        )}
                      </td>
                      <td>
                        <a 
                          href={`mailto:${item.applicant?.email}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#475569", fontWeight: 600, fontSize: 13.5 }}
                        >
                          <Mail size={14} color="#0284c7" />
                          <span>{item.applicant?.email}</span>
                        </a>
                      </td>
                      <td>
                        {getStageBadge(item.status)}
                      </td>
                      <td>
                        <div style={{ fontSize: 12.5, color: "#64748b" }}>
                          {item.status === "Applied" && "Needs assessment or review"}
                          {item.status === "Online Assessment" && "Waiting for test completion"}
                          {item.status === "Technical Interview" && "Interview scheduled"}
                          {item.status === "HR Interview" && "Final HR round in progress"}
                          {item.status === "Offer Released" && `Offered ₹${item.stageDetails?.offer?.ctc || '—'} LPA`}
                          {item.status === "Accepted" && "Ready for onboarding"}
                          {item.status === "Rejected" && "Process completed"}
                        </div>
                      </td>
                      <td>
                        <button
                          className="button small-button"
                          onClick={() => openStageModal(item)}
                          style={{ padding: "6px 14px", fontSize: 13 }}
                        >
                          <span>Manage Stage</span>
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div style={{ width: 170, height: 170, margin: "0 auto" }}>
                <LottiePlayer animationData={emptyAnimData} loop={true} />
              </div>
              <h3>No Applicants in "{selectedFilter}"</h3>
              <p>No candidate records currently match this filter criteria.</p>
              {selectedFilter !== "All" && (
                <button className="button secondary" onClick={() => setSelectedFilter("All")}>
                  <span>Show All Applicants</span>
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Interactive Pipeline Stage Modal */}
      {activeApp && (
        <div className="modal-backdrop">
          <div className="modal-content-card">
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: 20 }}>
                  Manage Pipeline: {activeApp.applicant?.name}
                </h3>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13.5 }}>
                  Role: <strong>{activeApp.job?.title}</strong> ({activeApp.job?.company})
                </p>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setActiveApp(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStage}>
              <div className="modal-body">
                {/* Select New Stage */}
                <div className="form-group">
                  <label>Move Candidate to Stage</label>
                  <select 
                    className="status-select"
                    style={{ width: "100%", padding: "10px 14px", fontSize: 15 }}
                    value={modalStage}
                    onChange={(e) => setModalStage(e.target.value)}
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Stage-Specific Form Inputs */}
                {modalStage === "Online Assessment" && (
                  <div className="stage-fields-box">
                    <h4 className="stage-fields-title">📝 Online Assessment Configuration</h4>
                    <div className="form-group">
                      <label>Test URL / Assessment Link</label>
                      <input 
                        type="url"
                        placeholder="https://app.hackerrank.com/test/..."
                        value={stageForm.assessment.link}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          assessment: { ...stageForm.assessment, link: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Deadline (Date & Time)</label>
                      <input 
                        type="datetime-local"
                        value={stageForm.assessment.deadline}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          assessment: { ...stageForm.assessment, deadline: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Special Instructions / Platform</label>
                      <input 
                        placeholder="e.g. 90 mins coding test on DSA & System Design"
                        value={stageForm.assessment.instructions}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          assessment: { ...stageForm.assessment, instructions: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}

                {modalStage === "Technical Interview" && (
                  <div className="stage-fields-box">
                    <h4 className="stage-fields-title">💻 Technical Interview Schedule</h4>
                    <div className="form-group">
                      <label>Interview Date & Time</label>
                      <input 
                        type="datetime-local"
                        value={stageForm.technicalInterview.scheduledAt}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          technicalInterview: { ...stageForm.technicalInterview, scheduledAt: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Google Meet / Zoom Meeting Link</label>
                      <input 
                        type="url"
                        placeholder="https://meet.google.com/xyz-abcd-efg"
                        value={stageForm.technicalInterview.meetingLink}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          technicalInterview: { ...stageForm.technicalInterview, meetingLink: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Interviewer Name / Team</label>
                      <input 
                        placeholder="e.g. Lead Frontend Architect"
                        value={stageForm.technicalInterview.interviewer}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          technicalInterview: { ...stageForm.technicalInterview, interviewer: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Topics & Preparation Notes</label>
                      <input 
                        placeholder="e.g. React Architecture, Node.js, Performance Optimization"
                        value={stageForm.technicalInterview.notes}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          technicalInterview: { ...stageForm.technicalInterview, notes: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}

                {modalStage === "HR Interview" && (
                  <div className="stage-fields-box">
                    <h4 className="stage-fields-title">🤝 HR Interview Schedule</h4>
                    <div className="form-group">
                      <label>Date & Time</label>
                      <input 
                        type="datetime-local"
                        value={stageForm.hrInterview.scheduledAt}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          hrInterview: { ...stageForm.hrInterview, scheduledAt: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Video Call Link</label>
                      <input 
                        type="url"
                        placeholder="https://meet.google.com/..."
                        value={stageForm.hrInterview.meetingLink}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          hrInterview: { ...stageForm.hrInterview, meetingLink: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>HR Representative</label>
                      <input 
                        placeholder="e.g. Priya Nair (Head of Talent Acquisition)"
                        value={stageForm.hrInterview.interviewer}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          hrInterview: { ...stageForm.hrInterview, interviewer: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}

                {modalStage === "Offer Released" && (
                  <div className="stage-fields-box" style={{ background: "#faf5ff", borderColor: "#d8b4fe" }}>
                    <h4 className="stage-fields-title" style={{ color: "#7e22ce" }}>🎉 Release Formal Offer Letter</h4>
                    <div className="form-group">
                      <label>Total CTC (in ₹ LPA)</label>
                      <input 
                        placeholder="e.g. 18.5"
                        value={stageForm.offer.ctc}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          offer: { ...stageForm.offer, ctc: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Fixed Base Salary (in ₹ LPA)</label>
                      <input 
                        placeholder="e.g. 16.0"
                        value={stageForm.offer.baseSalary}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          offer: { ...stageForm.offer, baseSalary: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Expected Joining Date</label>
                      <input 
                        type="date"
                        value={stageForm.offer.joiningDate}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          offer: { ...stageForm.offer, joiningDate: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Offer Highlights / Benefits / Notes</label>
                      <textarea 
                        rows="3"
                        placeholder="e.g. ₹1,00,000 Joining Bonus, Health Insurance ₹10L, Hybrid working policy."
                        value={stageForm.offer.offerLetterNotes}
                        onChange={(e) => setStageForm({
                          ...stageForm,
                          offer: { ...stageForm.offer, offerLetterNotes: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}

                {/* Internal Pipeline Note */}
                <div className="form-group">
                  <label>Timeline Note / Feedback (Optional)</label>
                  <input 
                    placeholder="e.g. Cleared round 1 with excellent system design score"
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                  />
                </div>

                {/* Application Timeline History Preview */}
                {activeApp.timeline && activeApp.timeline.length > 0 && (
                  <div className="timeline-history-box">
                    <h5 style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b" }}>Past Timeline Events</h5>
                    {activeApp.timeline.map((item, idx) => (
                      <div key={idx} className="timeline-mini-item">
                        <div className="timeline-mini-dot" />
                        <div>
                          <strong>{item.stage}</strong>: {item.note || 'Status updated'}
                          <span style={{ marginLeft: 8, fontSize: 11, color: "#94a3b8" }}>
                            {new Date(item.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="button secondary" 
                  onClick={() => setActiveApp(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="button" 
                  disabled={submitting}
                >
                  <Send size={16} />
                  <span>{submitting ? "Updating..." : "Update Stage & Notify Candidate"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
