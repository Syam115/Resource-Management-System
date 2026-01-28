import api from './api';

export const resourceService = {
  // Public endpoints
  getAllResources: async (categoryId, search) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (search) params.append('search', search);
    const response = await api.get(`/resources?${params.toString()}`);
    return response.data;
  },

  getResourceById: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  getResourcesByCategory: async (categoryId) => {
    const response = await api.get(`/resources/category/${categoryId}`);
    return response.data;
  },

  // Servicer endpoints
  getMyResources: async () => {
    const response = await api.get('/servicer/resources');
    return response.data;
  },

  createResource: async (resourceData) => {
    const response = await api.post('/servicer/resources', resourceData);
    return response.data;
  },

  updateResource: async (id, resourceData) => {
    const response = await api.put(`/servicer/resources/${id}`, resourceData);
    return response.data;
  },

  deleteResource: async (id) => {
    const response = await api.delete(`/servicer/resources/${id}`);
    return response.data;
  },
};
