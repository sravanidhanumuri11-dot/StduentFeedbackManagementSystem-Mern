import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { StarRating } from '../components/StarRating';
import {
  BarChart3,
  Users,
  FileText,
  Star,
  Download,
  ArrowRight,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.admin.getStats();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      const data = await api.admin.exportFeedbacks();
      if (data.success) {
        const jsonStr = JSON.stringify(data.feedbacks, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feedbackhub-evaluation-report-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      alert('Error exporting dataset: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
        Compiling academic analytics and sentiment distributions...
      </div>
    );
  }

  const total = stats?.totalFeedback || 0;
  const dist = stats?.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Institution Evaluation Analytics</h1>
          <p className="page-subtitle">Real-time metrics, student ratings, and faculty evaluation summaries</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExport}
            className="btn btn-secondary"
            disabled={exporting}
          >
            <Download size={16} /> {exporting ? 'Exporting...' : 'Export JSON Dataset'}
          </button>
          <Link to="/admin/feedbacks" className="btn btn-primary">
            <FileText size={16} /> Manage All Feedback
          </Link>
        </div>
      </div>

      {/* Primary KPI Stats */}
      <div className="stats-grid">
        <StatCard
          title="Total Feedback Submissions"
          value={stats?.totalFeedback || 0}
          icon={FileText}
          colorScheme="primary"
          subtitle="Cumulative evaluations"
        />
        <StatCard
          title="Overall Average Rating"
          value={`${stats?.overallAvg || '0.00'} / 5.0`}
          icon={Star}
          colorScheme="amber"
          subtitle="Across all departments"
        />
        <StatCard
          title="Registered Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          colorScheme="emerald"
          subtitle="Active student roster"
        />
        <StatCard
          title="Positive Sentiment Ratio"
          value={`${total > 0 ? Math.round(((stats?.sentiments?.Positive || 0) / total) * 100) : 0}%`}
          icon={TrendingUp}
          colorScheme="cyan"
          subtitle="Favorable evaluation index"
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Rating Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Award size={20} color="#fbbf24" />
            <h3 style={{ fontSize: '1.2rem' }}>Rating Distribution</h3>
          </div>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = dist[stars] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={stars} className="rating-bar-container">
                <span style={{ width: '45px', color: '#fbbf24', fontWeight: 600 }}>{stars} ★</span>
                <div className="rating-bar-track">
                  <div className="rating-bar-fill" style={{ width: `${pct}%` }}></div>
                </div>
                <span style={{ width: '65px', textAlign: 'right', color: '#9ca3af', fontSize: '0.8rem' }}>
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>

        {/* Department / Course Stats */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Layers size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.2rem' }}>Department Performance</h3>
          </div>

          {stats?.courseStats?.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No course breakdown available yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {stats?.courseStats?.map((c) => (
                <div
                  key={c.course}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.925rem' }}>{c.course}</strong>
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{c.count} evaluations</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '1.05rem' }}>{c.avgRating} ★</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Recent Evaluation Stream</h3>
          <Link to="/admin/feedbacks" className="btn btn-secondary btn-sm">
            View All ({total}) <ArrowRight size={14} />
          </Link>
        </div>

        {stats?.recentFeedbacks?.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No evaluations submitted yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Faculty</th>
                  <th>Rating</th>
                  <th>Sentiment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentFeedbacks?.map((f) => (
                  <tr key={f._id}>
                    <td>
                      <strong style={{ color: '#fff' }}>{f.studentName}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{f.rollNo}</div>
                    </td>
                    <td>{f.subject}</td>
                    <td>{f.facultyName}</td>
                    <td>
                      <StarRating rating={f.rating} readonly size={16} />
                    </td>
                    <td>
                      <span className={`badge badge-${(f.sentiment || 'positive').toLowerCase()}`}>
                        {f.sentiment || 'Positive'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
