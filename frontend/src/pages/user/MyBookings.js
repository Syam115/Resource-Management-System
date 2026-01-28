import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await bookingService.cancelBooking(id);
      if (response.success) {
        fetchBookings();
      }
    } catch (error) {
      alert('Failed to cancel booking');
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          You haven't made any bookings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
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

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Start:</span>{' '}
                  {formatDateTime(booking.startTime)}
                </div>
                <div>
                  <span className="text-gray-500">End:</span>{' '}
                  {formatDateTime(booking.endTime)}
                </div>
              </div>

              {booking.purpose && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Purpose:</span> {booking.purpose}
                </p>
              )}

              {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="btn-danger mt-4"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
