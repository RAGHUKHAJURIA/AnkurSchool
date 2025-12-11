import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GalleryModal from '../components/GalleryModal';
import { getFileUrl } from '../utils/fileUtils.jsx';
import { Camera, Filter, Search, Edit, Trash2, Plus, Eye, Calendar, Tag } from 'lucide-react';

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Get user and auth info from Clerk
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();


  // Check if user is admin based on Clerk metadata
  useEffect(() => {
    if (userLoaded && user) {
      const userRole = user.publicMetadata?.role;
      setIsAdmin(userRole === 'admin');
    }
  }, [user, userLoaded]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://ankurschool-v6d0.onrender.com/api/content/type/gallery');

        // Check if response structure is different than expected
        if (response.status === 200) {
          // Handle different possible response structures
          const responseData = response.data;

          if (Array.isArray(responseData)) {
            // If the API returns an array directly
            setGalleries(responseData);
          } else if (responseData.data && Array.isArray(responseData.data)) {
            // If the API returns { data: [...] }
            if (responseData.data[0]) {
            }
            setGalleries(responseData.data);
          } else if (responseData.galleries && Array.isArray(responseData.galleries)) {
            // If the API returns { galleries: [...] }
            setGalleries(responseData.galleries);
          } else {
            console.error('Unexpected API response structure:', responseData);
            setError('Unexpected data format received from server');
          }

          setError(null);
        }
      } catch (error) {
        console.error('Error fetching galleries:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch galleries');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      const response = await axios.delete(`https://ankurschool-v6d0.onrender.com/api/content/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setGalleries(galleries.filter(gallery => gallery._id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
      alert(error.response?.data?.message || 'Failed to delete gallery');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const formData = new FormData(e.target);
      const updateData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category')
      };

      const response = await axios.put(
        `https://ankurschool-v6d0.onrender.com/api/content/${editingGallery._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        // Handle different response structures
        const updatedGallery = response.data.data || response.data;
        setGalleries(galleries.map(gallery =>
          gallery._id === editingGallery._id ? updatedGallery : gallery
        ));
        setShowEditModal(false);
        setEditingGallery(null);
      }
    } catch (error) {
      console.error('Error updating gallery:', error);
      alert(error.response?.data?.message || 'Failed to update gallery');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const openEditModal = (gallery) => {
    setEditingGallery(gallery);
    setShowEditModal(true);
  };

  const openGalleryModal = (gallery) => {
    setSelectedGallery(gallery);
    setShowGalleryModal(true);
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    setSelectedGallery(null);
  };

  // Extract unique categories for filtering
  const categories = ['all', 'event', 'campus', 'classroom', 'sports', 'cultural', 'other'];
  const filteredGalleries = activeCategory === 'all'
    ? galleries
    : galleries.filter(gallery => gallery.category === activeCategory);

  if (!userLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white text-sm font-semibold mb-8 shadow-lg animate-fade-in">
              <Camera className="w-5 h-5 mr-2" />
              School Gallery
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 animate-slide-up">
              Photo <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Gallery</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-200">
              Explore our collection of memorable moments, events, and achievements
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up delay-300">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-out flex items-center gap-2 ${activeCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform -translate-y-0.5'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:transform hover:-translate-y-0.5'
                  }`}
              >
                <Tag className="w-4 h-4" />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto animate-fade-in">
              <p>{error}</p>
            </div>
          ) : filteredGalleries.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto animate-fade-in">
              <p>No galleries available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredGalleries.map((gallery, index) => (
                <div
                  key={gallery._id}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => openEditModal(gallery)}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-md"
                        title="Edit Gallery"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(gallery._id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
                        title="Delete Gallery"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="h-56 overflow-hidden relative">
                    {(() => {
                      // Try to get cover image, fallback to first gallery item
                      const coverImageId = gallery.coverImage || (gallery.items && gallery.items.length > 0 ? gallery.items[0].fileId : null);

                      if (coverImageId) {
                        return (
                          <img
                            src={getFileUrl(coverImageId)}
                            alt={gallery.title || 'Gallery image'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              // Image failed to load
                            }}
                            onLoad={() => {
                              // Image loaded successfully
                            }}
                          />
                        );
                      } else {
                        return (
                          <div className="h-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </span>
                              <p className="text-xs text-gray-400">No images available</p>
                              <p className="text-xs text-gray-400">Items: {gallery.items?.length || 0}</p>
                            </div>
                          </div>
                        );
                      }
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
                          {gallery.category || 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-1">{gallery.title || 'Untitled Gallery'}</h2>
                    <p className="text-gray-500 text-sm mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(gallery.createdAt)}
                    </p>

                    {gallery.description && (
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{gallery.description}</p>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {gallery.items?.length || 0} items
                      </span>

                      <button
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center shadow-md hover:shadow-lg"
                        onClick={() => openGalleryModal(gallery)}
                      >
                        View Gallery
                        <Eye className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {deleteConfirm === gallery._id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                      <div className="bg-white p-6 rounded-xl max-w-md w-full transform transition-all duration-300 scale-95 animate-scale-in">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Confirm Delete</h3>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this gallery? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(gallery._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && editingGallery && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto transform transition-all duration-300 scale-95 animate-scale-in">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Gallery</h2>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium" htmlFor="title">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={editingGallery.title || ''}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        defaultValue={editingGallery.description || ''}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        rows="4"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 mb-2 font-medium" htmlFor="category">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        defaultValue={editingGallery.category || 'event'}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="event">Event</option>
                        <option value="campus">Campus</option>
                        <option value="classroom">Classroom</option>
                        <option value="sports">Sports</option>
                        <option value="cultural">Cultural</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Update Gallery
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Modal */}
        <GalleryModal
          gallery={selectedGallery}
          isOpen={showGalleryModal}
          onClose={closeGalleryModal}
        />
      </div>

      {/* Footer */}
      <Footer />
      <div />
    </>
  );
};

export default Gallery;