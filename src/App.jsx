import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentView from './pages/DocumentView';
import ExpertTasks from './pages/ExpertTasks';
import VerificationInterface from './pages/VerificationInterface';
import AdminDashboard from './pages/AdminDashboard';
import AdminDocuments from './pages/AdminDocuments';
import LandingPage from './pages/LandingPage';
import PasswordReset from './pages/PasswordReset';
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<PasswordReset />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'submitter', 'admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents/:id" element={<DocumentView />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Protected Reviewer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['expert', 'linguist', 'translator']} />}>
          <Route path="/expert/tasks" element={<ExpertTasks />} />
          <Route path="/expert/verify/:id" element={<VerificationInterface />} />
          <Route path="/linguist/tasks" element={<ExpertTasks />} />
          <Route path="/linguist/review/:id" element={<VerificationInterface />} />
          <Route path="/translator/tasks" element={<ExpertTasks />} />
          <Route path="/translator/review/:id" element={<VerificationInterface />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
