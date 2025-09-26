import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Share2, Eye, Calendar, Tag } from 'lucide-react';
import { getFileUrl } from '../utils/fileUtils.jsx';

const GalleryModal = ({ gallery, isOpen, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (isOpen && gallery) {
            setCurrentImageIndex(0);
            setIsLoading(true);
            setImageError(false);
        }
    }, [isOpen, gallery]);

    if (!isOpen || !gallery) return null;

    const images = gallery.items || [];
    const currentImage = images[currentImageIndex];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsLoading(true);
        setImageError(false);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsLoading(true);
        setImageError(false);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setImageError(true);
    };

    const downloadImage = () => {
        if (currentImage?.fileId) {
            const link = document.createElement('a');
            link.href = getFileUrl(currentImage.fileId);
            link.download = currentImage.filename || `gallery-image-${currentImageIndex + 1}`;
            link.click();
        }
    };

    const shareGallery = () => {
        if (navigator.share) {
            navigator.share({
                title: gallery.title,
                text: gallery.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Gallery link copied to clipboard!');
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold text-gray-900">{gallery.title}</h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                            {gallery.category || 'Gallery'}
                        </span>
                        <span className="text-sm text-gray-500">
                            {currentImageIndex + 1} of {images.length} images
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={shareGallery}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                            title="Share Gallery"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={downloadImage}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                            title="Download Image"
                        >
                            <Download className="w-5 h-5" />
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
                    {/* Main Image Area */}
                    <div className="relative bg-gray-50 p-6">
                        <div className="flex items-center justify-center relative min-h-[400px]">
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                                </div>
                            )}

                            {currentImage && !imageError ? (
                                <img
                                    src={getFileUrl(currentImage.fileId)}
                                    alt={currentImage.filename || `Gallery image ${currentImageIndex + 1}`}
                                    className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="text-gray-500 text-center">
                                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">Image not available</p>
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 shadow-lg transition-all"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 shadow-lg transition-all"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Gallery Info */}
                    <div className="p-6">
                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(gallery.createdAt)}
                            </div>
                            <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {gallery.views || 0} views
                            </div>
                            <div className="flex items-center">
                                <Tag className="w-4 h-4 mr-1" />
                                {images.length} images
                            </div>
                        </div>

                        {/* Description */}
                        {gallery.description && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{gallery.description}</p>
                            </div>
                        )}

                        {/* Thumbnail Grid */}
                        {images.length > 1 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Images ({images.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setCurrentImageIndex(index);
                                                setIsLoading(true);
                                                setImageError(false);
                                            }}
                                            className={`relative rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${index === currentImageIndex
                                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={getFileUrl(image.fileId)}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-24 object-cover"
                                            />
                                            {index === currentImageIndex && (
                                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <Eye className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
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

export default GalleryModal;