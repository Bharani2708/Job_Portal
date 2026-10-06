import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import confetti from "canvas-confetti";
import api from "../api";
import { setCredentials } from "../redux/authSlice";
import LottiePlayer from "../components/LottiePlayer";
import successAnimData from "../assets/animations/successAnimation.json";
import authAnimData from "../assets/animations/authAnimation.json";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const otpParam = searchParams.get("otp") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(otpParam);
  const [status, setStatus] = useState(emailParam && otpParam ? "verifying" : "input"); // 'verifying' | 'success' | 'error' | 'input'
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVerify = async (emailToVerify, otpToVerify) => {
    if (!emailToVerify || !otpToVerify) {
      setStatus("input");
      return;
    }

    try {
      setStatus("verifying");
      const { data } = await api.post("/auth/verify-otp", {
        email: emailToVerify.trim(),
        otp: otpToVerify.trim()
      });

      // Set credentials in Redux & localStorage
      if (data.token) {
        dispatch(setCredentials(data));
        // Set cookie for session persistence
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }

      setStatus("success");
      setMessage(data.message || "Email verified successfully!");
      setUserData(data.user);

      // Trigger Confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Verification code is invalid or has expired.");
    }
  };

  useEffect(() => {
    if (emailParam && otpParam) {
      handleVerify(emailParam, otpParam);
    }
  }, [emailParam, otpParam]);

  // Auto redirect countdown on success
  useEffect(() => {
    let timer;
    if (status === "success") {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      } else {
        const dest = userData?.role === "recruiter" ? "/recruiter" : "/seeker";
        navigate(dest);
      }
    }
    return () => clearTimeout(timer);
  }, [status, countdown, userData, navigate]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleVerify(email, otp);
  };

  return (
    <div className="form-card" style={{ maxWidth: 480, textAlign: "center", margin: "40px auto" }}>
      {/* 1. Verifying Loader */}
      {status === "verifying" && (
        <div style={{ padding: "30px 10px" }}>
          <div style={{ width: 110, height: 110, margin: "0 auto 16px" }}>
            <LottiePlayer animationData={authAnimData} loop={true} />
          </div>
          <div className="hero-pill-badge" style={{ margin: "0 auto 12px" }}>
            <Sparkles size={14} />
            <span>1-Click Verification</span>
          </div>
          <h2 style={{ fontSize: 22, color: "#0f172a", fontWeight: 800 }}>Authenticating Your Account...</h2>
          <p style={{ color: "#64748b", fontSize: 15, marginTop: 6 }}>
            Confirming your email and signing you into JobConnect India.
          </p>
        </div>
      )}

      {/* 2. Success State with Auto-Redirect */}
      {status === "success" && (
        <div style={{ padding: "20px 10px" }}>
          <div style={{ width: 130, height: 130, margin: "0 auto 10px" }}>
            <LottiePlayer animationData={successAnimData} loop={false} />
          </div>
          <div className="hero-pill-badge" style={{ margin: "0 auto 12px", background: "#ecfdf5", borderColor: "#a7f3d0", color: "#047857" }}>
            <CheckCircle2 size={15} />
            <span>Account Verified & Logged In</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>
            Welcome, {userData?.name || "Member"}!
          </h2>
          <p style={{ color: "#475569", fontSize: 15, margin: "10px 0 20px" }}>
            Your account <strong>{email}</strong> is officially verified.
          </p>

          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
            <span style={{ fontSize: 14, color: "#0369a1", fontWeight: 600 }}>
              🚀 Automatically opening your {userData?.role === "recruiter" ? "Recruiter Dashboard" : "Candidate Portal"} in <strong>{countdown}s</strong>...
            </span>
          </div>

          <button 
            className="button" 
            onClick={() => navigate(userData?.role === "recruiter" ? "/recruiter" : "/seeker")} 
            style={{ width: "100%", justifyContent: "center" }}
          >
            <span>Enter Dashboard Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* 3. Manual Input Fallback */}
      {status === "input" && (
        <div style={{ padding: "20px 10px" }}>
          <div className="otp-icon-bubble" style={{ margin: "0 auto 16px" }}>
            <ShieldCheck size={32} color="#0284c7" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Verify Your Email
          </h2>
          <p style={{ color: "#64748b", fontSize: 14.5, margin: "6px 0 20px" }}>
            Enter your email and the 6-digit code (or master demo code <strong>123456</strong>) to activate and log in.
          </p>

          <form onSubmit={handleManualSubmit} style={{ textAlign: "left" }}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>6-Digit OTP Code</label>
              <div className="input-with-icon">
                <KeyRound size={18} className="input-icon" />
                <input
                  type="text"
                  maxLength="6"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  style={{ letterSpacing: 4, fontWeight: 800, fontSize: 18 }}
                  required
                />
              </div>
            </div>

            <button className="button" type="submit" style={{ width: "100%", justifyContent: "center", marginTop: 14 }}>
              <CheckCircle2 size={18} />
              <span>Verify & Auto Login</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. Error State */}
      {status === "error" && (
        <div style={{ padding: "20px 10px" }}>
          <div className="otp-icon-bubble" style={{ background: "#ffe4e6", margin: "0 auto 16px" }}>
            <AlertCircle size={32} color="#e11d48" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Verification Link Expired
          </h2>
          <p style={{ color: "#be123c", fontSize: 14.5, margin: "10px 0 20px" }}>
            {message}
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            <button 
              type="button" 
              className="button secondary small-button"
              onClick={() => { setStatus("input"); setOtp(""); }}
            >
              <span>Enter Code Manually</span>
            </button>
            <Link to="/login" className="button small-button">
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
