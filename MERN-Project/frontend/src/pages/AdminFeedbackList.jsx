import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StarRating } from '../components/StarRating';
import {
  FileText,
  Search,
  Filter,
  Trash2,
  Download,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const AdminFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [courses, setCourses] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [message, setMessage] = useState('');

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (courseFilter !== 'All') params.course = courseFilter;
      if (ratingFilter !== 'All') params.rating = ratingFilter;

      const data = await api.admin.getAllFeedbacks(params);
      if (data.success) {
        setFeedbacks(data.feedbacks || []);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.courses.getAll();
        if (data.success) setCourses(data.courses || []);
      } catch (ignored) {}
    };
    loadCourses();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadFeedbacks();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, courseFilter, ratingFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student evaluation?')) return;
    try {
      await api.admin.deleteFeedback(id);
      setMessage('Feedback entry successfully deleted.');
      loadFeedbacks();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Error deleting feedback');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Feedback Records Management</h1>
          <p className="page-subtitle">Search, filter, inspect, and moderate all course evaluations</p>
        </div>
        <div style={{ color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 600 }}>
          Total Records: {feedbacks.length}
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Search Keywords</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Student, Roll No, Subject, Faculty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter By Department</label>
            <select
              className="form-select"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              {courses.map(c => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter By Rating</label>
            <select
              className="form-select"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="All">All Ratings (1 - 5)</option>
              <option value="5">5 Stars (Excellent)</option>
              <option value="4">4 Stars (Very Good)</option>
              <option value="3">3 Stars (Good)</option>
              <option value="2">2 Stars (Fair)</option>
              <option value="1">1 Star (Poor)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          Querying feedback records...
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <p style={{ color: '#9ca3af', fontSize: '1rem' }}>No feedback submissions match the current filters.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Department & Subject</th>
                <th>Instructor</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Sentiment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f) => (
                <tr key={f._id}>
                  <td>
                    <strong style={{ color: '#fff' }}>{f.studentName}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'monospace' }}>
                      {f.rollNo}
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: '#e5e7eb' }}>{f.subject}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{f.course}</div>
                  </td>
                  <td>{f.facultyName}</td>
                  <td>
                    <StarRating rating={f.rating} readonly size={16} />
                  </td>
                  <td style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {f.comments}
                  </td>
                  <td>
                    <span className={`badge badge-${(f.sentiment || 'positive').toLowerCase()}`}>
                      {f.sentiment || 'Positive'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {new Date(f.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => setSelectedItem(f)}
                        className="btn btn-secondary btn-sm"
                        title="View details"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete feedback"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="card"
            style={{ maxWidth: '540px', width: '100%', background: '#111827', borderColor: 'rgba(99, 102, 241, 0.4)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-course" style={{ marginBottom: '0.4rem' }}>
                  {selectedItem.course}
                </span>
                <h3 style={{ fontSize: '1.3rem' }}>{selectedItem.subject}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  Instructor: <strong style={{ color: '#fff' }}>{selectedItem.facultyName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="btn btn-secondary btn-sm"
              >
                ✕
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Overall Rating:</span>
                <StarRating rating={selectedItem.rating} readonly size={18} />
              </div>
              {selectedItem.categoryRatings && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
                  <div>Content Clarity: <strong style={{ color: '#fbbf24' }}>{selectedItem.categoryRatings.contentClarity}★</strong></div>
                  <div>Teaching Quality: <strong style={{ color: '#fbbf24' }}>{selectedItem.categoryRatings.teachingQuality}★</strong></div>
                  <div>Course Pace: <strong style={{ color: '#fbbf24' }}>{selectedItem.categoryRatings.coursePace}★</strong></div>
                  <div>Practical/Lab: <strong style={{ color: '#fbbf24' }}>{selectedItem.categoryRatings.practicalLab}★</strong></div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.85rem', color: '#a5b4fc' }}>
                Student Written Feedback:
              </label>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontStyle: 'italic', color: '#e5e7eb', lineHeight: 1.6 }}>
                "{selectedItem.comments}"
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#9ca3af' }}>
              <div>
                Submitted by: <strong style={{ color: '#fff' }}>{selectedItem.studentName}</strong> ({selectedItem.rollNo})
              </div>
              <div>{new Date(selectedItem.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
