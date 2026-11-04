import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StarRating } from '../components/StarRating';
import {
  FileText,
  Calendar,
  Trash2,
  PenSquare,
  BookOpen,
  User,
  AlertCircle
} from 'lucide-react';

export const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await api.feedback.getMy();
      if (data.success) {
        setFeedbacks(data.feedbacks || []);
      }
    } catch (err) {
      setError(err.message || 'Error loading feedback history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this evaluation?')) return;
    try {
      await api.feedback.delete(id);
      fetchFeedbacks();
    } catch (err) {
      alert(err.message || 'Error deleting feedback');
    }
  };

  const filtered = feedbacks.filter(f =>
    f.subject.toLowerCase().includes(search.toLowerCase()) ||
    f.facultyName.toLowerCase().includes(search.toLowerCase()) ||
    f.comments.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Feedback Submissions</h1>
          <p className="page-subtitle">All course and professor evaluations submitted from your student account</p>
        </div>
        <Link to="/student/submit" className="btn btn-primary">
          <PenSquare size={16} /> Submit New Feedback
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      {feedbacks.length > 0 && (
        <div style={{ marginBottom: '1.75rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search your feedbacks by subject, instructor, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '420px' }}
          />
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          Loading your submission records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div className="stat-icon primary" style={{ margin: '0 auto 1.25rem' }}>
            <FileText size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            {feedbacks.length === 0 ? 'No Submissions Yet' : 'No matching feedbacks found'}
          </h3>
          <p style={{ color: '#9ca3af', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.925rem' }}>
            {feedbacks.length === 0
              ? 'Submit feedback for your registered subjects and faculty to see them here.'
              : 'Try searching with a different keyword or instructor name.'}
          </p>
          {feedbacks.length === 0 && (
            <Link to="/student/submit" className="btn btn-primary">
              <PenSquare size={16} /> Submit Feedback Now
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((item) => (
            <div key={item._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span className="badge badge-course" style={{ marginBottom: '0.35rem' }}>
                      {item.course}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>{item.subject}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-danger btn-sm"
                    title="Delete feedback"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  <User size={14} /> Instructor: <strong style={{ color: '#e5e7eb' }}>{item.facultyName}</strong>
                </div>

                <div style={{ marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Overall Rating:</span>
                    <StarRating rating={item.rating} readonly size={16} />
                  </div>
                  {item.categoryRatings && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                      <div>Clarity: <strong style={{ color: '#fbbf24' }}>{item.categoryRatings.contentClarity}★</strong></div>
                      <div>Teaching: <strong style={{ color: '#fbbf24' }}>{item.categoryRatings.teachingQuality}★</strong></div>
                      <div>Pace: <strong style={{ color: '#fbbf24' }}>{item.categoryRatings.coursePace}★</strong></div>
                      <div>Lab: <strong style={{ color: '#fbbf24' }}>{item.categoryRatings.practicalLab}★</strong></div>
                    </div>
                  )}
                </div>

                <p style={{ color: '#d1d5db', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.5 }}>
                  "{item.comments}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#6b7280' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={13} /> {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className={`badge badge-${(item.sentiment || 'positive').toLowerCase()}`}>
                  {item.sentiment || 'Positive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
