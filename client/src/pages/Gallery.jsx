import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
        const response = await axios.get('http://localhost:5000/api/content/type/gallery');

        if (response.status === 200) {
          setGalleries(response.data.data);
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
      const response = await axios.delete(`http://localhost:5000/api/content/${id}`, {
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
        `http://localhost:5000/api/content/${editingGallery._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setGalleries(galleries.map(gallery =>
          gallery._id === editingGallery._id ? response.data.data : gallery
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openEditModal = (gallery) => {
    setEditingGallery(gallery);
    setShowEditModal(true);
  };

  if (!userLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Photo Gallery</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : galleries.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No galleries available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
              {isAdmin && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => openEditModal(gallery)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    title="Edit Gallery"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(gallery._id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Delete Gallery"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}

              {gallery.coverImage ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={gallery.coverImage}
                    alt={gallery.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No cover image</span>
                </div>
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{gallery.title}</h2>
                <p className="text-gray-600 mb-2">Created: {formatDate(gallery.createdAt)}</p>

                {gallery.description && (
                  <p className="text-gray-700 mb-3">{gallery.description.substring(0, 100)}...</p>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {gallery.items?.length || 0} items
                  </span>

                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => window.location.href = `/gallery/${gallery.slug}`}
                  >
                    View Gallery
                  </button>
                </div>
              </div>

              {/* Delete Confirmation Modal */}
              {deleteConfirm === gallery._id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                    <p className="mb-6">Are you sure you want to delete this gallery? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(gallery._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Gallery</h2>
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={editingGallery.title}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={editingGallery.description}
                    className="w-full px-3 py-2 border rounded-md"
                    rows="4"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingGallery.category}
                    className="w-full px-3 py-2 border rounded-md"
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
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
  );
};

export default Gallery;
