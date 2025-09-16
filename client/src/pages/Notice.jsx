import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Notice = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingNotice, setEditingNotice] = useState(null)
  const [formData, setFormData] = useState({ title: '', body: '' })
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:5000/api/content/type/notice')
        
        if (response.status === 200) {
          setNotices(response.data.data)
          setError(null)
        }
      } catch (error) {
        console.error('Error fetching notices:', error)
        setError(error.response?.data?.message || error.message || 'Failed to fetch notices')
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
    setIsAdmin(true) // TODO: Replace with real auth check
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return

    try {
      await axios.delete(`http://localhost:5000/api/content/${id}`)
      setNotices(notices.filter((notice) => notice._id !== id))
    } catch (error) {
      console.error('Error deleting notice:', error)
      alert(error.response?.data?.message || 'Failed to delete notice')
    }
  }

  const handleEdit = (notice) => {
    setEditingNotice(notice)
    setFormData({ title: notice.title, body: notice.body || '' })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(
        `http://localhost:5000/api/content/${editingNotice._id}`,
        formData
      )

      if (response.status === 200) {
        // Update state locally without refetch
        setNotices(
          notices.map((n) =>
            n._id === editingNotice._id ? { ...n, ...formData } : n
          )
        )
        setEditingNotice(null)
        setFormData({ title: '', body: '' })
      }
    } catch (error) {
      console.error('Error updating notice:', error)
      alert(error.response?.data?.message || 'Failed to update notice')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">School Notices</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No notices available at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{notice.title}</h2>
              <p className="text-gray-600 mb-2">Posted on: {formatDate(notice.createdAt)}</p>
              
              {notice.body && (
                <div className="mb-3">
                  <p className="text-gray-700">{notice.body.substring(0, 150)}...</p>
                </div>
              )}

              {isAdmin && (
                <div className="flex gap-2 mt-4">
                  <button 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => handleEdit(notice)}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => handleDelete(notice._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Notice</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Body</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="4"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingNotice(null)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notice
