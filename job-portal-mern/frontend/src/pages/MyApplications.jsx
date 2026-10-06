import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import LottiePlayer from "../components/LottiePlayer";
import emptyAnimData from "../assets/animations/emptyAnimation.json";
import api from "../api";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  AlertCircle,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Video,
  FileCode,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  XCircle,
  FileCheck,
  CheckCircle
} from "lucide-react";

const PIPELINE_STAGES = [
  { id: "Applied", label: "Applied", desc: "Profile submitted" },
  { id: "Online Assessment", label: "Assessment", desc: "Coding / Skills test" },
  { id: "Technical Interview", label: "Tech Round", desc: "Architecture & live coding" },
  { id: "HR Interview", label: "HR Round", desc: "Culture & compensation fit" },
  { id: "Offer Released", label: "Offer Letter", desc: "Formal proposal released" },
  { id: "Accepted", label: "Hired", desc: "Accepted & onboarding" }
];

export default function MyApplications() {
  const [searchParams] = useSearchParams();
  const targetAppId = searchParams.get("appId");

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(targetAppId || null);
  
  // Offer modal state
  const [activeOfferApp, setActiveOfferApp] = useState(null);
  const [digitalSignature, setDigitalSignature] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadApplications = () => {
    setLoading(true);
    api.get("/applications/mine")
      .then(({ data }) => {
        setItems(data);
        if (targetAppId) {
          setExpandedId(targetAppId);
        } else if (data.length > 0 && !expandedId) {
          setExpandedId(data[0]._id);
        }
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load your applications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (targetAppId) {
      setExpandedId(targetAppId);
      setTimeout(() => {
        const el = document.getElementById(`app-card-${targetAppId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [targetAppId]);

  const getStageIndex = (status) => {
    if (status === "Rejected") return -1;
    if (status === "Under Review" || status === "Shortlisted") return 1;
    if (status === "Interview") return 2;
    if (status === "Selected") return 5;
    
    const idx = PIPELINE_STAGES.findIndex((s) => s.id === status);
    return idx >= 0 ? idx : 0;
  };

  const handleOfferResponse = async (appId, action) => {
    setOfferLoading(true);
    setError("");

    try {
      await api.patch(`/applications/${appId}/respond-offer`, {
        action,
        digitalSignature: digitalSignature || undefined
      });

      if (action === "accept") {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        setSuccessMsg("🎉 Congratulations! You have successfully accepted the job offer.");
      } else {
        setSuccessMsg("Offer status has been updated.");
      }

      setActiveOfferApp(null);
      setDigitalSignature("");
      setTimeout(() => setSuccessMsg(""), 5000);
      loadApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process offer response.");
    } finally {
      setOfferLoading(false);
    }
  };

  return (
    <section>
      <div className="page-heading row-between">
        <div>
          <h2>My Job Applications & Progress Tracker</h2>
          <p>Track "What's Done" and "What's Next" for every stage of your hiring journey in real time.</p>
        </div>
        <Link to="/jobs" className="button small-button">
          <Search size={15} />
          <span>Find More Jobs</span>
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
          <Sparkles size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "70px 0", color: "#64748b" }}>
          <div className="user-avatar" style={{ margin: "0 auto 16px", width: 46, height: 46 }}>
            <Sparkles size={22} />
          </div>
          <p style={{ fontSize: 16 }}>Fetching your live application progress...</p>
        </div>
      ) : (
        <>
          <div className="applications-tracker-list">
            {items.map((item) => {
              const currentStageIdx = getStageIndex(item.status);
              const isExpanded = expandedId === item._id;

              return (
                <article 
                  id={`app-card-${item._id}`}
                  className={`card application-tracker-card ${expandedId === item._id ? 'card-active-expanded' : ''}`} 
                  key={item._id}
                >
                  {/* Top Bar Summary */}
                  <div 
                    className="app-tracker-header"
                    onClick={() => setExpandedId(isExpanded ? null : item._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="app-tracker-left">
                      <div className="company-badge">
                        {item.job?.company ? item.job.company.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>
                          {item.job?.title || "Job Title"}
                        </h3>
                        <div className="job-meta-row" style={{ marginTop: 4 }}>
                          <span className="meta-item">
                            <Briefcase size={14} color="#0284c7" />
                            <strong>{item.job?.company}</strong>
                          </span>
                          <span className="meta-item">
                            <MapPin size={14} color="#64748b" />
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

                    <div className="app-tracker-right">
                      {item.status === "Accepted" && (
                        <span className="tag tag-emerald">🎉 Hired / Accepted</span>
                      )}
                      {item.status === "Offer Released" && (
                        <span className="tag" style={{ background: "rgba(168, 85, 247, 0.12)", color: "#7e22ce", borderColor: "rgba(168, 85, 247, 0.3)" }}>
                          🎁 Offer Letter Released!
                        </span>
                      )}
                      {item.status === "Technical Interview" && (
                        <span className="tag tag-cyan">💻 Tech Round</span>
                      )}
                      {item.status === "HR Interview" && (
                        <span className="tag" style={{ background: "rgba(236, 72, 153, 0.12)", color: "#db2777" }}>🤝 HR Round</span>
                      )}
                      {item.status === "Online Assessment" && (
                        <span className="tag tag-blue">📝 Online Assessment</span>
                      )}
                      {item.status === "Rejected" && (
                        <span className="tag tag-rose">❌ Application Closed</span>
                      )}
                      {item.status === "Applied" && (
                        <span className="tag">📨 Application Received</span>
                      )}

                      <button className="icon-expand-btn" aria-label="Toggle details">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Visual Step-by-Step Progress Pipeline */}
                  <div className="pipeline-stepper-container">
                    <div className="pipeline-steps-wrap">
                      {PIPELINE_STAGES.map((stg, sIdx) => {
                        const isCompleted = item.status !== "Rejected" && currentStageIdx > sIdx;
                        const isCurrent = item.status !== "Rejected" && currentStageIdx === sIdx;
                        const isRejected = item.status === "Rejected" && sIdx === 0;

                        return (
                          <div 
                            key={stg.id} 
                            className={`pipeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                          >
                            <div className="step-node-circle">
                              {isCompleted ? (
                                <CheckCircle2 size={16} color="#fff" />
                              ) : isCurrent ? (
                                <span className="step-number-pulse">{sIdx + 1}</span>
                              ) : (
                                <span>{sIdx + 1}</span>
                              )}
                            </div>
                            <div className="step-info-label">
                              <span className="step-title">{stg.label}</span>
                              <span className="step-subtext">{stg.desc}</span>
                            </div>
                            {sIdx < PIPELINE_STAGES.length - 1 && (
                              <div className={`step-connector-line ${isCompleted ? 'active' : ''}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expandable Details: "What's Done" & "What's Next" */}
                  {isExpanded && (
                    <div className="app-tracker-expanded-body">
                      {/* ACTION CARD: What's Next / Active Round */}
                      <div className="tracker-action-card">
                        <div className="tracker-action-header">
                          <Sparkles size={18} color="#0284c7" />
                          <h4>What's Next: Next Steps in Your Application</h4>
                        </div>

                        {item.status === "Applied" && (
                          <div className="action-step-detail">
                            <p>
                              Your application has been received by the hiring team at <strong>{item.job?.company}</strong>. 
                              They are currently reviewing your profile and will update your status with an Online Assessment or Interview invitation soon.
                            </p>
                          </div>
                        )}

                        {item.status === "Online Assessment" && (
                          <div className="action-step-detail highlight-blue">
                            <h5>📝 Online Assessment Ready</h5>
                            <p>Please complete your technical assessment before the specified deadline.</p>
                            {item.stageDetails?.assessment?.deadline && (
                              <div className="action-meta-row">
                                <Clock size={15} color="#0284c7" />
                                <span>Deadline: <strong>{new Date(item.stageDetails.assessment.deadline).toLocaleString("en-IN")}</strong></span>
                              </div>
                            )}
                            {item.stageDetails?.assessment?.instructions && (
                              <p style={{ marginTop: 6, fontSize: 13.5 }}>
                                <strong>Instructions:</strong> {item.stageDetails.assessment.instructions}
                              </p>
                            )}
                            {item.stageDetails?.assessment?.link ? (
                              <a 
                                href={item.stageDetails.assessment.link} 
                                target="_blank" 
                                rel="noreferrer"
                                className="button small-button"
                                style={{ marginTop: 12, display: "inline-flex" }}
                              >
                                <FileCode size={15} />
                                <span>Start Assessment Now</span>
                                <ExternalLink size={13} />
                              </a>
                            ) : (
                              <p style={{ color: "#0284c7", fontWeight: 600, marginTop: 8 }}>
                                Assessment link is being generated by recruiter.
                              </p>
                            )}
                          </div>
                        )}

                        {item.status === "Technical Interview" && (
                          <div className="action-step-detail highlight-cyan">
                            <h5>💻 Technical Round Scheduled</h5>
                            {item.stageDetails?.technicalInterview?.scheduledAt && (
                              <div className="action-meta-row">
                                <Calendar size={15} color="#0284c7" />
                                <span>Date & Time: <strong>{new Date(item.stageDetails.technicalInterview.scheduledAt).toLocaleString("en-IN")}</strong></span>
                              </div>
                            )}
                            {item.stageDetails?.technicalInterview?.interviewer && (
                              <div className="action-meta-row">
                                <span>Interviewer: <strong>{item.stageDetails.technicalInterview.interviewer}</strong></span>
                              </div>
                            )}
                            {item.stageDetails?.technicalInterview?.notes && (
                              <p style={{ marginTop: 6, fontSize: 13.5 }}>
                                <strong>Topics:</strong> {item.stageDetails.technicalInterview.notes}
                              </p>
                            )}
                            {item.stageDetails?.technicalInterview?.meetingLink && (
                              <a 
                                href={item.stageDetails.technicalInterview.meetingLink} 
                                target="_blank" 
                                rel="noreferrer"
                                className="button small-button"
                                style={{ marginTop: 12, display: "inline-flex", background: "#0284c7" }}
                              >
                                <Video size={15} />
                                <span>Join Video Meeting</span>
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                        )}

                        {item.status === "HR Interview" && (
                          <div className="action-step-detail highlight-pink">
                            <h5>🤝 HR Round Scheduled</h5>
                            {item.stageDetails?.hrInterview?.scheduledAt && (
                              <div className="action-meta-row">
                                <Calendar size={15} color="#db2777" />
                                <span>Date & Time: <strong>{new Date(item.stageDetails.hrInterview.scheduledAt).toLocaleString("en-IN")}</strong></span>
                              </div>
                            )}
                            {item.stageDetails?.hrInterview?.interviewer && (
                              <div className="action-meta-row">
                                <span>HR Manager: <strong>{item.stageDetails.hrInterview.interviewer}</strong></span>
                              </div>
                            )}
                            {item.stageDetails?.hrInterview?.meetingLink && (
                              <a 
                                href={item.stageDetails.hrInterview.meetingLink} 
                                target="_blank" 
                                rel="noreferrer"
                                className="button small-button"
                                style={{ marginTop: 12, display: "inline-flex", background: "#db2777" }}
                              >
                                <Video size={15} />
                                <span>Join HR Video Call</span>
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                        )}

                        {item.status === "Offer Released" && (
                          <div className="action-step-detail highlight-purple">
                            <h5 style={{ color: "#7e22ce" }}>🎉 Official Job Offer Letter Released!</h5>
                            <p style={{ fontSize: 15, margin: "6px 0 12px" }}>
                              <strong>{item.job?.company}</strong> has released a formal offer letter for the position of <strong>{item.job?.title}</strong>.
                            </p>
                            <div className="offer-summary-badge-box">
                              <span style={{ fontSize: 13, color: "#6b21a8" }}>Offered Total Compensation:</span>
                              <strong style={{ fontSize: 24, color: "#6b21a8", display: "block" }}>
                                ₹ {item.stageDetails?.offer?.ctc || '—'} LPA
                              </strong>
                              {item.stageDetails?.offer?.joiningDate && (
                                <span style={{ fontSize: 13, color: "#6b21a8" }}>
                                  Expected Joining: <strong>{new Date(item.stageDetails.offer.joiningDate).toLocaleDateString("en-IN")}</strong>
                                </span>
                              )}
                            </div>
                            <div style={{ marginTop: 16 }}>
                              <button 
                                className="button" 
                                style={{ background: "linear-gradient(135deg, #7e22ce, #9333ea)" }}
                                onClick={() => setActiveOfferApp(item)}
                              >
                                <Award size={16} />
                                <span>Review & Digitally Accept Offer Letter</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {item.status === "Accepted" && (
                          <div className="action-step-detail highlight-green">
                            <h5 style={{ color: "#15803d" }}>🎉 Offer Accepted! You're Hired!</h5>
                            <p>
                              You have digitally accepted the offer with <strong>{item.job?.company}</strong>. 
                              The HR onboarding team will contact you regarding document submission and day 1 orientation.
                            </p>
                            {item.stageDetails?.offer?.digitalSignature && (
                              <p style={{ fontSize: 12.5, color: "#166534", marginTop: 6 }}>
                                ✍️ Signed by: <strong>{item.stageDetails.offer.digitalSignature}</strong> on {item.stageDetails.offer.acceptedAt ? new Date(item.stageDetails.offer.acceptedAt).toLocaleDateString("en-IN") : ''}
                              </p>
                            )}
                          </div>
                        )}

                        {item.status === "Rejected" && (
                          <div className="action-step-detail highlight-rose">
                            <h5 style={{ color: "#be123c" }}>Application Closed</h5>
                            <p>
                              Thank you for the time and effort invested. The hiring team has decided to proceed with other candidates for this specific role.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* What's Done: Timeline History */}
                      {item.timeline && item.timeline.length > 0 && (
                        <div className="tracker-done-card">
                          <h4 style={{ margin: "0 0 14px", fontSize: 15, color: "#334155" }}>
                            📋 Application Milestones History
                          </h4>
                          <div className="timeline-trail">
                            {item.timeline.map((evt, idx) => (
                              <div key={idx} className="timeline-trail-item">
                                <div className="timeline-trail-bullet" />
                                <div className="timeline-trail-content">
                                  <div className="timeline-trail-head">
                                    <strong style={{ color: "#0f172a" }}>{evt.stage}</strong>
                                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                                      {new Date(evt.timestamp).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  </div>
                                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>
                                    {evt.note || "Stage transition completed"}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="empty-state">
              <div style={{ width: 170, height: 170, margin: "0 auto" }}>
                <LottiePlayer animationData={emptyAnimData} loop={true} />
              </div>
              <h3>No Applications Tracked Yet</h3>
              <p>When you apply for opportunities on JobConnect, your real-time stage tracker and offer letters will appear here.</p>
              <Link className="button" to="/jobs">
                <Search size={16} />
                <span>Explore Indian Tech Jobs</span>
              </Link>
            </div>
          )}
        </>
      )}

      {/* Official Offer Letter Acceptance Modal */}
      {activeOfferApp && (
        <div className="modal-backdrop">
          <div className="modal-content-card" style={{ maxWidth: 580 }}>
            <div className="modal-header" style={{ background: "linear-gradient(135deg, #0284c7, #2563eb)", color: "#fff" }}>
              <div>
                <span style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", opacity: 0.9 }}>
                  Official Employment Proposal
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: 22, color: "#fff" }}>
                  Offer Letter: {activeOfferApp.job?.title}
                </h3>
                <p style={{ margin: "2px 0 0", opacity: 0.9, fontSize: 14 }}>
                  {activeOfferApp.job?.company}
                </p>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                style={{ color: "#fff" }}
                onClick={() => setActiveOfferApp(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ padding: "24px 28px" }}>
              <div className="offer-letter-doc">
                <div className="offer-doc-header">
                  <div>
                    <h4>{activeOfferApp.job?.company}</h4>
                    <p style={{ fontSize: 13, color: "#64748b" }}>{activeOfferApp.job?.location}</p>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 13, color: "#64748b" }}>
                    Date: {new Date().toLocaleDateString("en-IN")}
                  </div>
                </div>

                <div className="offer-doc-body" style={{ margin: "20px 0", fontSize: 14.5, lineHeight: 1.6, color: "#334155" }}>
                  <p>
                    Dear Candidate,<br />
                    We are thrilled to offer you the position of <strong>{activeOfferApp.job?.title}</strong> with <strong>{activeOfferApp.job?.company}</strong>.
                  </p>

                  <div className="offer-salary-breakdown-box">
                    <div className="salary-item-row">
                      <span>Total Annual CTC:</span>
                      <strong>₹ {activeOfferApp.stageDetails?.offer?.ctc || '—'} LPA</strong>
                    </div>
                    {activeOfferApp.stageDetails?.offer?.baseSalary && (
                      <div className="salary-item-row">
                        <span>Fixed Base Salary:</span>
                        <span>₹ {activeOfferApp.stageDetails.offer.baseSalary} LPA</span>
                      </div>
                    )}
                    {activeOfferApp.stageDetails?.offer?.joiningDate && (
                      <div className="salary-item-row">
                        <span>Expected Joining Date:</span>
                        <strong>{new Date(activeOfferApp.stageDetails.offer.joiningDate).toLocaleDateString("en-IN")}</strong>
                      </div>
                    )}
                  </div>

                  {activeOfferApp.stageDetails?.offer?.offerLetterNotes && (
                    <div style={{ marginTop: 14, padding: "10px 14px", background: "#f8fafc", borderRadius: 8, fontSize: 13.5 }}>
                      <strong>Terms & Benefits:</strong> {activeOfferApp.stageDetails.offer.offerLetterNotes}
                    </div>
                  )}
                </div>

                {/* Digital Signature */}
                <div className="form-group" style={{ marginTop: 20 }}>
                  <label>Type Full Name for Digital Signature</label>
                  <input 
                    placeholder="e.g. Rahul Sharma"
                    value={digitalSignature}
                    onChange={(e) => setDigitalSignature(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: 12, color: "#64748b", marginTop: 4, display: "block" }}>
                    By typing your name and clicking "Accept Offer", you agree to the employment terms.
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ gap: 12 }}>
              <button 
                type="button" 
                className="button secondary"
                disabled={offerLoading}
                onClick={() => handleOfferResponse(activeOfferApp._id, "decline")}
              >
                Decline Offer
              </button>
              <button 
                type="button" 
                className="button"
                disabled={offerLoading || !digitalSignature.trim()}
                onClick={() => handleOfferResponse(activeOfferApp._id, "accept")}
                style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
              >
                <CheckCircle size={16} />
                <span>{offerLoading ? "Processing..." : "Sign & Accept Job Offer"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
