import { Link } from "react-router-dom";
import { Briefcase, Heart, Mail, Globe, Shield, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container" style={{ margin: "0 auto" }}>
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand-column">
            <Link className="brand" to="/" style={{ display: "inline-flex" }}>
              <div className="brand-icon-box">
                <Briefcase size={20} color="#fff" />
              </div>
              <span className="gradient-text">JobConnect</span>
            </Link>
            <p>
              The next-generation career ecosystem bridging high-performing engineering, design, and product talent with world-class employers.
            </p>
            <div style={{ display: "flex", gap: 12, color: "#64748b" }}>
              <div className="tag" style={{ background: "#f1f5f9", color: "#475569", borderColor: "#e2e8f0" }}>
                <Shield size={13} /> 100% Verified Listings
              </div>
            </div>
          </div>

          {/* Candidates Col */}
          <div>
            <h4 className="footer-heading">For Candidates</h4>
            <div className="footer-links-list">
              <Link to="/jobs">Explore All Jobs</Link>
              <Link to="/jobs?jobType=Full-time">Remote Opportunities</Link>
              <Link to="/jobs?jobType=Internship">Internship Programs</Link>
              <Link to="/register">Create Seeker Profile</Link>
            </div>
          </div>

          {/* Employers Col */}
          <div>
            <h4 className="footer-heading">For Employers</h4>
            <div className="footer-links-list">
              <Link to="/create-job">Post an Opportunity</Link>
              <Link to="/recruiter">Talent Dashboard</Link>
              <Link to="/register">Recruiter Onboarding</Link>
              <Link to="/recruiter/applications">Pipeline Management</Link>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="footer-heading">Popular Categories</h4>
            <div className="footer-links-list">
              <Link to="/jobs?search=Frontend">Frontend Engineering</Link>
              <Link to="/jobs?search=Backend">Backend & Cloud</Link>
              <Link to="/jobs?search=Fullstack">Full Stack MERN</Link>
              <Link to="/jobs?search=AI">AI & Machine Learning</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} JobConnect Inc. All rights reserved. Crafted with glassmorphic precision.
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Globe size={14} /> Global Remote Friendly
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

