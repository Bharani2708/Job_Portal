import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import LottiePlayer from "../components/LottiePlayer";
import authAnimData from "../assets/animations/authAnimation.json";
import api from "../api";
import { setCredentials } from "../redux/authSlice";
import { 
  User, 
  Mail, 
  Lock, 
  UserCheck, 
  Briefcase, 
  UserPlus, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound,
  RotateCw,
  Info
} from "lucide-react";

export default function Register() {
  const [step, setStep] = useState("register"); // 'register' | 'otp'
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker"
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Password Strength Calculations
  const passwordCriteria = [
    { label: "At least 8 characters", valid: form.password.length >= 8 },
    { label: "Uppercase letter (A-Z)", valid: /[A-Z]/.test(form.password) },
    { label: "Lowercase letter (a-z)", valid: /[a-z]/.test(form.password) },
    { label: "Number (0-9)", valid: /[0-9]/.test(form.password) },
    { label: "Special symbol (!@#$%^&*)", valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) }
  ];

  const strengthScore = passwordCriteria.filter((c) => c.valid).length;
  const getStrengthColor = () => {
    if (strengthScore <= 2) return "#ef4444"; // red
    if (strengthScore <= 4) return "#f59e0b"; // yellow / amber
    return "#10b981"; // green
  };
  const getStrengthLabel = () => {
    if (strengthScore === 0) return "";
    if (strengthScore <= 2) return "Weak Password";
    if (strengthScore <= 4) return "Medium Strength";
    return "Strong Password";
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const submitRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (strengthScore < 5) {
      setError("Please ensure your password satisfies all 5 security requirements below.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", form);
      if (data.requiresVerification) {
        setStep("otp");
        setSuccessMsg(data.message || "Verification OTP sent to your email.");
        setResendTimer(60);
      } else {
        dispatch(setCredentials(data));
        navigate(data.user.role === "recruiter" ? "/recruiter" : "/seeker");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/verify-otp", {
        email: form.email,
        otp: otp.trim()
      });
      dispatch(setCredentials(data));
      navigate(data.user.role === "recruiter" ? "/recruiter" : "/seeker");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/resend-otp", { email: form.email });
      setSuccessMsg(data.message || "A new OTP has been sent to your email.");
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: step === "otp" ? 480 : 540 }}>
      <div style={{ width: 100, height: 100, margin: "0 auto 6px" }}>
        <LottiePlayer animationData={authAnimData} loop={true} />
      </div>

      {step === "register" ? (
        <>
          <div className="form-header">
            <h2>Join JobConnect India</h2>
            <p>Create your verified account to start applying or hiring top Indian talent.</p>
          </div>

          {error && (
            <div className="error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submitRegister}>
            {/* Account Type Selector */}
            <div className="form-group">
              <label>I want to join as</label>
              <div className="role-selector-group">
                <div 
                  className={`role-card-option ${form.role === "jobseeker" ? "active" : ""}`}
                  onClick={() => setForm({ ...form, role: "jobseeker" })}
                >
                  <UserCheck size={24} color={form.role === "jobseeker" ? "#0284c7" : "#64748b"} />
                  <strong>Job Seeker</strong>
                  <span>Looking for tech roles</span>
                </div>

                <div 
                  className={`role-card-option ${form.role === "recruiter" ? "active" : ""}`}
                  onClick={() => setForm({ ...form, role: "recruiter" })}
                >
                  <Briefcase size={24} color={form.role === "recruiter" ? "#0284c7" : "#64748b"} />
                  <strong>Recruiter</strong>
                  <span>Hiring tech candidates</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="name@company.com or personal email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Strong Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="password-meter-wrap">
                  <div className="password-meter-header">
                    <span style={{ color: getStrengthColor(), fontWeight: 700 }}>
                      {getStrengthLabel()}
                    </span>
                    <span>{strengthScore}/5 Criteria Met</span>
                  </div>
                  <div className="password-meter-bars">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div
                        key={idx}
                        className="password-meter-segment"
                        style={{
                          background: idx <= strengthScore ? getStrengthColor() : "#e2e8f0"
                        }}
                      />
                    ))}
                  </div>
                  <div className="password-checklist">
                    {passwordCriteria.map((c, i) => (
                      <div key={i} className={`password-check-item ${c.valid ? 'valid' : ''}`}>
                        {c.valid ? <CheckCircle size={13} color="#10b981" /> : <div className="check-dot" />}
                        <span>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="button" type="submit" disabled={loading} style={{ marginTop: 16 }}>
              <UserPlus size={18} />
              <span>{loading ? "Sending Verification Code..." : "Continue to Email Verification"}</span>
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, color: "#64748b", fontSize: 14.5 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#0284c7", fontWeight: 700 }}>
              Sign In
            </Link>
          </p>
        </>
      ) : (
        /* OTP Verification Screen */
        <div className="otp-screen-container">
          <div className="form-header">
            <div className="otp-icon-bubble">
              <ShieldCheck size={32} color="#0284c7" />
            </div>
            <h2>Verify Your Email</h2>
            <p>
              We sent a 6-digit code and a <strong>1-click verification link</strong> to <br />
              <strong style={{ color: "#0f172a" }}>{form.email}</strong>.
              <br />
              <span style={{ fontSize: 13, color: "#64748b" }}>You can click the link in your email or enter the OTP below:</span>
            </p>
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

          <form onSubmit={submitOtp}>
            <div className="form-group">
              <label style={{ textAlign: "center", display: "block", marginBottom: 12 }}>
                Enter 6-Digit OTP Code
              </label>
              <div className="input-with-icon" style={{ maxWidth: 260, margin: "0 auto" }}>
                <KeyRound size={20} className="input-icon" />
                <input
                  type="text"
                  maxLength="6"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  style={{
                    letterSpacing: 8,
                    fontSize: 24,
                    textAlign: "center",
                    fontWeight: 800,
                    fontFamily: "monospace"
                  }}
                  required
                />
              </div>
            </div>

            <button 
              className="button" 
              type="submit" 
              disabled={loading || otp.length < 6}
              style={{ marginTop: 20 }}
            >
              <CheckCircle size={18} />
              <span>{loading ? "Verifying..." : "Verify & Activate Account"}</span>
            </button>
          </form>

          <div className="otp-resend-row">
            {resendTimer > 0 ? (
              <span style={{ color: "#64748b", fontSize: 13.5 }}>
                Resend code in <strong>{resendTimer}s</strong>
              </span>
            ) : (
              <button 
                type="button" 
                className="btn-resend-otp" 
                onClick={handleResendOtp}
                disabled={loading}
              >
                <RotateCw size={14} />
                <span>Resend OTP Code</span>
              </button>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button 
              type="button" 
              className="link-button" 
              onClick={() => { setStep("register"); setError(""); }}
              style={{ color: "#64748b", fontSize: 13.5 }}
            >
              ← Change email address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
