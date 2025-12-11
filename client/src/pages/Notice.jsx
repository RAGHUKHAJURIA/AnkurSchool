import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer'
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
import { getFileUrl, getDownloadUrl, handleFileDownload, handleFileView, getFileIcon } from '../utils/fileUtils.jsx'
import { AppContext } from '../context/AppContext'
import { jsPDF } from 'jspdf';

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
        const response = await axios.get('https://ankurschool-v6d0.onrender.com/api/content/type/notice')

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
      await axios.delete(`https://ankurschool-v6d0.onrender.com/api/content/${id}`)
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
      const response = await axios.put(
        `https://ankurschool-v6d0.onrender.com/api/content/${editingNotice._id}`,
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

  // Updated file handling functions using GridFS
  const handleDownloadPdf = async (fileId, fileName, attachmentId) => {
    await handleFileDownload(fileId, fileName, attachmentId, setDownloading);
  };

  const handleViewFile = (fileId) => {
    handleFileView(fileId);
  };

  const downloadNoticeAsPDF = (notice) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(37, 99, 235); // Blue color
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Ankur School', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL NOTICE', 105, 32, { align: 'center' });

    // Reset text color for content
    doc.setTextColor(0, 0, 0);

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(notice.title, 170);
    doc.text(titleLines, 20, 60);

    let yPos = 60 + (titleLines.length * 10);

    // Meta Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    doc.text(`Date: ${formatDate(notice.createdAt)}`, 20, yPos);
    doc.text(`Priority: ${notice.priority.toUpperCase()}`, 100, yPos);
    doc.text(`Audience: ${notice.audience.toUpperCase()}`, 160, yPos);

    // Line separator
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);

    // Body
    yPos += 15;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    // Split text to fit page width
    const bodyLines = doc.splitTextToSize(notice.body, 170);
    doc.text(bodyLines, 20, yPos);

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated from Ankur School Admin Portal', 105, pageHeight - 10, { align: 'center' });

    // Save
    doc.save(`${notice.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notice.pdf`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white text-sm font-semibold mb-8 shadow-lg">
              <Bell className="w-5 h-5 mr-2" />
              School Notices
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Notices</span> & Announcements
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest announcements, important information, and school updates
            </p>
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
                              // Skip null/undefined attachments
                              if (!attachment) {
                                console.warn(`Attachment at index ${index} is null/undefined`);
                                return null;
                              }

                              const attachmentId = `${notice._id}-${index}`;
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-center">
                                    {getFileIcon(attachment.fileType || 'file')}
                                    <span className="text-sm text-gray-700 ml-2">{attachment.name || 'Unknown file'}</span>
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => attachment.fileId && handleViewFile(attachment.fileId)}
                                      className="p-1 text-blue-600 hover:text-blue-800 rounded"
                                      title="View in new tab"
                                      disabled={!attachment.fileId}
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => attachment.fileId && handleDownloadPdf(attachment.fileId, attachment.name, attachmentId)}
                                      disabled={downloading === attachmentId || !attachment.fileId}
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

                        <button
                          onClick={() => downloadNoticeAsPDF(notice)}
                          className="ml-auto flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                          title="Download Notice as PDF"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Save as PDF</span>
                        </button>
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

      {/* Footer */}
      <Footer />
    </>
  )
}

export default Notice