import React, { useState, useEffect } from 'react';
import { resourceService } from '../../services/resourceService';
import { categoryService } from '../../services/categoryService';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    location: '',
    capacity: '',
    isAvailable: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resourcesRes, categoriesRes] = await Promise.all([
        resourceService.getMyResources(),
        categoryService.getMyCategories(),
      ]);

      if (resourcesRes.success) setResources(resourcesRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
    };

    try {
      let response;
      if (editingId) {
        response = await resourceService.updateResource(editingId, payload);
      } else {
        response = await resourceService.createResource(payload);
      }

      if (response.success) {
        fetchData();
        resetForm();
      } else {
        setError(response.message || 'Operation failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setFormData({
      name: resource.name,
      description: resource.description || '',
      categoryId: resource.categoryId.toString(),
      location: resource.location || '',
      capacity: resource.capacity?.toString() || '',
      isAvailable: resource.isAvailable,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await resourceService.deleteResource(id);
      if (response.success) {
        fetchData();
      }
    } catch (error) {
      alert('Failed to delete resource');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      location: '',
      capacity: '',
      isAvailable: true,
    });
    setError('');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Resources</h1>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn-primary"
          disabled={categories.length === 0}
        >
          + Add Resource
        </button>
      </div>

      {categories.length === 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6">
          Please create a category first before adding resources.
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Resource' : 'Add Resource'}
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Building A, Room 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="input-field"
                  min="1"
                  placeholder="e.g., 10"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isAvailable" className="text-sm text-gray-700">
                  Available for booking
                </label>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resources List */}
      {resources.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No resources yet. Add your first resource to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{resource.name}</h3>
                <span className={`px-2 py-1 text-xs rounded ${
                  resource.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {resource.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{resource.description}</p>
              <div className="text-sm text-gray-500 mt-2 space-y-1">
                <p><span className="font-medium">Category:</span> {resource.categoryName}</p>
                <p><span className="font-medium">Location:</span> {resource.location || 'N/A'}</p>
                <p><span className="font-medium">Capacity:</span> {resource.capacity || 'N/A'}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(resource)}
                  className="btn-secondary text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="btn-danger text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
