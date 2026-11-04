import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Star,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, isStudent, isAdmin } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1rem 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '9999px', color: '#c7d2fe', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Sparkles size={16} /> MERN Full-Stack Course Evaluation Platform
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.15, marginBottom: '1.25rem', maxWidth: '850px', margin: '0 auto 1.25rem' }}>
          Empowering Academic Excellence with <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Honest Student Feedback</span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto 2.25rem' }}>
          Streamline faculty and curriculum evaluations with seamless student submissions, instant sentiment classification, and administrative analytics.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-primary btn-lg">
                <GraduationCap size={20} /> Student Portal <ArrowRight size={18} />
              </Link>
              <Link to="/admin/login" className="btn btn-secondary btn-lg">
                <ShieldCheck size={20} /> Admin Portal
              </Link>
            </>
          ) : isStudent ? (
            <Link to="/student/dashboard" className="btn btn-primary btn-lg">
              Go to Student Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <Link to="/admin/dashboard" className="btn btn-primary btn-lg">
              Go to Admin Analytics <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </section>

      {/* Demo Credentials Quick Guide */}
      <section style={{ maxWidth: '780px', margin: '1rem auto 3.5rem' }}>
        <div className="card" style={{ background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#a5b4fc', fontWeight: 700, fontSize: '0.95rem' }}>
            <CheckCircle2 size={18} /> Pre-Seeded Demo Test Accounts (Ready to Test):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
              <span style={{ color: '#818cf8', fontWeight: 600 }}>🎓 Student Account:</span><br />
              Roll No: <code style={{ color: '#fff', background: '#1f2937', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>CS202601</code><br />
              Password: <code style={{ color: '#fff', background: '#1f2937', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>student123</code>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
              <span style={{ color: '#c084fc', fontWeight: 600 }}>🛡️ Admin Account:</span><br />
              Username: <code style={{ color: '#fff', background: '#1f2937', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>admin</code> (or admin@college.edu)<br />
              Password: <code style={{ color: '#fff', background: '#1f2937', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>admin123</code>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
        <div className="card">
          <div className="stat-icon primary" style={{ marginBottom: '1.25rem' }}>
            <GraduationCap size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Student Experience</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.925rem' }}>
            Simple authentication with Roll No, intuitive course dropdowns, interactive 5-star rating metrics, and personal evaluation logs.
          </p>
        </div>

        <div className="card">
          <div className="stat-icon emerald" style={{ marginBottom: '1.25rem' }}>
            <BarChart3 size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Administrative Analytics</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.925rem' }}>
            Comprehensive analytics dashboard with real-time score averages, department rating distribution, and sentiment breakdown.
          </p>
        </div>

        <div className="card">
          <div className="stat-icon amber" style={{ marginBottom: '1.25rem' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Robust Architecture</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.925rem' }}>
            Full MERN stack with secure JWT sessions, bcrypt password hashing, Mongoose schemas, and automated MongoDB database seeding.
          </p>
        </div>
      </section>
    </div>
  );
};
