import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Clock, 
  Calendar, 
  FileText, 
  Sparkles, 
  Award, 
  AlertCircle,
  XCircle,
  ArrowRight
} from "lucide-react";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Could not mark as read", err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Could not mark all read", err);
    }
  };

  const handleNotificationClick = async (notif) => {
    // 1. Mark as read
    if (!notif.read) {
      markAsRead(notif._id);
    }

    // 2. Close dropdown
    setIsOpen(false);

    // 3. Navigate to destination
    if (notif.link) {
      // Normalize legacy links like /my-applications to /applications
      let targetLink = notif.link.replace("/my-applications", "/applications");
      navigate(targetLink);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "assessment":
        return <div className="notif-icon-circle bg-blue"><FileText size={14} color="#0284c7" /></div>;
      case "interview":
        return <div className="notif-icon-circle bg-purple"><Calendar size={14} color="#9333ea" /></div>;
      case "offer":
        return <div className="notif-icon-circle bg-amber"><Award size={14} color="#d97706" /></div>;
      case "accepted":
        return <div className="notif-icon-circle bg-green"><Sparkles size={14} color="#16a34a" /></div>;
      case "rejected":
        return <div className="notif-icon-circle bg-rose"><XCircle size={14} color="#dc2626" /></div>;
      default:
        return <div className="notif-icon-circle bg-slate"><Bell size={14} color="#475569" /></div>;
    }
  };

  return (
    <div className="notif-dropdown-wrapper" ref={dropdownRef}>
      <button 
        className="notif-bell-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="notif-badge-pulse">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown-menu">
          <div className="notif-header">
            <div className="notif-header-title">
              <strong>Notifications</strong>
              {unreadCount > 0 && <span className="notif-unread-tag">{unreadCount} New</span>}
            </div>
            {unreadCount > 0 && (
              <button className="notif-mark-all-btn" onClick={markAllRead}>
                <CheckCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={24} color="#94a3b8" />
                <p>No notifications right now</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`notif-item ${!notif.read ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(notif)}
                  role="button"
                  tabIndex={0}
                >
                  {getNotifIcon(notif.type)}
                  <div className="notif-content">
                    <div className="notif-title-row">
                      <h4 className="notif-title">{notif.title}</h4>
                      {!notif.read && (
                        <button 
                          className="notif-read-check-btn" 
                          onClick={(e) => markAsRead(notif._id, e)}
                          title="Mark as read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                    <p className="notif-message">{notif.message}</p>
                    <div className="notif-time-row">
                      <Clock size={11} />
                      <span>
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      {notif.link && (
                        <span className="notif-action-link" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                          <span>Track Progress</span>
                          <ArrowRight size={11} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
