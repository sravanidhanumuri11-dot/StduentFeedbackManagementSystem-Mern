import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, AlertCircle, Sparkles } from 'lucide-react';

export const StudentLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginStudent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginStudent(identifier, password);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setIdentifier('CS202601');
    setPassword('student123');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <div className="card card-glass" style={{ padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
            <GraduationCap size={28} />
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>Student Portal</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Sign in to submit your course evaluations</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Roll Number or Student Email</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CS202601 or student@college.edu"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In to Portal</>}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={fillDemo}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginBottom: '1.25rem', fontSize: '0.825rem' }}
          >
            <Sparkles size={14} /> Auto-fill Demo Student (CS202601)
          </button>

          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
