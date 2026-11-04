import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StarRating } from '../components/StarRating';
import {
  PenSquare,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  UserCheck,
  Send
} from 'lucide-react';

export const SubmitFeedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(user?.course || 'Computer Science & Engineering');
  const [subject, setSubject] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [rating, setRating] = useState(5);
  const [categoryRatings, setCategoryRatings] = useState({
    contentClarity: 5,
    teachingQuality: 5,
    coursePace: 5,
    practicalLab: 5
  });
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.courses.getAll();
        if (data.success && data.courses) {
          setCourses(data.courses);
          const currentCourseObj = data.courses.find(c => c.name === (user?.course || data.courses[0].name)) || data.courses[0];
          if (currentCourseObj && currentCourseObj.subjects.length > 0) {
            setSubject(currentCourseObj.subjects[0].name);
            setFacultyName(currentCourseObj.subjects[0].faculty);
          }
        }
      } catch (err) {
        console.warn('Using default subjects:', err.message);
      }
    };
    loadCourses();
  }, [user]);

  const handleSubjectChange = (e) => {
    const subjName = e.target.value;
    setSubject(subjName);
    const activeCourseObj = courses.find(c => c.name === selectedCourse);
    if (activeCourseObj) {
      const match = activeCourseObj.subjects.find(s => s.name === subjName);
      if (match) {
        setFacultyName(match.faculty);
      }
    }
  };

  const handleCourseChange = (e) => {
    const courseName = e.target.value;
    setSelectedCourse(courseName);
    const matchCourse = courses.find(c => c.name === courseName);
    if (matchCourse && matchCourse.subjects.length > 0) {
      setSubject(matchCourse.subjects[0].name);
      setFacultyName(matchCourse.subjects[0].faculty);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!comments.trim()) {
      setError('Please provide comments regarding your experience.');
      return;
    }

    setLoading(true);

    try {
      await api.feedback.create({
        course: selectedCourse,
        subject,
        facultyName,
        rating,
        categoryRatings,
        comments
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error submitting feedback.');
      setLoading(false);
    }
  };

  const activeCourseObj = courses.find(c => c.name === selectedCourse);

  return (
    <div style={{ maxWidth: '680px', margin: '1rem auto 3rem' }}>
      <div className="card card-glass" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div className="stat-icon primary">
            <PenSquare size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.65rem', marginBottom: '0.2rem' }}>Course & Faculty Evaluation</h1>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Your feedback is securely recorded and drives institutional improvement.
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>Thank you! Your evaluation has been submitted successfully. Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Academic Department */}
          <div className="form-group">
            <label className="form-label">Academic Program / Department</label>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={handleCourseChange}
              required
            >
              {courses.map(c => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Subject / Module */}
          <div className="form-group">
            <label className="form-label">Subject / Course Module</label>
            <select
              className="form-select"
              value={subject}
              onChange={handleSubjectChange}
              required
            >
              {activeCourseObj?.subjects.map(s => (
                <option key={s.name} value={s.name}>{s.name} ({s.faculty})</option>
              ))}
            </select>
          </div>

          {/* Faculty / Instructor */}
          <div className="form-group">
            <label className="form-label">Lead Faculty / Instructor Name</label>
            <input
              type="text"
              className="form-input"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              placeholder="Instructor Name"
              required
            />
          </div>

          {/* Overall Rating */}
          <div className="form-group" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              Overall Course Rating (Click Stars)
            </label>
            <StarRating
              rating={rating}
              onChange={(val) => setRating(val)}
              size={32}
              showLabel
            />
          </div>

          {/* Category Dimensions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '0.9rem', color: '#a5b4fc', fontWeight: 600 }}>
              Evaluation Dimensions:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#e5e7eb', marginBottom: '0.35rem' }}>Content Clarity</div>
                <StarRating
                  rating={categoryRatings.contentClarity}
                  onChange={(val) => setCategoryRatings({ ...categoryRatings, contentClarity: val })}
                  size={18}
                />
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#e5e7eb', marginBottom: '0.35rem' }}>Teaching Methodology</div>
                <StarRating
                  rating={categoryRatings.teachingQuality}
                  onChange={(val) => setCategoryRatings({ ...categoryRatings, teachingQuality: val })}
                  size={18}
                />
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#e5e7eb', marginBottom: '0.35rem' }}>Course Pace & Delivery</div>
                <StarRating
                  rating={categoryRatings.coursePace}
                  onChange={(val) => setCategoryRatings({ ...categoryRatings, coursePace: val })}
                  size={18}
                />
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#e5e7eb', marginBottom: '0.35rem' }}>Practical / Lab Support</div>
                <StarRating
                  rating={categoryRatings.practicalLab}
                  onChange={(val) => setCategoryRatings({ ...categoryRatings, practicalLab: val })}
                  size={18}
                />
              </div>
            </div>
          </div>

          {/* Qualitative Comments */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label">Detailed Comments & Suggestions</label>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{comments.length} characters</span>
            </div>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Detail your experience, highlights of the teaching, or areas that could be improved..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
            />
            <div className="form-helper">
              Constructive, specific feedback helps faculty adapt their teaching methods effectively.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading || success}
          >
            {loading ? 'Submitting Evaluation...' : <><Send size={18} /> Submit Feedback</>}
          </button>
        </form>
      </div>
    </div>
  );
};
