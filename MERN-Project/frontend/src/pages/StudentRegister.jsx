import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    course: 'Computer Science & Engineering',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerStudent(formData);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div className="card card-glass" style={{ padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>Student Registration</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Create your FeedbackHub student account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Aarav Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Roll Number</label>
            <input
              type="text"
              name="rollNo"
              className="form-input"
              placeholder="e.g. CS202699"
              value={formData.rollNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Student Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="e.g. aarav@college.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Enrolled Department / Course</label>
            <select
              name="course"
              className="form-select"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Create Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : <><UserPlus size={18} /> Complete Registration</>}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
