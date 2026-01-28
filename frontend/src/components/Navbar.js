import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isServicer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Resource Manager
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isServicer() ? (
                  <>
                    <Link to="/servicer/dashboard" className="hover:text-primary-200">
                      Dashboard
                    </Link>
                    <Link to="/servicer/categories" className="hover:text-primary-200">
                      Categories
                    </Link>
                    <Link to="/servicer/resources" className="hover:text-primary-200">
                      Resources
                    </Link>
                    <Link to="/servicer/bookings" className="hover:text-primary-200">
                      Bookings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/user/browse" className="hover:text-primary-200">
                      Browse
                    </Link>
                    <Link to="/user/my-bookings" className="hover:text-primary-200">
                      My Bookings
                    </Link>
                  </>
                )}
                <span className="text-primary-200">|</span>
                <span className="text-sm">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-primary-700 px-3 py-1 rounded hover:bg-primary-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-4 py-1 rounded hover:bg-primary-50"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
