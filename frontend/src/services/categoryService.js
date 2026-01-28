import api from './api';

export const categoryService = {
  // Public endpoints
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Servicer endpoints
  getMyCategories: async () => {
    const response = await api.get('/servicer/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/servicer/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/servicer/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/servicer/categories/${id}`);
    return response.data;
  },
};
