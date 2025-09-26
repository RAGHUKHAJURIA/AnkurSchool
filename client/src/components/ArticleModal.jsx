import React, { useState } from 'react';
import { X, Share2, Bookmark, Calendar, User, Tag, Clock, Eye } from 'lucide-react';
import { getFileUrl } from '../utils/fileUtils.jsx';

const ArticleModal = ({ article, isOpen, onClose }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);

    if (!isOpen || !article) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatReadingTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    };

    const shareArticle = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.excerpt || article.body?.substring(0, 120),
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Article link copied to clipboard!');
        }
    };

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                            {article.category || 'General'}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatReadingTime(article.body || '')}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleBookmark}
                            className={`p-2 rounded-full transition-colors ${isBookmarked
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-gray-400 hover:bg-gray-100'
                                }`}
                            title="Bookmark Article"
                        >
                            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={shareArticle}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                            title="Share Article"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Featured Image */}
                    {article.featuredImage && (
                        <div className="w-full h-64 md:h-80 overflow-hidden">
                            <img
                                src={getFileUrl(article.featuredImage)}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="p-6 md:p-8">
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {article.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(article.createdAt)}
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {article.author || 'School Admin'}
                            </div>
                            <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {article.views || 0} views
                            </div>
                        </div>

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {article.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Excerpt */}
                        {article.excerpt && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                                <p className="text-gray-700 italic text-lg leading-relaxed">
                                    {article.excerpt}
                                </p>
                            </div>
                        )}

                        {/* Article Body */}
                        <div className="prose prose-lg max-w-none">
                            <div
                                className="text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: article.body?.replace(/\n/g, '<br>') || 'No content available.'
                                }}
                            />
                        </div>

                        {/* Additional Images */}
                        {article.images && article.images.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4 text-gray-900">Related Images</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {article.images.map((image, index) => (
                                        <div key={index} className="rounded-lg overflow-hidden shadow-md">
                                            <img
                                                src={getFileUrl(image.fileId)}
                                                alt={`Article image ${index + 1}`}
                                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleModal;
