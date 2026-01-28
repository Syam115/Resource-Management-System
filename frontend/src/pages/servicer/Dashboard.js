import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../../services/resourceService';
import { bookingService } from '../../services/bookingService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    resources: 0,
    pendingBookings: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [resourcesRes, bookingsRes] = await Promise.all([
        resourceService.getMyResources(),
        bookingService.getBookingRequests(),
      ]);

      // Calculate unique categories from resources
      const uniqueCategories = resourcesRes.success 
        ? [...new Set(resourcesRes.data.map(r => r.category))].length
        : 0;

      setStats({
        categories: uniqueCategories,
        resources: resourcesRes.success ? resourcesRes.data.length : 0,
        pendingBookings: bookingsRes.success 
          ? bookingsRes.data.filter(b => b.status === 'PENDING').length 
          : 0,
        totalBookings: bookingsRes.success ? bookingsRes.data.length : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Servicer Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-50">
          <h3 className="text-gray-600 text-sm">Categories</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.categories}</p>
          <p className="text-blue-600 text-xs">Unique categories</p>
        </div>

        <div className="card bg-green-50">
          <h3 className="text-gray-600 text-sm">Resources</h3>
          <p className="text-3xl font-bold text-green-600">{stats.resources}</p>
          <Link to="/servicer/resources" className="text-green-600 text-sm hover:underline">
            Manage →
          </Link>
        </div>

        <div className="card bg-yellow-50">
          <h3 className="text-gray-600 text-sm">Pending Bookings</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
          <Link to="/servicer/bookings" className="text-yellow-600 text-sm hover:underline">
            Review →
          </Link>
        </div>

        <div className="card bg-purple-50">
          <h3 className="text-gray-600 text-sm">Total Bookings</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalBookings}</p>
          <Link to="/servicer/bookings" className="text-purple-600 text-sm hover:underline">
            View All →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/servicer/resources" className="btn-primary">
            + Add Resource
          </Link>
          <Link to="/servicer/bookings" className="btn-secondary">
            Review Pending Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
