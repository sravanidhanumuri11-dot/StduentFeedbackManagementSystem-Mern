import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  PenSquare,
  FileText,
  ShieldCheck,
  Users,
  LogOut,
  LogIn
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isStudent, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <span className="brand-text">FeedbackHub</span>
          <span className="badge-tag">MERN</span>
        </Link>

        <nav className="nav-links">
          {/* Guest Links */}
          {!isAuthenticated && (
            <>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LogIn size={16} /> Student Login
              </NavLink>
              <NavLink to="/admin/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <ShieldCheck size={16} /> Admin Portal
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}

          {/* Student Links */}
          {isAuthenticated && isStudent && (
            <>
              <NavLink to="/student/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <NavLink to="/student/submit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <PenSquare size={16} /> Submit Feedback
              </NavLink>
              <NavLink to="/student/my-feedback" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FileText size={16} /> My Feedback
              </NavLink>
            </>
          )}

          {/* Admin Links */}
          {isAuthenticated && isAdmin && (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Analytics
              </NavLink>
              <NavLink to="/admin/feedbacks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FileText size={16} /> All Feedback
              </NavLink>
              <NavLink to="/admin/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Users size={16} /> Students
              </NavLink>
            </>
          )}

          {/* Profile & Logout */}
          {isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <div className="user-pill">
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{user?.name?.split(' ')[0]}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '0.35rem' }}>
                    ({user?.role})
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out of your session"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
