import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <p style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '0.35rem' }}>
          🎓 FeedbackHub — Student Feedback & Course Evaluation System
        </p>
        <p style={{ fontSize: '0.825rem', color: '#9ca3af' }}>
          Architected with Full MERN Stack: MongoDB • Express.js • React.js • Node.js
        </p>
        <div className="footer-badges">
          <span className="footer-badge">React 18</span>
          <span className="footer-badge">Vite</span>
          <span className="footer-badge">Express 4</span>
          <span className="footer-badge">Node.js 24</span>
          <span className="footer-badge">MongoDB Mongoose</span>
          <span className="footer-badge">JWT Auth</span>
        </div>
      </div>
    </footer>
  );
};
