import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api";
import { setCredentials } from "../redux/authSlice";
import LottiePlayer from "../components/LottiePlayer";
import successAnimData from "../assets/animations/successAnimation.json";
import authAnimData from "../assets/animations/authAnimation.json";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const otpParam = searchParams.get("otp") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(otpParam);
  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVerify = async (emailToVerify, otpToVerify) => {
    if (!emailToVerify || !otpToVerify) {
      setStatus("error");
      setMessage("Missing email or verification code. Please check your verification link or sign up again.");
      return;
    }

    try {
      setStatus("verifying");
      const { data } = await api.post("/auth/verify-otp", {
        email: emailToVerify,
        otp: otpToVerify
      });

      setStatus("success");
      setMessage(data.message || "Email verified successfully!");
      setUserData(data.user);

      if (data.token) {
        dispatch(setCredentials(data));
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Verification code is invalid or has expired.");
    }
  };

  useEffect(() => {
    if (emailParam && otpParam) {
      handleVerify(emailParam, otpParam);
    } else {
      setStatus("error");
      setMessage("Please enter your verification details or click the link in your verification email.");
    }
  }, [emailParam, otpParam]);

  const handleContinue = () => {
    if (userData?.role === "recruiter") {
      navigate("/recruiter");
    } else if (userData?.role === "jobseeker") {
      navigate("/seeker");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: 480, textAlign: "center" }}>
      {status === "verifying" && (
        <div style={{ padding: "40px 10px" }}>
          <div style={{ width: 110, height: 110, margin: "0 auto 16px" }}>
            <LottiePlayer animationData={authAnimData} loop={true} />
          </div>
          <h2 style={{ fontSize: 22, color: "#0f172a" }}>Verifying Your Account...</h2>
          <p style={{ color: "#64748b", fontSize: 15, marginTop: 6 }}>
            Please wait while we confirm your email address.
          </p>
        </div>
      )}

      {status === "success" && (
        <div style={{ padding: "20px 10px" }}>
          <div style={{ width: 120, height: 120, margin: "0 auto 12px" }}>
            <LottiePlayer animationData={successAnimData} loop={false} />
          </div>
          <div className="hero-pill-badge" style={{ margin: "0 auto 12px", background: "#ecfdf5", borderColor: "#a7f3d0", color: "#047857" }}>
            <CheckCircle2 size={15} />
            <span>Account Verified</span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
            Email Confirmed!
          </h2>
          <p style={{ color: "#475569", fontSize: 15, margin: "10px 0 24px" }}>
            Your account <strong>{email}</strong> has been successfully verified. You can now access all portal features.
          </p>

          <button className="button" onClick={handleContinue} style={{ width: "100%", justifyContent: "center" }}>
            <span>Go to {userData?.role === "recruiter" ? "Recruiter Dashboard" : "Job Seeker Portal"}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {status === "error" && (
        <div style={{ padding: "20px 10px" }}>
          <div className="otp-icon-bubble" style={{ background: "#ffe4e6", margin: "0 auto 16px" }}>
            <AlertCircle size={32} color="#e11d48" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Verification Failed
          </h2>
          <p style={{ color: "#be123c", fontSize: 14.5, margin: "10px 0 20px" }}>
            {message}
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            <Link to="/register" className="button secondary small-button">
              <span>Sign Up Again</span>
            </Link>
            <Link to="/login" className="button small-button">
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

