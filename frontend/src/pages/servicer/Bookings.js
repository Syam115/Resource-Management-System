import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getBookingRequests(filter === 'pending');
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await bookingService.approveBooking(id);
      if (response.success) {
        fetchBookings();
      }
    } catch (error) {
      alert('Failed to approve booking');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) return;

    try {
      const response = await bookingService.rejectBooking(id);
      if (response.success) {
        fetchBookings();
      }
    } catch (error) {
      alert('Failed to reject booking');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter.toUpperCase());

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Booking Requests</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === f 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {filter === 'all' ? '' : filter} bookings found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{booking.resourceName}</h3>
                  <p className="text-gray-600 text-sm">{booking.resourceLocation}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Requested By</span>
                  <span className="font-medium">{booking.userName}</span>
                  <span className="text-gray-500 block text-xs">{booking.userEmail}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Start</span>
                  <span>{formatDateTime(booking.startTime)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">End</span>
                  <span>{formatDateTime(booking.endTime)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Requested On</span>
                  <span>{formatDateTime(booking.createdAt)}</span>
                </div>
              </div>

              {booking.purpose && (
                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Purpose:</span> {booking.purpose}
                </p>
              )}

              {booking.status === 'PENDING' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleApprove(booking.id)}
                    className="btn-success"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(booking.id)}
                    className="btn-danger"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
