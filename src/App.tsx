import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CourseCatalog } from './pages/CourseCatalog';
import { CourseView } from './pages/CourseView';
import { Profile } from './pages/Profile';
import { Classroom } from './pages/Classroom';
import { University } from './pages/University';
import { Pricing } from './pages/Pricing';
import { Admin } from './pages/Admin';
import { UniAdmin } from './pages/UniAdmin';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/courses" element={<CourseCatalog />} />
              <Route path="/university" element={<University />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Admin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/university-admin"
                element={
                  <PrivateRoute>
                    <UniAdmin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/classroom"
                element={
                  <PrivateRoute>
                    <Classroom />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/course/:courseId" 
                element={
                  <PrivateRoute>
                    <CourseView />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
