import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const CourseCatalog = React.lazy(() => import('./pages/CourseCatalog').then(m => ({ default: m.CourseCatalog })));
const CourseView = React.lazy(() => import('./pages/CourseView').then(m => ({ default: m.CourseView })));
const Profile = React.lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Classroom = React.lazy(() => import('./pages/Classroom').then(m => ({ default: m.Classroom })));
const University = React.lazy(() => import('./pages/University').then(m => ({ default: m.University })));
const Pricing = React.lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const Catalog = React.lazy(() => import('./pages/Catalog').then(m => ({ default: m.Catalog })));
const Transcript = React.lazy(() => import('./pages/Transcript').then(m => ({ default: m.Transcript })));
const Verify = React.lazy(() => import('./pages/Verify').then(m => ({ default: m.Verify })));
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
            <Suspense fallback={<div className="flex justify-center py-24 text-fog text-sm">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/courses" element={<CourseCatalog />} />
              <Route path="/university" element={<University />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/transcript" element={<Transcript />} />
              <Route path="/verify" element={<Verify />} />
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
            </Suspense>
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
