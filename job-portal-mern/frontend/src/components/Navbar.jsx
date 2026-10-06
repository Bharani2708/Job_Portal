import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import NotificationDropdown from "./NotificationDropdown";
import { 
  Briefcase, 
  Search, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Users, 
  LogOut
} from "lucide-react";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        {/* Brand Logo */}
        <Link className="brand" to="/">
          <div className="brand-icon-box">
            <Briefcase size={20} color="#fff" />
          </div>
          <div className="brand-text-wrap">
            <span className="gradient-text">JobConnect</span>
            <span className="brand-sub-badge">INDIA</span>
          </div>
        </Link>

        {/* Center Navigation Links - Custom per Role */}
        <div className="nav-links">
          {/* Guest Nav */}
          {!user && (
            <>
              <NavLink 
                to="/jobs" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Search size={16} />
                <span>Explore Jobs</span>
                <span className="nav-count-pill">10k+</span>
              </NavLink>

              <NavLink 
                to="/login" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </NavLink>

              <NavLink 
                to="/register" 
                className="button small-button btn-nav-cta"
              >
                <UserPlus size={16} />
                <span>Get Started Free</span>
              </NavLink>
            </>
          )}

          {/* Job Seeker Navigation */}
          {user?.role === "jobseeker" && (
            <>
              <NavLink 
                to="/jobs" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Search size={16} />
                <span>Explore Jobs</span>
                <span className="nav-count-pill">10k+</span>
              </NavLink>
              
              <NavLink 
                to="/seeker" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink 
                to="/applications" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <FileText size={16} />
                <span>My Applications</span>
              </NavLink>
            </>
          )}

          {/* Recruiter Navigation (No Explore Jobs) */}
          {user?.role === "recruiter" && (
            <>
              <NavLink 
                to="/recruiter" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink 
                to="/create-job" 
                className={({ isActive }) => `nav-link nav-link-highlight ${isActive ? 'active' : ''}`}
              >
                <PlusCircle size={16} />
                <span>Post Job</span>
              </NavLink>

              <NavLink 
                to="/recruiter/applications" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Users size={16} />
                <span>Hiring Pipeline</span>
              </NavLink>
            </>
          )}

          {/* Right Action Icons (Notifications, User Tag, Logout) */}
          {user && (
            <div className="actions" style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 10 }}>
              {/* Notification Center */}
              <NotificationDropdown />

              {/* User Identity Chip */}
              <div className="user-badge">
                <div className="user-avatar" style={{ background: user.role === "recruiter" ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "linear-gradient(135deg, #0284c7, #2563eb)" }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span>{user.name?.split(" ")[0]}</span>
                <span className={`user-role-tag ${user.role === "recruiter" ? "tag-recruiter" : "tag-seeker"}`}>
                  {user.role === "recruiter" ? "RECRUITER" : "SEEKER"}
                </span>
              </div>

              {/* Logout Button */}
              <button 
                className="button secondary small-button" 
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
