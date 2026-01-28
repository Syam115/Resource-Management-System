import React, { useState, useEffect } from 'react';
import { resourceService } from '../../services/resourceService';
import BookingModal from '../../components/BookingModal';

const BrowseResources = () => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await resourceService.getAllResources(
        selectedCategory || null,
        searchTerm || null
      );
      if (response.success) {
        setResources(response.data);
        // Extract unique categories from resources
        const uniqueCategories = [...new Set(response.data.map(r => r.category))].sort();
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleBookClick = (resource) => {
    setSelectedResource(resource);
    setShowBookingModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Resources</h1>

      {/* Search and Filter */}
      <form onSubmit={handleSearch} className="card mb-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </div>
      </form>

      {/* Resources Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No resources found. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="card hover:shadow-lg transition-shadow">
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
              <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p><span className="font-medium">Category:</span> {resource.category}</p>
                <p><span className="font-medium">Location:</span> {resource.location || 'N/A'}</p>
                <p><span className="font-medium">Capacity:</span> {resource.capacity || 'N/A'}</p>
                <p><span className="font-medium">Provider:</span> {resource.servicerName}</p>
              </div>
              <button
                onClick={() => handleBookClick(resource)}
                disabled={!resource.isAvailable}
                className="btn-primary w-full mt-4"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          resource={selectedResource}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            fetchResources();
          }}
        />
      )}
    </div>
  );
};

export default BrowseResources;
