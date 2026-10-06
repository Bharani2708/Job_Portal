import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Award, 
  FileText, 
  PenTool, 
  ShieldCheck, 
  Share2,
  RefreshCw
} from "lucide-react";

const sampleOffers = [
  {
    company: "Stripe",
    logoColor: "#6366f1",
    logoText: "S",
    role: "Senior Full Stack Engineer",
    department: "Core Infrastructure & Global Payments",
    location: "San Francisco, CA / Remote",
    baseSalary: "$165,000",
    equity: "$75,000 RSU / yr",
    signOnBonus: "$25,000",
    startDate: "First Monday of Next Month",
    benefits: ["Unlimited PTO", "$5,000 Home Office Stipend", "100% Health & Dental Coverage", "401(k) 50% Match up to 6%"],
    recruiter: "Elena Vance",
    recruiterTitle: "VP of Engineering Talent, Stripe"
  },
  {
    company: "Google",
    logoColor: "#0284c7",
    logoText: "G",
    role: "Staff Software Architect",
    department: "Cloud AI & Next-Gen Infrastructure",
    location: "New York, NY / Remote",
    baseSalary: "$185,000",
    equity: "$110,000 GSU / yr",
    signOnBonus: "$35,000",
    startDate: "Flexible / 30 Days Notice",
    benefits: ["Comprehensive Wellness Stipend", "Generous Parental Leave", "Annual Learning Grant ($4,000)", "Hybrid Flexibility"],
    recruiter: "Marcus Chen",
    recruiterTitle: "Principal Tech Recruiter, Google"
  },
  {
    company: "Spotify",
    logoColor: "#059669",
    logoText: "♪",
    role: "Lead Frontend Engineer",
    department: "Creator Platform & Streaming Experience",
    location: "Stockholm / London / Remote",
    baseSalary: "€140,000",
    equity: "€45,000 Stock / yr",
    signOnBonus: "€15,000",
    startDate: "Immediate / Within 3 Weeks",
    benefits: ["Flexible Public Holidays", "Annual Music & Tech Equipment Allowance", "Global Work From Anywhere Program"],
    recruiter: "Astrid Lindgren",
    recruiterTitle: "Head of People, Spotify"
  }
];

export default function OfferLetter3D({ candidateName = "Alex Morgan", isInteractive = true }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isSigned, setIsSigned] = useState(false);
  const [rotate, setRotate] = useState({ x: 6, y: -8 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const offer = sampleOffers[activeTab];

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e) => {
    if (!containerRef.current || !isInteractive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 5, y: -6 }); // subtle resting 3D angle
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleAcceptOffer = () => {
    setIsSigned(true);
    
    // Confetti celebration burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#4f46e5", "#0284c7", "#10b981", "#f59e0b", "#ec4899"]
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  };

  const handleReset = () => {
    setIsSigned(false);
  };

  return (
    <div className="offer-3d-wrapper">
      {/* Company Selector Switcher */}
      <div className="offer-company-switcher">
        {sampleOffers.map((item, idx) => (
          <button
            key={idx}
            className={`offer-switcher-btn ${activeTab === idx ? "active" : ""}`}
            onClick={() => {
              setActiveTab(idx);
              setIsSigned(false);
            }}
          >
            <span 
              className="switcher-logo-pill" 
              style={{ background: item.logoColor }}
            >
              {item.logoText}
            </span>
            <span>{item.company}</span>
          </button>
        ))}
      </div>

      {/* 3D Perspective Stage */}
      <div 
        className="offer-3d-stage"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="offer-3d-card"
          style={{
            transform: `perspective(1200px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
            transition: isHovered ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)"
          }}
        >
          {/* Holographic light sheen reflection */}
          <div className="offer-holographic-sheen" />

          {/* Gold Verified Seal */}
          <div className="offer-gold-seal">
            <Award size={20} color="#b45309" />
            <span>OFFICIAL OFFER</span>
          </div>

          {/* Document Header */}
          <div className="offer-doc-header">
            <div className="offer-brand-info">
              <div 
                className="offer-company-avatar" 
                style={{ background: `linear-gradient(135deg, ${offer.logoColor}, #1e293b)` }}
              >
                {offer.logoText}
              </div>
              <div>
                <h3 className="offer-company-name">{offer.company}</h3>
                <span className="offer-dept">{offer.department}</span>
              </div>
            </div>
            
            <div className="offer-status-badge">
              <span className="live-pulse-dot" />
              <span>OFFER EXTENDED</span>
            </div>
          </div>

          {/* Recipient Greeting */}
          <div className="offer-recipient-block">
            <p className="offer-greeting">Dear <strong>{candidateName}</strong>,</p>
            <p className="offer-letter-body">
              On behalf of <strong>{offer.company}</strong>, we are thrilled to formally offer you the position of{" "}
              <strong style={{ color: "#4f46e5" }}>{offer.role}</strong>. Your technical leadership, problem solving, and passion make you the perfect addition to our team.
            </p>
          </div>

          {/* Compensation & Equity Highlights Box */}
          <div className="offer-compensation-grid">
            <div className="comp-item">
              <span className="comp-label">Base Annual Salary</span>
              <span className="comp-value" style={{ color: "#059669" }}>
                <DollarSign size={16} />
                {offer.baseSalary}
              </span>
            </div>

            <div className="comp-item">
              <span className="comp-label">Equity & Stock Options</span>
              <span className="comp-value" style={{ color: "#4f46e5" }}>
                <Sparkles size={16} />
                {offer.equity}
              </span>
            </div>

            <div className="comp-item">
              <span className="comp-label">Sign-On Bonus</span>
              <span className="comp-value" style={{ color: "#d97706" }}>
                <Award size={16} />
                {offer.signOnBonus}
              </span>
            </div>

            <div className="comp-item">
              <span className="comp-label">Location / Workplace</span>
              <span className="comp-value" style={{ color: "#0284c7" }}>
                <MapPin size={16} />
                {offer.location}
              </span>
            </div>
          </div>

          {/* Key Perks Pills */}
          <div className="offer-perks-row">
            <span className="perk-tag-title">Package Inclusions:</span>
            {offer.benefits.map((benefit, i) => (
              <span key={i} className="offer-perk-pill">
                ✓ {benefit}
              </span>
            ))}
          </div>

          {/* Signatures & Action Footer */}
          <div className="offer-footer-row">
            <div className="offer-signature-area">
              <div className="signature-handwritten">
                {offer.recruiter.split(" ")[0].toLowerCase()} {offer.company.toLowerCase()}
              </div>
              <div className="signature-title">
                <strong>{offer.recruiter}</strong>
                <span>{offer.recruiterTitle}</span>
              </div>
            </div>

            <div className="offer-action-box">
              {isSigned ? (
                <div className="offer-accepted-banner">
                  <CheckCircle2 size={20} color="#059669" />
                  <div>
                    <strong>Offer Accepted & Signed!</strong>
                    <span>Onboarding packet sent to email</span>
                  </div>
                  <button 
                    className="offer-reset-btn" 
                    onClick={handleReset} 
                    title="Reset Preview"
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>
              ) : (
                <button 
                  className="button offer-sign-btn" 
                  onClick={handleAcceptOffer}
                >
                  <PenTool size={16} />
                  <span>Digitally Sign & Accept</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

