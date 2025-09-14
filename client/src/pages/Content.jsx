import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Bell, Image, Plus, X, Calendar, Tag, Users, AlertCircle } from 'lucide-react';

const Content = () => {
    const [activeTab, setActiveTab] = useState('article');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form states
    const [articleForm, setArticleForm] = useState({
        title: '',
        body: '',
        excerpt: '',
        category: 'news',
        tags: [],
        status: 'draft',
        publishedAt: ''
    });

    const [noticeForm, setNoticeForm] = useState({
        title: '',
        body: '',
        priority: 'medium',
        audience: 'all',
        status: 'draft',
        expiresAt: '',
        publishedAt: ''
    });

    const [galleryForm, setGalleryForm] = useState({
        title: '',
        description: '',
        category: 'event',
        status: 'draft',
        eventDate: '',
        publishedAt: ''
    });

    const [files, setFiles] = useState({
        featuredImage: null,
        attachments: [],
        galleryItems: []
    });

    const [tagInput, setTagInput] = useState('');

    // Handle form submissions
    const handleSubmit = async (contentType) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();

        // Add content type
        formData.append('contentType', contentType);

        // Add form data based on content type
        let formState;
        switch (contentType) {
            case 'article':
                formState = articleForm;
                if (files.featuredImage) {
                    formData.append('featuredImage', files.featuredImage);
                }
                break;
            case 'notice':
                formState = noticeForm;
                files.attachments.forEach((file) => {
                    formData.append('attachments', file);
                });
                break;
            case 'gallery':
                formState = galleryForm;
                files.galleryItems.forEach((file) => {
                    formData.append('galleryItems', file);
                });
                break;
        }

        // Add all form fields
        Object.keys(formState).forEach(key => {
            if (key === 'tags' && Array.isArray(formState[key])) {
                formState[key].forEach(tag => formData.append('tags[]', tag));
            } else if (formState[key]) {
                formData.append(key, formState[key]);
            }
        });

        try {
            // Replace with your actual API endpoint
            //  

            const response = await axios.post('https://ankur-school-red.vercel.app/api/content', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Axios returns the response data directly in response.data
            const result = response.data;

            // Axios responses have status codes but not an 'ok' property
            if (response.status >= 200 && response.status < 300) {
                setMessage({ type: 'success', text: result.message || `${contentType} created successfully!` });
                resetForm(contentType);
            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to create content' });
            }
        } catch (error) {
            // Provide more specific error messages from the server if available
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Network error. Please try again.';
            setMessage({ type: 'error', text: errorMessage });
            console.error('Submit error:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = (contentType) => {
        switch (contentType) {
            case 'article':
                setArticleForm({
                    title: '',
                    body: '',
                    excerpt: '',
                    category: 'news',
                    tags: [],
                    status: 'draft',
                    publishedAt: ''
                });
                break;
            case 'notice':
                setNoticeForm({
                    title: '',
                    body: '',
                    priority: 'medium',
                    audience: 'all',
                    status: 'draft',
                    expiresAt: '',
                    publishedAt: ''
                });
                break;
            case 'gallery':
                setGalleryForm({
                    title: '',
                    description: '',
                    category: 'event',
                    status: 'draft',
                    eventDate: '',
                    publishedAt: ''
                });
                break;
        }
        setFiles({ featuredImage: null, attachments: [], galleryItems: [] });
        setTagInput('');
    };

    // Handle file uploads
    const handleFileChange = (type, fileList) => {
        if (type === 'featuredImage') {
            setFiles(prev => ({ ...prev, [type]: fileList[0] || null }));
        } else {
            setFiles(prev => ({ ...prev, [type]: Array.from(fileList) }));
        }
    };

    // Handle tag management
    const addTag = () => {
        if (tagInput.trim() && !articleForm.tags.includes(tagInput.trim())) {
            setArticleForm(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setArticleForm(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Remove file
    const removeFile = (type, index = null) => {
        if (type === 'featuredImage') {
            setFiles(prev => ({ ...prev, [type]: null }));
        } else {
            setFiles(prev => ({
                ...prev,
                [type]: prev[type].filter((_, i) => i !== index)
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Content Management System</h1>
                        <p className="text-blue-100 mt-1">Test your API routes by creating content</p>
                    </div>

                    {/* Message Display */}
                    {message.text && (
                        <div className={`px-6 py-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {message.text}
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="border-b">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'article', label: 'Article', icon: FileText },
                                { id: 'notice', label: 'Notice', icon: Bell },
                                { id: 'gallery', label: 'Gallery', icon: Image }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">
                        {/* Article Form */}
                        {activeTab === 'article' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                        <input
                                            type="text"
                                            value={articleForm.title}
                                            onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter article title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            value={articleForm.category}
                                            onChange={(e) => setArticleForm(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="news">News</option>
                                            <option value="event">Event</option>
                                            <option value="blog">Blog</option>
                                            <option value="academic">Academic</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Body *</label>
                                    <textarea
                                        value={articleForm.body}
                                        onChange={(e) => setArticleForm(prev => ({ ...prev, body: e.target.value }))}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter article content"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                                    <textarea
                                        value={articleForm.excerpt}
                                        onChange={(e) => setArticleForm(prev => ({ ...prev, excerpt: e.target.value }))}
                                        rows={3}
                                        maxLength={250}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Brief summary (max 250 characters)"
                                    />
                                    <div className="text-sm text-gray-500 mt-1">{articleForm.excerpt.length}/250 characters</div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add a tag and press Enter"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {articleForm.tags.map((tag, index) => (
                                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                                <Tag className="w-3 h-3 mr-1" />
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Featured Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {files.featuredImage ? (
                                                <div className="relative">
                                                    <p className="text-sm text-gray-900">{files.featuredImage.name}</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile('featuredImage')}
                                                        className="mt-2 text-red-600 hover:text-red-800"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500">
                                                            <span>Upload a file</span>
                                                            <input
                                                                type="file"
                                                                className="sr-only"
                                                                accept="image/*"
                                                                onChange={(e) => handleFileChange('featuredImage', e.target.files)}
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status and Publish Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={articleForm.status}
                                            onChange={(e) => setArticleForm(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                                        <input
                                            type="datetime-local"
                                            value={articleForm.publishedAt}
                                            onChange={(e) => setArticleForm(prev => ({ ...prev, publishedAt: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSubmit('article')}
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Article...' : 'Create Article'}
                                </button>
                            </div>
                        )}

                        {/* Notice Form */}
                        {activeTab === 'notice' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                        <input
                                            type="text"
                                            value={noticeForm.title}
                                            onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter notice title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                        <select
                                            value={noticeForm.priority}
                                            onChange={(e) => setNoticeForm(prev => ({ ...prev, priority: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Body *</label>
                                    <textarea
                                        value={noticeForm.body}
                                        onChange={(e) => setNoticeForm(prev => ({ ...prev, body: e.target.value }))}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter notice content"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                                        <select
                                            value={noticeForm.audience}
                                            onChange={(e) => setNoticeForm(prev => ({ ...prev, audience: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">All</option>
                                            <option value="students">Students</option>
                                            <option value="parents">Parents</option>
                                            <option value="staff">Staff</option>
                                            <option value="faculty">Faculty</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Expires At</label>
                                        <input
                                            type="datetime-local"
                                            value={noticeForm.expiresAt}
                                            onChange={(e) => setNoticeForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Attachments */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center w-full">
                                            {files.attachments.length > 0 ? (
                                                <div className="space-y-2">
                                                    {files.attachments.map((file, index) => (
                                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                            <span className="text-sm text-gray-900">{file.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile('attachments', index)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <label className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 p-2 border border-blue-300">
                                                        <span>Add more files</span>
                                                        <input
                                                            type="file"
                                                            className="sr-only"
                                                            multiple
                                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                                                            onChange={(e) => handleFileChange('attachments', e.target.files)}
                                                        />
                                                    </label>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500">
                                                            <span>Upload files</span>
                                                            <input
                                                                type="file"
                                                                className="sr-only"
                                                                multiple
                                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                                                                onChange={(e) => handleFileChange('attachments', e.target.files)}
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PDF, DOC, Images up to 10MB each</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={noticeForm.status}
                                            onChange={(e) => setNoticeForm(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                                        <input
                                            type="datetime-local"
                                            value={noticeForm.publishedAt}
                                            onChange={(e) => setNoticeForm(prev => ({ ...prev, publishedAt: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSubmit('notice')}
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Notice...' : 'Create Notice'}
                                </button>
                            </div>
                        )}

                        {/* Gallery Form */}
                        {activeTab === 'gallery' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                        <input
                                            type="text"
                                            value={galleryForm.title}
                                            onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter gallery title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            value={galleryForm.category}
                                            onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="event">Event</option>
                                            <option value="campus">Campus</option>
                                            <option value="classroom">Classroom</option>
                                            <option value="sports">Sports</option>
                                            <option value="cultural">Cultural</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                    <textarea
                                        value={galleryForm.description}
                                        onChange={(e) => setGalleryForm(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter gallery description"
                                    />
                                </div>

                                {/* Gallery Items */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Items *</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center w-full">
                                            {files.galleryItems.length > 0 ? (
                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {files.galleryItems.map((file, index) => (
                                                            <div key={index} className="relative bg-gray-50 p-2 rounded">
                                                                <div className="text-xs text-gray-900 truncate">{file.name}</div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFile('galleryItems', index)}
                                                                    className="absolute top-1 right-1 text-red-600 hover:text-red-800 bg-white rounded-full p-1"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <label className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 p-2 border border-blue-300">
                                                        <span>Add more items</span>
                                                        <input
                                                            type="file"
                                                            className="sr-only"
                                                            multiple
                                                            accept="image/*,video/*"
                                                            onChange={(e) => handleFileChange('galleryItems', e.target.files)}
                                                        />
                                                    </label>
                                                </div>
                                            ) : (
                                                <>
                                                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500">
                                                            <span>Upload images/videos</span>
                                                            <input
                                                                type="file"
                                                                className="sr-only"
                                                                multiple
                                                                accept="image/*,video/*"
                                                                onChange={(e) => handleFileChange('galleryItems', e.target.files)}
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">Images and videos up to 10MB each</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                                        <input
                                            type="date"
                                            value={galleryForm.eventDate}
                                            onChange={(e) => setGalleryForm(prev => ({ ...prev, eventDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={galleryForm.status}
                                            onChange={(e) => setGalleryForm(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                                    <input
                                        type="datetime-local"
                                        value={galleryForm.publishedAt}
                                        onChange={(e) => setGalleryForm(prev => ({ ...prev, publishedAt: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    onClick={() => handleSubmit('gallery')}
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Gallery...' : 'Create Gallery'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* API Testing Information */}
                    <div className="bg-gray-50 px-6 py-4 border-t">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">API Testing Guide</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Endpoint:</strong> Make sure your API endpoint is set up at <code className="bg-gray-200 px-1 rounded">/api/content</code></p>
                            <p><strong>Method:</strong> POST with multipart/form-data</p>
                            <p><strong>Required Fields:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Article: title, body</li>
                                <li>Notice: title, body</li>
                                <li>Gallery: title, description, galleryItems (files)</li>
                            </ul>
                            <p><strong>File Uploads:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>featuredImage: Single image file for articles</li>
                                <li>attachments: Multiple files for notices</li>
                                <li>galleryItems: Multiple image/video files for galleries</li>
                            </ul>
                            <div className="mt-3 p-3 bg-blue-50 rounded-md">
                                <p className="text-blue-800 font-medium">💡 Testing Tips:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1 text-blue-700">
                                    <li>Check browser developer tools Network tab for request details</li>
                                    <li>Verify that your server is running and accessible</li>
                                    <li>Make sure Cloudinary credentials are properly configured</li>
                                    <li>Test with small files first to avoid timeout issues</li>
                                    <li>Check server logs for detailed error messages</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success/Error Display Cards */}
                {message.text && (
                    <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-3">
                            {message.type === 'success' ? '✅ Success Response' : '❌ Error Response'}
                        </h3>
                        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                            <pre className="text-sm whitespace-pre-wrap">{message.text}</pre>
                        </div>
                    </div>
                )}

                {/* Quick Test Data */}
                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">🚀 Quick Test Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-md">
                            <h4 className="font-medium text-gray-800 mb-2">Sample Article</h4>
                            <button
                                onClick={() => {
                                    setActiveTab('article');
                                    setArticleForm({
                                        title: "School Annual Day Celebration 2024",
                                        body: "We are excited to announce our annual day celebration scheduled for next month. This year's theme is 'Unity in Diversity' and will feature performances from all grade levels. Students, parents, and faculty are invited to participate in this grand celebration of our school's achievements and cultural diversity.",
                                        excerpt: "Join us for our annual day celebration featuring performances and cultural diversity.",
                                        category: 'event',
                                        tags: ['event', 'celebration', 'annual-day', 'cultural'],
                                        status: 'draft',
                                        publishedAt: ''
                                    });
                                }}
                                className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
                            >
                                Load Sample
                            </button>
                        </div>

                        <div className="p-4 border rounded-md">
                            <h4 className="font-medium text-gray-800 mb-2">Sample Notice</h4>
                            <button
                                onClick={() => {
                                    setActiveTab('notice');
                                    setNoticeForm({
                                        title: "Important: Parent-Teacher Meeting",
                                        body: "Dear Parents, we would like to inform you about the upcoming parent-teacher meeting scheduled for the first week of next month. This is an important opportunity to discuss your child's academic progress and development. Please mark your calendars and confirm your attendance.",
                                        priority: 'high',
                                        audience: 'parents',
                                        status: 'draft',
                                        expiresAt: '',
                                        publishedAt: ''
                                    });
                                }}
                                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
                            >
                                Load Sample
                            </button>
                        </div>

                        <div className="p-4 border rounded-md">
                            <h4 className="font-medium text-gray-800 mb-2">Sample Gallery</h4>
                            <button
                                onClick={() => {
                                    setActiveTab('gallery');
                                    setGalleryForm({
                                        title: "Sports Day 2024 Highlights",
                                        description: "Exciting moments captured from our annual sports day event. Students showcased their athletic talents and team spirit in various competitions including track and field events, team sports, and fun activities.",
                                        category: 'sports',
                                        status: 'draft',
                                        eventDate: new Date().toISOString().split('T')[0],
                                        publishedAt: ''
                                    });
                                }}
                                className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200"
                            >
                                Load Sample
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;