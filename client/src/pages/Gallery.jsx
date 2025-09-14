import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Gallery = () => {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:5000/api/content/type/gallery')
        
        if (response.status === 200) {
          setGalleries(response.data.data)
          setError(null)
        }
      } catch (error) {
        console.error('Error fetching galleries:', error)
        setError(error.response?.data?.message || error.message || 'Failed to fetch galleries')
      } finally {
        setLoading(false)
      }
    }

    fetchGalleries()
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
            <div key={gallery._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                
                {gallery.body && (
                  <p className="text-gray-700 mb-3">{gallery.body.substring(0, 100)}...</p>
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
                
                {gallery.tags && gallery.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {gallery.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Gallery