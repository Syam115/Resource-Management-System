import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import BrowseResources from './pages/user/BrowseResources';
import MyBookings from './pages/user/MyBookings';

// Servicer Pages
import Dashboard from './pages/servicer/Dashboard';
import Categories from './pages/servicer/Categories';
import Resources from './pages/servicer/Resources';
import Bookings from './pages/servicer/Bookings';

const HomePage = () => {
  const { isAuthenticated, isServicer } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Resource Management System
          </h1>
          <p className="text-gray-600 mb-8">
            Book, monitor, and manage shared resources efficiently
          </p>
          <div className="space-x-4">
            <a href="/login" className="btn-primary inline-block">
              Login
            </a>
            <a href="/register" className="btn-secondary inline-block">
              Register
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Redirect based on role
  if (isServicer()) {
    return <Navigate to="/servicer/dashboard" />;
  }
  return <Navigate to="/user/browse" />;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route
            path="/user/browse"
            element={
              <ProtectedRoute requiredRole="USER">
                <BrowseResources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/my-bookings"
            element={
              <ProtectedRoute requiredRole="USER">
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Servicer Routes */}
          <Route
            path="/servicer/dashboard"
            element={
              <ProtectedRoute requiredRole="SERVICER">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/servicer/categories"
            element={
              <ProtectedRoute requiredRole="SERVICER">
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/servicer/resources"
            element={
              <ProtectedRoute requiredRole="SERVICER">
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/servicer/bookings"
            element={
              <ProtectedRoute requiredRole="SERVICER">
                <Bookings />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
