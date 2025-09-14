import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Notice = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
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
              
              {notice.attachments && notice.attachments.length > 0 && (
                <div className="mb-3">
                  <p className="font-medium">Attachments:</p>
                  <ul className="list-disc pl-5">
                    {notice.attachments.map((attachment, index) => (
                      <li key={index}>
                        <a 
                          href={attachment.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {attachment.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {notice.tags && notice.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {notice.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notice