import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  ArrowRight, 
  Briefcase, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Code2, 
  Palette, 
  Bot, 
  Layers, 
  Star, 
  Award, 
  ChevronRight, 
  Compass, 
  Sliders, 
  Clock, 
  FileCheck,
  Quote,
  ThumbsUp,
  Heart
} from "lucide-react";

export default function Home() {
  const [quickSearch, setQuickSearch] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [expLevel, setExpLevel] = useState(3);
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  // Dynamic salary calculator estimation in Indian Rupees (Lakhs Per Annum - LPA)
  const calculateEstimatedSalary = () => {
    let baseMin = 6;
    let baseMax = 12;

    if (targetRole.includes("Staff") || targetRole.includes("Lead")) {
      baseMin = 22;
      baseMax = 40;
    } else if (targetRole.includes("AI") || targetRole.includes("Machine")) {
      baseMin = 14;
      baseMax = 28;
    } else if (targetRole.includes("Design")) {
      baseMin = 8;
      baseMax = 18;
    } else if (targetRole.includes("DevOps") || targetRole.includes("Cloud")) {
      baseMin = 10;
      baseMax = 22;
    }

    const minLPA = Math.round(baseMin + expLevel * 2.8);
    const maxLPA = Math.round(baseMax + expLevel * 4.2);

    return {
      lpaFormatted: `₹${minLPA} – ₹${maxLPA} LPA`,
      monthlyEstimate: `₹${Math.round((minLPA * 100000) / 12).toLocaleString("en-IN")} – ₹${Math.round((maxLPA * 100000) / 12).toLocaleString("en-IN")} / month`
    };
  };

  const estimatedSalary = calculateEstimatedSalary();

  // Photo-rich reviews with Indian tech packages in INR (Rupees)
  const photoReviews = [
    {
      name: "Ananya Sharma",
      role: "Lead Full Stack Engineer",
      company: "Razorpay",
      companyColor: "#0284c7",
      offerBadge: "₹28,50,000 / yr + ESOPs",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      review: "JobConnect completely streamlined my hiring process. Within 4 days of applying, I was interviewing with the Core Payments team at Razorpay. The transparent salary range in LPA gave me complete negotiation clarity.",
      tags: ["React", "Node.js", "Payments", "Bangalore"]
    },
    {
      name: "Rohan Sharma",
      role: "Staff AI & Systems Architect",
      company: "Google India",
      companyColor: "#4f46e5",
      offerBadge: "₹48,00,000 / yr + Stock",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      review: "The quality of verified openings on JobConnect is unmatched in India. Direct recruiter visibility and clear CTC structures saved me weeks of back-and-forth discussions. Landed a staff role with zero hassle!",
      tags: ["Python", "TensorFlow", "Kubernetes", "Hyderabad"]
    },
    {
      name: "Priya Patel",
      role: "Senior Frontend Engineer",
      company: "Swiggy",
      companyColor: "#d97706",
      offerBadge: "₹32,00,000 / yr + Bonus",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      review: "I loved the live status tracking. Knowing exactly when my application was reviewed, shortlisted, and scheduled for technical rounds took away 100% of job search stress.",
      tags: ["TypeScript", "Next.js", "React", "Bangalore"]
    },
    {
      name: "Vikram Malhotra",
      role: "Senior Backend Engineer",
      company: "Flipkart",
      companyColor: "#2563eb",
      offerBadge: "₹36,00,000 / yr + ESOPs",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      review: "1-Click applications with pre-verified skill highlights made all the difference. Hiring managers reached out directly within 48 hours with formal interview rounds.",
      tags: ["Java", "Spring Boot", "Kafka", "Bangalore"]
    },
    {
      name: "Sneha Reddy",
      role: "Cloud DevOps Architect",
      company: "Zoho",
      companyColor: "#059669",
      offerBadge: "₹24,00,000 / yr",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      review: "Clean, fast, and no spam agencies. Every company on JobConnect is verified with realistic LPA salary brackets and modern tech stacks. Highly recommended for developers in India.",
      tags: ["AWS", "Docker", "CI/CD", "Chennai"]
    },
    {
      name: "Arjun Nair",
      role: "Principal Product Designer",
      company: "CRED",
      companyColor: "#111827",
      offerBadge: "₹34,00,000 / yr + Bonus",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
      review: "The UI design and user experience of JobConnect itself speaks volumes. Applied to top tier product design openings in Bangalore and accepted an incredible package in under 10 days.",
      tags: ["Figma", "Design Systems", "UI/UX", "Bangalore"]
    }
  ];

  const categories = [
    { title: "Software Engineering", count: "1,420+ Jobs", icon: Code2, color: "#4f46e5", bg: "rgba(79, 70, 229, 0.08)" },
    { title: "Product & UI/UX Design", count: "680+ Jobs", icon: Palette, color: "#0284c7", bg: "rgba(2, 132, 199, 0.08)" },
    { title: "AI & Machine Learning", count: "950+ Jobs", icon: Bot, color: "#7c3aed", bg: "rgba(124, 58, 237, 0.08)" },
    { title: "Cloud & DevOps", count: "510+ Jobs", icon: Layers, color: "#059669", bg: "rgba(5, 150, 105, 0.08)" },
    { title: "Growth & Product Mgt", count: "340+ Jobs", icon: TrendingUp, color: "#d97706", bg: "rgba(217, 119, 6, 0.08)" },
    { title: "Tech Management", count: "290+ Jobs", icon: Building2, color: "#e11d48", bg: "rgba(225, 29, 72, 0.08)" },
  ];

  return (
    <div>
      {/* 1. HERO SECTION WITH HIGH-RES WORKSPACE PHOTOGRAPHY & FLOATING REVIEW BADGES */}
      <section className="hero-section-pro">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={15} />
            <span>Over 2,840+ Verified Offers Accepted Across India</span>
          </div>

          <h1 className="hero-title">
            Find Your Next Opportunity with <span className="gradient-heading">Top Tech Companies</span>.
          </h1>

          <p className="hero-subtitle">
            Join thousands of software engineers, product designers, and tech leaders who landed high-paying roles with transparent salary bands in ₹ (LPA) and direct recruiter connections.
          </p>

          {/* Quick Search Box */}
          <form onSubmit={handleQuickSearch} className="hero-search-box">
            <Search size={20} color="#4f46e5" />
            <input 
              type="text" 
              placeholder="Search by role, stack (e.g. React, Node.js, Python, MERN)..." 
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
            />
            <button type="submit" className="button">
              <span>Search Roles</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="popular-tags">
            <span style={{ fontWeight: 700 }}>Popular Hubs & Tech:</span>
            {["React", "Node.js", "Full Stack", "Bangalore", "Hyderabad", "Pune", "Chennai", "Remote"].map((tag, i) => (
              <span 
                key={i} 
                className="popular-tag-item" 
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setQuickSearch(tag);
                  navigate(`/jobs?search=${encodeURIComponent(tag)}`);
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Image Visual with Floating Glass Review Badges */}
        <div className="hero-visual-wrapper">
          <div className="hero-main-photo-frame">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80" 
              alt="Tech engineering team collaborating in modern office" 
              loading="eager"
            />
          </div>

          {/* Floating Glass Review Badge 1 Top Left */}
          <div className="hero-floating-glass-card card-top-left">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" 
              alt="Ananya S."
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 3, color: "#059669", fontSize: 11, fontWeight: 700 }}>
                <CheckCircle2 size={12} /> Hired at Razorpay (₹28.5 LPA)
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Ananya Sharma</div>
            </div>
          </div>

          {/* Floating Glass Review Badge 2 Bottom Right */}
          <div className="hero-floating-glass-card card-bottom-right">
            <div style={{ display: "flex", alignItems: "center", gap: 3, color: "#d97706" }}>
              <Star size={16} fill="#d97706" />
              <strong style={{ fontSize: 14, color: "#0f172a" }}>4.9/5</strong>
            </div>
            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 10, fontSize: 12, color: "#475569", fontWeight: 600 }}>
              15,000+ Verified Placements in India
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY BRANDS LOGO TICKER */}
      <section className="brands-ticker-section">
        <div className="brands-ticker-title">Engineers hired by top tech powerhouses & startups</div>
        <div className="brands-logo-row">
          <div className="brand-badge-item">
            <Building2 size={20} color="#4f46e5" />
            <span>Google India</span>
          </div>
          <div className="brand-badge-item">
            <Zap size={20} color="#0284c7" />
            <span>Razorpay</span>
          </div>
          <div className="brand-badge-item">
            <Layers size={20} color="#059669" />
            <span>Flipkart</span>
          </div>
          <div className="brand-badge-item">
            <Sparkles size={20} color="#d97706" />
            <span>Swiggy</span>
          </div>
          <div className="brand-badge-item">
            <Award size={20} color="#7c3aed" />
            <span>Zoho</span>
          </div>
        </div>
      </section>

      {/* 3. PHOTO-RICH REVIEWS & CANDIDATE SUCCESS STORIES (WALL OF LOVE) */}
      <section className="photo-reviews-section">
        <div className="section-header-pro">
          <div className="hero-pill-badge" style={{ margin: "0 auto 12px" }}>
            <Award size={15} />
            <span>Verified Candidate Reviews</span>
          </div>
          <h2>Hear Directly from Hired Engineers in India</h2>
          <p>Real stories, verified offer salaries in ₹ (INR), and transparent reviews from candidates hired via JobConnect.</p>
        </div>

        <div className="photo-reviews-grid">
          {photoReviews.map((item, idx) => (
            <article key={idx} className="photo-review-card card">
              {/* Top Header with Photo, Name and Company Tag */}
              <div className="review-card-header">
                <div className="review-avatar-wrap">
                  <img src={item.photo} alt={item.name} className="review-avatar-img" />
                  <span 
                    className="review-company-badge-pill" 
                    style={{ background: item.companyColor }}
                  >
                    {item.company[0]}
                  </span>
                </div>

                <div className="review-user-info">
                  <h4 className="review-user-name">{item.name}</h4>
                  <p className="review-user-role">{item.role} · <strong>{item.company}</strong></p>
                  
                  {/* Star Rating */}
                  <div className="review-stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                    <span className="verified-badge-pill">
                      <CheckCircle2 size={11} /> Verified Hire
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Offer Tag in Rupees */}
              <div className="review-offer-banner">
                <span className="offer-banner-label">Accepted CTC Package</span>
                <strong className="offer-banner-amount">{item.offerBadge}</strong>
              </div>

              {/* Review Text Body */}
              <div className="review-body-wrap">
                <Quote size={20} color="#cbd5e1" className="review-quote-icon" />
                <p className="review-quote-text">
                  "{item.review}"
                </p>
              </div>

              {/* Tech Stack Tags */}
              <div className="review-tags-footer">
                {item.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="skill-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. VISUAL HOW IT WORKS WITH FULL PHOTO CARDS */}
      <section className="how-it-works-section">
        <div className="section-header-pro">
          <h2>How JobConnect Accelerates Your Career</h2>
          <p>A modern 3-step pathway engineered for transparent, high-paying tech placements in India.</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
          {/* Step 1 Photo Card */}
          <div className="card feature-photo-card">
            <div className="feature-photo-frame">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
                alt="Discover verified roles"
              />
              <span className="feature-step-badge">Step 1</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginTop: 16 }}>
              Discover Verified Openings
            </h3>
            <p style={{ color: "#64748b", fontSize: 14.5, lineHeight: 1.6, marginTop: 6 }}>
              Browse pre-screened tech vacancies across Bangalore, Hyderabad, Pune, and Chennai with pre-approved LPA salary brackets.
            </p>
          </div>

          {/* Step 2 Photo Card */}
          <div className="card feature-photo-card">
            <div className="feature-photo-frame">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80" 
                alt="Direct interview connections"
              />
              <span className="feature-step-badge">Step 2</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginTop: 16 }}>
              Fast-Track Direct Interviews
            </h3>
            <p style={{ color: "#64748b", fontSize: 14.5, lineHeight: 1.6, marginTop: 6 }}>
              Your profile goes straight to engineering hiring managers with live status radar updates at every interview round.
            </p>
          </div>

          {/* Step 3 Photo Card */}
          <div className="card feature-photo-card">
            <div className="feature-photo-frame">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="Accept top tier offer"
              />
              <span className="feature-step-badge">Step 3</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginTop: 16 }}>
              Receive Your Official Offer
            </h3>
            <p style={{ color: "#64748b", fontSize: 14.5, lineHeight: 1.6, marginTop: 6 }}>
              Get verified digital offer letters with transparent CTC, ESOP grants, joining bonuses, and instant onboarding.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SALARY BENCHMARK & CAREER CALCULATOR (INR / LPA) */}
      <section className="calculator-section-pro">
        <div className="calculator-card-glass">
          <div className="calculator-header">
            <div className="hero-pill-badge" style={{ marginBottom: 8 }}>
              <Compass size={14} />
              <span>Indian Tech Market CTC Benchmark</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 800, color: "#0f172a" }}>
              Calculate Your Market Worth (in ₹ LPA)
            </h3>
            <p style={{ color: "#64748b", fontSize: 14.5 }}>
              Live compensation ranges calculated across 10,000+ verified Indian tech job openings.
            </p>
          </div>

          <div className="calculator-controls-grid">
            <div className="form-group">
              <label>Select Your Technical Domain</label>
              <select 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)}
                className="calc-select"
              >
                <option value="Full Stack Engineer">Full Stack MERN Developer</option>
                <option value="Lead Software Architect">Lead / Staff Software Architect</option>
                <option value="AI & Machine Learning Engineer">AI & Machine Learning Engineer</option>
                <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
              </select>
            </div>

            <div className="form-group">
              <label>Experience Level: <strong>{expLevel} {expLevel === 1 ? "Year" : "Years"}</strong></label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                value={expLevel} 
                onChange={(e) => setExpLevel(Number(e.target.value))}
                style={{ accentColor: "#4f46e5", cursor: "pointer", marginTop: 8 }}
              />
            </div>
          </div>

          <div className="calculator-result-box">
            <div>
              <span style={{ fontSize: 12, textTransform: "uppercase", fontWeight: 700, color: "#64748b" }}>
                Estimated Annual CTC Benchmark
              </span>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 34, fontWeight: 900, color: "#059669" }}>
                {estimatedSalary.lpaFormatted}
              </div>
              <div style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>
                Estimated In-Hand: <strong style={{ color: "#0f172a" }}>{estimatedSalary.monthlyEstimate}</strong>
              </div>
            </div>

            <button 
              className="button"
              onClick={() => navigate(`/jobs?search=${encodeURIComponent(targetRole.split(" ")[0])}`)}
            >
              <span>View Matching Openings</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. DOMAIN CATEGORIES EXPLORER */}
      <section className="categories-section">
        <div className="section-header-pro">
          <h2>Browse Openings by Technical Domain</h2>
          <p>Find specialized engineering & design openings matching your exact skills across India.</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx} 
                className="category-card"
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(cat.title.split(" ")[0])}`)}
              >
                <div className="category-icon-box" style={{ background: cat.bg, color: cat.color }}>
                  <Icon size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{cat.title}</h3>
                  <p style={{ fontSize: 13.5, color: "#64748b", marginTop: 2 }}>{cat.count}</p>
                </div>
                <ChevronRight size={18} color="#94a3b8" style={{ marginLeft: "auto" }} />
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. HIGH-IMPACT CALL TO ACTION */}
      <section className="cta-banner-glass">
        <div>
          <h2>Ready to Land Your Next High-Paying Tech Role?</h2>
          <p>
            Create your free profile in 60 seconds, explore verified compensation in ₹ LPA, and get hired by top Indian tech innovators.
          </p>
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Link to="/jobs" className="button" style={{ background: "#ffffff", color: "#4f46e5", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
            <Search size={16} />
            <span>Explore 10k+ Indian Jobs</span>
          </Link>
          <Link to="/register" className="button" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.4)" }}>
            <span>Create Free Account</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
