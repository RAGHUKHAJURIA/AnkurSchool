import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Edit3,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  X,
  Save,
  Search,
  Filter,
  Bell,
  Eye,
  User,
  ChevronDown,
  Download,
  FileText,
  ExternalLink
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { AppContext } from '../context/AppContext'

const Notice = () => {
  const [notices, setNotices] = useState([])
  const [filteredNotices, setFilteredNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingNotice, setEditingNotice] = useState(null)
  const [formData, setFormData] = useState({ title: '', body: '' })
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [expandedNotice, setExpandedNotice] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [downloading, setDownloading] = useState(null)
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        const response = await axios.get(backendUrl + '/api/content/type/notice')

        if (response.status === 200) {
          setNotices(response.data.data)
          setFilteredNotices(response.data.data)
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

  // Filter notices based on search and priority
  useEffect(() => {
    let result = notices

    if (searchTerm) {
      result = result.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.body.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (priorityFilter !== 'all') {
      result = result.filter(notice => notice.priority === priorityFilter)
    }

    setFilteredNotices(result)
  }, [notices, searchTerm, priorityFilter])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return "Just now"

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return formatDate(dateString)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4" />
      case 'high': return <Bell className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getFileIcon = (fileType) => {
    if (fileType === 'pdf') return <FileText className="w-4 h-4 text-red-600" />
    if (fileType.includes('image')) return <Eye className="w-4 h-4 text-blue-600" />
    return <FileText className="w-4 h-4 text-gray-600" />
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(backendUrl + `/api/content/${id}`)
      setNotices(notices.filter((notice) => notice._id !== id))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting notice:', error)
      alert(error.response?.data?.message || 'Failed to delete notice')
    }
  }

  const handleEdit = (notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      body: notice.body || '',
      priority: notice.priority || 'medium'
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(backendUrl +
        `/api/content/${editingNotice._id}`,
        formData
      )

      if (response.status === 200) {
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

  const toggleExpandNotice = (id) => {
    setExpandedNotice(expandedNotice === id ? null : id)
  }

  // Function to handle PDF download through server endpoint
  // const handleDownloadPdf = async (fileUrl, fileName, attachmentId) => {
  //   try {
  //     setDownloading(attachmentId);

  //     // Use the server endpoint to handle the download
  //     const downloadUrl = `http://localhost:5000/api/content/downolad?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName || 'document.pdf')}`;

  //     // Create a temporary anchor element for download
  //     const link = document.createElement('a');
  //     link.href = downloadUrl;
  //     link.download = fileName || 'document.pdf';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     // Reset downloading state after a short delay
  //     setTimeout(() => setDownloading(null), 2000);

  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //     alert('Failed to download the file. You can try opening it in a new tab instead.');
  //     setDownloading(null);

  //     // Fallback: Open in new tab
  //     window.open(fileUrl, '_blank');
  //   }
  // }

  // In your frontend handleDownloadPdf function
  // Fixed Frontend Function
  const handleDownloadPdf = async (fileUrl, fileName, attachmentId) => {
    try {
      setDownloading(attachmentId);

      // Method 1: Direct download using fetch and blob
      try {
        console.log('Attempting to download:', fileUrl);

        const response = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf,*/*'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Create download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName || 'document.pdf';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        window.URL.revokeObjectURL(downloadUrl);

        console.log('Download successful');

      } catch (fetchError) {
        console.log('Fetch method failed, trying alternative:', fetchError.message);

        // Method 2: Simple link download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || 'document.pdf';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTimeout(() => setDownloading(null), 1500);

    } catch (error) {
      console.error('Download failed completely:', error);

      // Final fallback - open in new tab
      window.open(fileUrl, '_blank');
      setDownloading(null);

      // Show user-friendly message instead of alert
      const errorMsg = 'Download failed. The file has been opened in a new tab instead.';
      // Replace alert with your preferred notification method
      console.log(errorMsg);
    }
  };
  // Function to view file in new tab (alternative to download)
  const handleViewFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              School Notices
            </h1>
            <p className="text-gray-600">Stay updated with the latest announcements and important information</p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center"
            >
              <AlertCircle className="w-6 h-6 mx-auto mb-2" />
              <p>{error}</p>
            </motion.div>
          ) : filteredNotices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-8 rounded-xl text-center"
            >
              <Bell className="w-8 h-8 mx-auto mb-2" />
              <p className="text-lg font-medium">
                {searchTerm || priorityFilter !== 'all'
                  ? "No notices match your search criteria"
                  : "No notices available at this time"
                }
              </p>
              {(searchTerm || priorityFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setPriorityFilter("all")
                  }}
                  className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="space-y-4"
            >
              <AnimatePresence>
                {filteredNotices.map((notice) => (
                  <motion.div
                    key={notice._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                            {getPriorityIcon(notice.priority)}
                            {notice.priority || 'medium'}
                          </span>
                          {notice.audience && notice.audience !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200">
                              <User className="w-3 h-3" />
                              {notice.audience}
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimeAgo(notice.createdAt)}
                        </div>
                      </div>

                      <h2
                        className="text-xl font-semibold mb-2 cursor-pointer hover:text-blue-600 transition"
                        onClick={() => toggleExpandNotice(notice._id)}
                      >
                        {notice.title}
                      </h2>

                      {notice.body && (
                        <div className="mb-4">
                          <p className={`text-gray-700 ${expandedNotice === notice._id ? '' : 'line-clamp-3'}`}>
                            {notice.body}
                          </p>
                          {notice.body.length > 150 && (
                            <button
                              onClick={() => toggleExpandNotice(notice._id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 flex items-center"
                            >
                              {expandedNotice === notice._id ? 'Show less' : 'Read more'}
                              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${expandedNotice === notice._id ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                      )}

                      {/* PDF Attachments Section */}
                      {notice.attachments && notice.attachments.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h3>
                          <div className="space-y-2">
                            {notice.attachments.map((attachment, index) => {
                              const attachmentId = `${notice._id}-${index}`;
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-center">
                                    {getFileIcon(attachment.fileType)}
                                    <span className="text-sm text-gray-700 ml-2">{attachment.name}</span>
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleViewFile(attachment.fileUrl)}
                                      className="p-1 text-blue-600 hover:text-blue-800 rounded"
                                      title="View in new tab"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDownloadPdf(attachment.fileUrl, attachment.name, attachmentId)}
                                      disabled={downloading === attachmentId}
                                      className="p-1 text-green-600 hover:text-green-800 rounded disabled:opacity-50"
                                      title="Download file"
                                    >
                                      {downloading === attachmentId ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
                                      ) : (
                                        <Download className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Posted on {formatDate(notice.createdAt)}
                        </div>

                        {isAdmin && (
                          <div className="flex gap-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              onClick={() => handleEdit(notice)}
                              title="Edit Notice"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              onClick={() => setShowDeleteConfirm(notice._id)}
                              title="Delete Notice"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingNotice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setEditingNotice(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Edit Notice</h2>
                  <button
                    onClick={() => setEditingNotice(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdate}>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Priority</label>
                    <select
                      value={formData.priority || 'medium'}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value='urgent'>Urgent</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">Content</label>
                    <textarea
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="5"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingNotice(null)}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      <Save className="w-4 h-4" />
                      Update
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-4">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Delete Notice</h3>
                  <p className="text-gray-600">Are you sure you want to delete this notice? This action cannot be undone.</p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Notice