import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import ManageJobsPage from './pages/recruiter/ManageJobsPage';
import JobFormPage from './pages/recruiter/JobFormPage';
import JobApplicationsPage from './pages/recruiter/JobApplicationsPage';
import RecruiterProfilePage from './pages/recruiter/RecruiterProfilePage';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Recruiter Protected Routes */}
                <Route
                  path="/recruiter/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <RecruiterDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/jobs"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <ManageJobsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/jobs/new"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <JobFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/jobs/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <JobFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/applications"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <JobApplicationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/profile"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <RecruiterProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Candidate Protected Routes */}
                <Route
                  path="/candidate/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['candidate']}>
                      <CandidateDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidate/profile"
                  element={
                    <ProtectedRoute allowedRoles={['candidate']}>
                      <CandidateProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
