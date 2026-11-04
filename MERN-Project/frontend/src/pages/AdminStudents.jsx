import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, Search, GraduationCap, Mail, Hash, Calendar } from 'lucide-react';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await api.admin.getStudents();
        if (data.success && data.students) {
          setStudents(data.students);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNo && s.rollNo.toLowerCase().includes(search.toLowerCase())) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Registered Students Roster</h1>
          <p className="page-subtitle">Inspect enrolled students and their feedback submission participation</p>
        </div>
        <div style={{ color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 600 }}>
          Total Enrolled: {students.length}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.75rem', maxWidth: '420px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by student name, roll no, email, or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          Loading student roster...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#9ca3af' }}>No students found matching your search.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Email</th>
                <th>Department / Course</th>
                <th>Submissions</th>
                <th>Enrolled Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <strong style={{ color: '#fff' }}>{s.name}</strong>
                    </div>
                  </td>
                  <td>
                    <code style={{ color: '#818cf8', background: 'rgba(99, 102, 241, 0.1)', padding: '0.2rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                      {s.rollNo || 'N/A'}
                    </code>
                  </td>
                  <td>{s.email}</td>
                  <td>
                    <span className="badge badge-course">{s.course}</span>
                  </td>
                  <td>
                    <strong style={{ color: s.feedbackCount > 0 ? '#10b981' : '#9ca3af' }}>
                      {s.feedbackCount} {s.feedbackCount === 1 ? 'review' : 'reviews'}
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {new Date(s.createdAt).toLocaleDateString()}
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
