import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { 
  PlusCircle, 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  Code, 
  FileText, 
  AlertCircle,
  ArrowLeft
} from "lucide-react";

const initial = {
  title: "",
  description: "",
  company: "",
  location: "",
  salary: "",
  skills: "",
  experience: "Fresher",
  jobType: "Full-time"
};

export default function CreateJob() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/jobs", form);
      navigate("/recruiter");
    } catch (err) {
      setError(err.response?.data?.message || "Could not publish job listing. Please check required fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto" }}>
      <Link to="/recruiter" className="button secondary small-button" style={{ marginBottom: 20 }}>
        <ArrowLeft size={15} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="form-card wide">
        <div className="form-header">
          <h2>Post a Tech Job Opening</h2>
          <p>Publish a comprehensive role listing to reach high-caliber candidates across India.</p>
        </div>

        {error && (
          <div className="error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>Job Title</label>
              <div className="input-with-icon">
                <Briefcase size={18} className="input-icon" />
                <input 
                  name="title" 
                  placeholder="e.g. Senior MERN Stack Developer" 
                  value={form.title} 
                  onChange={change} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <div className="input-with-icon">
                <Building2 size={18} className="input-icon" />
                <input 
                  name="company" 
                  placeholder="e.g. Swiggy, Razorpay, Zoho" 
                  value={form.company} 
                  onChange={change} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input 
                  name="location" 
                  placeholder="e.g. Bangalore, Chennai, Hyderabad, Remote" 
                  value={form.location} 
                  onChange={change} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Salary / CTC (in ₹ LPA)</label>
              <div className="input-with-icon">
                <span className="input-icon" style={{ fontSize: 16, fontWeight: 800, color: "#64748b" }}>₹</span>
                <input 
                  name="salary" 
                  value={form.salary} 
                  onChange={change} 
                  placeholder="e.g. ₹8 - ₹14 LPA / ₹25 - ₹40 LPA" 
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Experience Level</label>
              <div className="input-with-icon">
                <Clock size={18} className="input-icon" />
                <input 
                  name="experience" 
                  placeholder="e.g. Fresher / 2-4 Years / 5+ Years" 
                  value={form.experience} 
                  onChange={change} 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Employment Type</label>
              <select name="jobType" value={form.jobType} onChange={change}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Required Skills (comma separated)</label>
            <div className="input-with-icon">
              <Code size={18} className="input-icon" />
              <input 
                name="skills" 
                value={form.skills} 
                onChange={change} 
                placeholder="React, Node.js, Express, MongoDB, JavaScript" 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Job Description & Key Responsibilities</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={change} 
              rows="7" 
              placeholder="Detail role requirements, tech stack, team setup, and perks..." 
              required 
            />
          </div>

          <button className="button" type="submit" disabled={loading} style={{ marginTop: 12 }}>
            <PlusCircle size={18} />
            <span>{loading ? "Publishing Opening..." : "Publish Job Opening"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
