import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { StarRating } from '../components/StarRating';
import {
  FileText,
  Star,
  BookOpen,
  PenSquare,
  ArrowRight,
  Clock,
  Sparkles,
  Trash2
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ count: 0, avgRating: '0.0' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.feedback.getMy();
      if (data.success) {
        setFeedbacks(data.feedbacks || []);
        setStats({ count: data.count, avgRating: data.avgRating });
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback submission?')) return;
    try {
      await api.feedback.delete(id);
      setMessage('Submission deleted successfully.');
      fetchHistory();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Error deleting feedback');
    }
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)', borderColor: 'rgba(99, 102, 241, 0.3)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <Sparkles size={16} /> Student Dashboard
            </div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Welcome back, {user?.name}!</h1>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
              Roll No: <strong style={{ color: '#fff' }}>{user?.rollNo}</strong> &bull; Program: <strong style={{ color: '#fff' }}>{user?.course}</strong>
            </p>
          </div>
          <Link to="/student/submit" className="btn btn-primary btn-lg">
            <PenSquare size={18} /> Submit New Feedback
          </Link>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {/* KPI Stats */}
      <div className="stats-grid">
        <StatCard
          title="Submitted Feedbacks"
          value={stats.count}
          icon={FileText}
          colorScheme="primary"
          subtitle="Total evaluations submitted"
        />
        <StatCard
          title="Average Rating Given"
          value={`${stats.avgRating} ★`}
          icon={Star}
          colorScheme="amber"
          subtitle="Across your submissions"
        />
        <StatCard
          title="Department"
          value={user?.course?.split(' ')[0] || 'General'}
          icon={BookOpen}
          colorScheme="emerald"
          subtitle={user?.course}
        />
      </div>

      {/* Recent Submissions */}
      <div className="page-header" style={{ marginTop: '2.5rem' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '1.45rem' }}>Your Evaluation History</h2>
          <p className="page-subtitle">Recent course and instructor feedback you have submitted</p>
        </div>
        {feedbacks.length > 0 && (
          <Link to="/student/my-feedback" className="btn btn-secondary btn-sm">
            View All ({feedbacks.length}) <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          Loading your submission records...
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div className="stat-icon primary" style={{ margin: '0 auto 1.25rem' }}>
            <PenSquare size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Feedbacks Submitted Yet</h3>
          <p style={{ color: '#9ca3af', maxWidth: '460px', margin: '0 auto 1.5rem', fontSize: '0.925rem' }}>
            Share your voice! Evaluate your subjects and professors to help improve the academic experience.
          </p>
          <Link to="/student/submit" className="btn btn-primary">
            <PenSquare size={16} /> Submit Your First Feedback
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Instructor</th>
                <th>Rating</th>
                <th>Feedback Comments</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.slice(0, 5).map((item) => (
                <tr key={item._id}>
                  <td>
                    <strong style={{ color: '#fff' }}>{item.subject}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.course}</div>
                  </td>
                  <td>{item.facultyName}</td>
                  <td>
                    <StarRating rating={item.rating} readonly size={16} />
                  </td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.comments}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-danger btn-sm"
                      title="Delete this feedback"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
