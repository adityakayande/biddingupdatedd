import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiUser } from 'react-icons/fi';
import api from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (token) {
      const fetchNotifications = async () => {
        try {
          const res = await api.get("/notifications/");
          setNotifications(res.data);
        } catch (err) {
          console.error("Failed to fetch notifications");
        }
      };
      fetchNotifications();
      // Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 navbar-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="font-display font-bold text-xl text-white">B</span>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Bid<span className="text-primary">Sync</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/" className="transition-colors font-medium" style={{ color: 'var(--text-muted)' }}>Home</Link>
            {token ? (
              <>
                <Link to="/dashboard" className="transition-colors font-medium" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
                <Link to="/create-listing" className="transition-colors font-medium" style={{ color: 'var(--text-muted)' }}>List Item</Link>

                <Link to="/profile" className="transition-colors" style={{ color: 'var(--text-muted)' }} title="My Profile">
                  <FiUser size={20} />
                </Link>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <FiBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 glass-card shadow-2xl rounded-xl overflow-hidden z-50">
                      <div
                        className="p-4 border-b flex justify-between items-center"
                        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-panel)' }}
                      >
                        <h3 className="font-bold" style={{ color: 'var(--text-heading)' }}>Notifications</h3>
                        <span className="text-xs text-primary font-medium">{unreadCount} New</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map(notification => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b transition-colors cursor-pointer ${!notification.is_read ? 'bg-primary/5' : ''}`}
                              style={{ borderColor: 'var(--border-soft)' }}
                              onClick={() => !notification.is_read && markAsRead(notification.id)}
                            >
                              <p className="text-sm" style={{ color: !notification.is_read ? 'var(--text-base)' : 'var(--text-muted)' }}>
                                {notification.message}
                              </p>
                              <p className="text-xs mt-2" style={{ color: 'var(--text-soft)' }}>
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="btn-secondary !px-5 !py-2 !text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="transition-colors font-medium" style={{ color: 'var(--text-muted)' }}>Login</Link>
                <Link to="/register" className="btn-primary !px-5 !py-2 !text-sm">
                  Sign Up
                </Link>
              </>
            )}

            {/* ── Theme Toggle ── */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="theme-toggle"
            >
              <span className="theme-toggle-track">
                <span className={`theme-toggle-thumb ${isDark ? '' : 'is-light'}`}>
                  {isDark ? '🌙' : '☀️'}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
