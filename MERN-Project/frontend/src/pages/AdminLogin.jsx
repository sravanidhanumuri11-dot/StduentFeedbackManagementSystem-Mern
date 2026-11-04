import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, AlertCircle, Sparkles } from 'lucide-react';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <div className="card card-glass" style={{ padding: '2.25rem', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            className="brand-icon"
            style={{
              margin: '0 auto 1rem',
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>Admin Portal</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Administrative evaluation and analytics console</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Administrator Username or Email</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. admin or admin@college.edu"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            style={{
              width: '100%',
              marginTop: '0.5rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)'
            }}
            disabled={loading}
          >
            {loading ? 'Verifying Credentials...' : <><LogIn size={18} /> Enter Admin Console</>}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', fontSize: '0.825rem' }}
          >
            <Sparkles size={14} /> Auto-fill Demo Admin (admin / admin123)
          </button>
        </div>
      </div>
    </div>
  );
};
