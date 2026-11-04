import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { StudentLogin } from './pages/StudentLogin';
import { StudentRegister } from './pages/StudentRegister';
import { StudentDashboard } from './pages/StudentDashboard';
import { SubmitFeedback } from './pages/SubmitFeedback';
import { MyFeedback } from './pages/MyFeedback';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminFeedbackList } from './pages/AdminFeedbackList';
import { AdminStudents } from './pages/AdminStudents';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<StudentLogin />} />
              <Route path="/register" element={<StudentRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/submit"
                element={
                  <ProtectedRoute requiredRole="student">
                    <SubmitFeedback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/my-feedback"
                element={
                  <ProtectedRoute requiredRole="student">
                    <MyFeedback />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/feedbacks"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminFeedbackList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminStudents />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
