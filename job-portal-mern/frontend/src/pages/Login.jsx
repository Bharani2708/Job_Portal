import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import LottiePlayer from "../components/LottiePlayer";
import authAnimData from "../assets/animations/authAnimation.json";
import api from "../api";
import { setCredentials } from "../redux/authSlice";
import { 
  Mail, 
  Lock, 
  LogIn, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound, 
  RotateCw, 
  Info 
} from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  // OTP Verification state
  const [step, setStep] = useState("login"); // 'login' | 'otp'
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const submitLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);
      dispatch(setCredentials(data));
      navigate(data.user.role === "recruiter" ? "/recruiter" : "/seeker");
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.requiresVerification) {
        setStep("otp");
        setSuccessMsg("Your account is not verified yet. Please enter the OTP sent to your email.");
        if (err.response?.data?.devOtp) setDevOtp(err.response.data.devOtp);
        setResendTimer(60);
      } else {
        setError(err.response?.data?.message || "Invalid email or password. Please try again.");
      }
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
      setError(err.response?.data?.message || "Invalid or expired OTP.");
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
      setSuccessMsg("A new verification code has been sent.");
      if (data.devOtp) setDevOtp(data.devOtp);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: 480 }}>
      <div style={{ width: 100, height: 100, margin: "0 auto 6px" }}>
        <LottiePlayer animationData={authAnimData} loop={true} />
      </div>

      {step === "login" ? (
        <>
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your JobConnect candidate or recruiter portal.</p>
          </div>

          {error && (
            <div className="error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submitLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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
            </div>

            <button className="button" type="submit" disabled={loading} style={{ marginTop: 12 }}>
              <LogIn size={18} />
              <span>{loading ? "Signing In..." : "Sign In to Account"}</span>
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, color: "#64748b", fontSize: 14.5 }}>
            Don't have an account yet?{" "}
            <Link to="/register" style={{ color: "#0284c7", fontWeight: 700 }}>
              Create an Account
            </Link>
          </p>
        </>
      ) : (
        <div className="otp-screen-container">
          <div className="form-header">
            <div className="otp-icon-bubble">
              <ShieldCheck size={32} color="#0284c7" />
            </div>
            <h2>Verify Account</h2>
            <p>
              Please enter the 6-digit code sent to <br />
              <strong style={{ color: "#0f172a" }}>{form.email}</strong>
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
              <span>{loading ? "Verifying..." : "Verify & Sign In"}</span>
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
              onClick={() => { setStep("login"); setError(""); }}
              style={{ color: "#64748b", fontSize: 13.5 }}
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
