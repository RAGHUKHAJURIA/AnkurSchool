import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser, useAuth } from '@clerk/clerk-react'

const Articles = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const { user, isLoaded: userLoaded } = useUser()
  const { getToken } = useAuth()

  // check if user is admin
  useEffect(() => {
    if (userLoaded && user) {
      const userRole = user.publicMetadata?.role
      setIsAdmin(userRole === 'admin')
    }
  }, [user, userLoaded])

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/content/type/article')
      if (response.status === 200) {
        setArticles(response.data.data)
        setError(null)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      setError(error.response?.data?.message || error.message || 'Failed to fetch articles')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = await getToken()
      const response = await axios.delete(`http://localhost:5000/api/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 200) {
        setArticles(articles.filter(article => article._id !== id))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      alert(error.response?.data?.message || 'Failed to delete article')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      const formData = new FormData(e.target)
      const updateData = {
        title: formData.get('title'),
        body: formData.get('body'),
        author: formData.get('author'),
        featuredImage: formData.get('featuredImage'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : []
      }

      const response = await axios.put(
        `http://localhost:5000/api/content/${editingArticle._id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.status === 200) {
        setArticles(articles.map(article =>
          article._id === editingArticle._id ? response.data.data : article
        ))
        setShowEditModal(false)
        setEditingArticle(null)
      }
    } catch (error) {
      console.error('Error updating article:', error)
      alert(error.response?.data?.message || 'Failed to update article')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const openEditModal = (article) => {
    setEditingArticle(article)
    setShowEditModal(true)
  }

  if (!userLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">School Articles</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No articles available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
              {isAdmin && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => openEditModal(article)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    title="Edit Article"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(article._id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Delete Article"
                  >
                    🗑️
                  </button>
                </div>
              )}

              {article.featuredImage ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No featured image</span>
                </div>
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-2">Published: {formatDate(article.createdAt)}</p>

                {article.body && (
                  <p className="text-gray-700 mb-3">{article.body.substring(0, 150)}...</p>
                )}

                <div className="flex justify-between items-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => window.location.href = `/article/${article.slug}`}
                  >
                    Read More
                  </button>
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete Confirmation Modal */}
              {deleteConfirm === article._id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                    <p className="mb-6">Are you sure you want to delete this article? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(article._id)}
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
      {showEditModal && editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={editingArticle.title}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="body">Body</label>
                  <textarea
                    id="body"
                    name="body"
                    defaultValue={editingArticle.body}
                    className="w-full px-3 py-2 border rounded-md"
                    rows="4"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    defaultValue={editingArticle.author}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="featuredImage">Featured Image (URL)</label>
                  <input
                    type="text"
                    id="featuredImage"
                    name="featuredImage"
                    defaultValue={editingArticle.featuredImage}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="tags">Tags (comma separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    defaultValue={editingArticle.tags ? editingArticle.tags.join(', ') : ''}
                    className="w-full px-3 py-2 border rounded-md"
                  />
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
                    Update Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Articles
