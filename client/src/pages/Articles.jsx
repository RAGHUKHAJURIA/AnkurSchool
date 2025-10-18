import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Edit, Trash2, Tag, Eye, Clock, User, Search, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleModal from "../components/ArticleModal";
import { AppContext } from "../context/AppContext";
import { getFileUrl } from "../utils/fileUtils.jsx";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();


  // Check if user is admin
  useEffect(() => {
    if (userLoaded && user) {
      const userRole = user.publicMetadata?.role;
      setIsAdmin(userRole === "admin");
    }
  }, [user, userLoaded]);

  // Fetch articles
  useEffect(() => {
    fetchArticles();
  }, []);

  // Extract categories from articles
  useEffect(() => {
    if (articles.length > 0) {
      const uniqueCategories = [...new Set(articles.map(article => article.category))];
      setCategories(uniqueCategories);
    }
  }, [articles]);

  // Filter articles based on search and category
  useEffect(() => {
    let result = articles;

    if (searchTerm) {
      result = result.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.tags && article.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(result);
  }, [articles, searchTerm, selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/api/content/type/article'
      );
      if (response.status === 200) {
        setArticles(response.data.data);
        setFilteredArticles(response.data.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch articles"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return formatDate(dateString);
  };

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      await axios.delete(`http://localhost:5000/api/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(articles.filter(article => article._id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting article:", error);
      setError("Failed to delete article");
    }
  };

  const openArticleModal = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const closeArticleModal = () => {
    setShowArticleModal(false);
    setSelectedArticle(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white text-sm font-semibold mb-8 shadow-lg">
              <Tag className="w-5 h-5 mr-2" />
              School Articles
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Articles</span> & News
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest news, events, and announcements from our school community
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between p-4 bg-white rounded-xl shadow-sm"
          >
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center max-w-2xl mx-auto">
              <p>{error}</p>
              <button
                onClick={fetchArticles}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-8 rounded-xl text-center max-w-2xl mx-auto">
              <p className="text-lg font-medium mb-2">
                {searchTerm || selectedCategory !== "all"
                  ? "No articles match your search criteria"
                  : "No articles available at this time"
                }
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      {article.featuredImage ? (
                        <img
                          src={getFileUrl(article.featuredImage)}
                          alt={article.title}
                          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                          <div className="text-gray-400 text-lg">No image</div>
                        </div>
                      )}

                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-medium shadow-sm">
                          {article.category || "General"}
                        </span>
                      </div>

                      {/* Admin actions */}
                      {isAdmin && (
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <button
                            className="bg-white text-blue-500 p-2 rounded-full shadow-md hover:bg-blue-50 transition"
                            title="Edit Article"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(article._id)}
                            className="bg-white text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition"
                            title="Delete Article"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h2 className="text-xl font-semibold mb-2 line-clamp-2 leading-tight text-gray-900 hover:text-blue-600 transition">
                        {article.title}
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {article.excerpt || article.body?.substring(0, 120) || "No content available"}
                        {(!article.excerpt && article.body?.length > 120) && "..."}
                      </p>

                      {/* Tags */}
                      {article.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{article.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatTimeAgo(article.createdAt)}
                        </div>

                        <button
                          onClick={() => openArticleModal(article)}
                          className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                        >
                          Read <Eye className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-2">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this article? This action cannot be undone.</p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Article Modal */}
        <ArticleModal
          article={selectedArticle}
          isOpen={showArticleModal}
          onClose={closeArticleModal}
        />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Articles;