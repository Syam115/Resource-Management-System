import api from './api';

export const bookingService = {
  // User endpoints
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Servicer endpoints
  getBookingRequests: async (pendingOnly = false) => {
    const response = await api.get(`/servicer/bookings?pendingOnly=${pendingOnly}`);
    return response.data;
  },

  approveBooking: async (id) => {
    const response = await api.put(`/servicer/bookings/${id}/approve`);
    return response.data;
  },

  rejectBooking: async (id) => {
    const response = await api.put(`/servicer/bookings/${id}/reject`);
    return response.data;
  },
};
