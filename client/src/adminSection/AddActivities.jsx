import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Bell, Image, Plus, X, Calendar, Tag, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import FileUpload from '../components/FileUpload';

const AddActivities = () => {
    const [activeTab, setActiveTab] = useState('article');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { getToken } = useContext(AppContext);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';



    // Form states
    const [articleForm, setArticleForm] = useState({
        title: '',
        body: '',
        excerpt: '',
        category: 'news',
        tags: [],
        status: 'published',
        publishedAt: ''
    });

    const [noticeForm, setNoticeForm] = useState({
        title: '',
        body: '',
        priority: 'medium',
        audience: 'all',
        status: 'published',
        expiresAt: '',
        publishedAt: ''
    });

    const [galleryForm, setGalleryForm] = useState({
        title: '',
        description: '',
        category: 'event',
        status: 'published',
        eventDate: '',
        publishedAt: ''
    });

    const [files, setFiles] = useState({
        featuredImage: null,
        attachments: [],
        galleryItems: []
    });

    // GridFS uploaded files state
    const [uploadedFiles, setUploadedFiles] = useState({
        featuredImage: null,
        attachments: [],
        galleryItems: []
    });

    const [tagInput, setTagInput] = useState('');

    // Handle form submissions
    const handleSubmit = async (contentType) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Validate form data based on content type
        let formState;
        switch (contentType) {
            case 'article':
                formState = articleForm;
                if (!formState.title || !formState.body) {
                    setMessage({ type: 'error', text: 'Please fill in title and body for the article.' });
                    setLoading(false);
                    return;
                }
                break;
            case 'notice':
                formState = noticeForm;
                if (!formState.title || !formState.body) {
                    setMessage({ type: 'error', text: 'Please fill in title and body for the notice.' });
                    setLoading(false);
                    return;
                }
                // Validate that body is not just whitespace
                if (formState.body.trim().length < 10) {
                    setMessage({ type: 'error', text: 'Notice body must be at least 10 characters long.' });
                    setLoading(false);
                    return;
                }
                break;
            case 'gallery':
                formState = galleryForm;
                if (!formState.title || !formState.description) {
                    setMessage({ type: 'error', text: 'Please fill in title and description for the gallery.' });
                    setLoading(false);
                    return;
                }
                // Allow empty galleries - files can be added later
                break;
        }

        // Prepare JSON data instead of FormData
        const requestData = {
            contentType: contentType
        };

        // Add form data based on content type
        switch (contentType) {
            case 'article':
                formState = articleForm;
                // Add GridFS file ID for featured image
                if (uploadedFiles.featuredImage) {
                    requestData.featuredImage = uploadedFiles.featuredImage.fileId;
                }
                break;
            case 'notice':
                formState = noticeForm;
                // Add GridFS file IDs for attachments
                if (uploadedFiles.attachments && uploadedFiles.attachments.length > 0) {
                    const validFileIds = uploadedFiles.attachments
                        .filter(file => file && file.fileId) // Filter out null/undefined files
                        .map(file => file.fileId);

                    if (validFileIds.length > 0) {
                        requestData.attachments = validFileIds;
                    } else {
                        console.warn('No valid file IDs found in attachments');
                    }
                } else {
                    console.warn('No attachments uploaded');
                }
                break;
            case 'gallery':
                formState = galleryForm;
                // Add GridFS file IDs for gallery items
                console.log('Processing gallery items:', uploadedFiles.galleryItems);
                console.log('Gallery items length:', uploadedFiles.galleryItems?.length);

                if (uploadedFiles.galleryItems && uploadedFiles.galleryItems.length > 0) {
                    console.log('Gallery items found, processing...');
                    const validFileIds = uploadedFiles.galleryItems
                        .filter(file => file && file.fileId) // Filter out null/undefined files
                        .map(file => file.fileId);

                    console.log('Valid file IDs:', validFileIds);
                    if (validFileIds.length > 0) {
                        requestData.galleryItems = validFileIds;
                        console.log('Set requestData.galleryItems:', requestData.galleryItems);
                    } else {
                        console.warn('No valid file IDs found in gallery items');
                    }
                } else {
                    console.warn('No gallery items uploaded or array is empty');
                    console.log('uploadedFiles.galleryItems:', uploadedFiles.galleryItems);
                }
                break;
        }

        // Add all form fields
        console.log('Adding form fields to requestData...');
        console.log('Form state:', formState);
        Object.keys(formState).forEach(key => {
            if (formState[key]) {
                console.log(`Adding ${key}:`, formState[key]);
                requestData[key] = formState[key];
            }
        });

        // Re-add gallery items after form fields to ensure they're not overridden
        if (contentType === 'gallery' && uploadedFiles.galleryItems && uploadedFiles.galleryItems.length > 0) {
            const validFileIds = uploadedFiles.galleryItems
                .filter(file => file && file.fileId)
                .map(file => file.fileId);
            if (validFileIds.length > 0) {
                requestData.galleryItems = validFileIds;
                console.log('Re-added galleryItems after form processing:', requestData.galleryItems);
            }
        }

        try {
            const token = await getToken();

            console.log('=== FINAL REQUEST DATA ===');
            console.log('Sending data to server:', requestData);
            console.log('Uploaded files:', uploadedFiles);
            console.log('Gallery items being sent:', requestData.galleryItems);
            console.log('Attachments being sent:', requestData.attachments);
            console.log('Featured image being sent:', requestData.featuredImage);
            console.log('========================');

            const response = await axios.post(backendUrl + '/api/content', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
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
            console.error('Full error object:', error);
            console.error('Error response:', error.response);
            console.error('Error response data:', error.response?.data);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Network error. Please try again.';
            setMessage({ type: 'error', text: errorMessage });
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
        setUploadedFiles({ featuredImage: null, attachments: [], galleryItems: [] });
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
            setUploadedFiles(prev => ({ ...prev, [type]: null }));
        } else {
            setFiles(prev => ({
                ...prev,
                [type]: prev[type].filter((_, i) => i !== index)
            }));
            setUploadedFiles(prev => ({
                ...prev,
                [type]: prev[type].filter((_, i) => i !== index)
            }));
        }
    };

    // Handle GridFS file uploads
    const handleGridFSFileUpload = (type, uploadedFile) => {
        console.log('File uploaded:', type, uploadedFile);
        console.log('Current uploadedFiles state:', uploadedFiles);

        if (type === 'featuredImage') {
            setUploadedFiles(prev => {
                const newState = { ...prev, [type]: uploadedFile };
                console.log('Updated uploadedFiles (featuredImage):', newState);
                return newState;
            });
        } else {
            setUploadedFiles(prev => {
                // Handle both single files and arrays of files
                const filesToAdd = Array.isArray(uploadedFile) ? uploadedFile : [uploadedFile];
                const newState = {
                    ...prev,
                    [type]: [...(prev[type] || []), ...filesToAdd]
                };
                console.log('Updated uploadedFiles (array type):', newState);
                console.log('New array for', type, ':', newState[type]);
                return newState;
            });
        }
    };

    // Remove GridFS uploaded file
    const removeGridFSFile = (type, index = null) => {
        if (type === 'featuredImage') {
            setUploadedFiles(prev => ({ ...prev, [type]: null }));
        } else {
            setUploadedFiles(prev => ({
                ...prev,
                [type]: prev[type].filter((_, i) => i !== index)
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Hero Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8 sm:py-10">
                        <div className="text-center">
                            <div className="inline-flex items-center px-6 py-3 bg-white/20 rounded-full text-white text-sm font-semibold mb-6">
                                <Plus className="w-5 h-5 mr-2" />
                                Content Management
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                Create <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Content</span>
                            </h1>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-6">
                                Create articles, notices, and galleries with MongoDB GridFS file storage
                            </p>
                            <div className="flex items-center justify-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-300" />
                                <span className="text-sm text-green-200 font-medium">GridFS Integration Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Message Display */}
                    {message.text && (
                        <div className={`mx-6 mt-6 p-4 rounded-xl border-2 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                            <div className="flex items-center">
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
                                )}
                                <span className="font-medium">{message.text}</span>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="border-b border-slate-200">
                        <nav className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-8 px-4 sm:px-6">
                            {[
                                { id: 'article', label: 'Article', icon: FileText },
                                { id: 'notice', label: 'Notice', icon: Bell },
                                { id: 'gallery', label: 'Gallery', icon: Image }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center py-3 px-4 sm:px-6 border-b-2 font-semibold text-sm rounded-t-xl transition-all duration-200 ${activeTab === id
                                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">{label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Article Form */}
                        {activeTab === 'article' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-2">Title <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={articleForm.title}
                                            onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                            placeholder="Enter article title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-2">Category</label>
                                        <select
                                            value={articleForm.category}
                                            onChange={(e) => setArticleForm(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm appearance-none"
                                        >
                                            <option value="news">News</option>
                                            <option value="event">Event</option>
                                            <option value="blog">Blog</option>
                                            <option value="academic">Academic</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">Body <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={articleForm.body}
                                        onChange={(e) => setArticleForm(prev => ({ ...prev, body: e.target.value }))}
                                        rows={6}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm resize-none"
                                        placeholder="Enter article content"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">Excerpt</label>
                                    <textarea
                                        value={articleForm.excerpt}
                                        onChange={(e) => setArticleForm(prev => ({ ...prev, excerpt: e.target.value }))}
                                        rows={3}
                                        maxLength={250}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm resize-none"
                                        placeholder="Brief summary (max 250 characters)"
                                    />
                                    <div className="text-sm text-slate-500 mt-1">{articleForm.excerpt.length}/250 characters</div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">Tags</label>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                            placeholder="Add a tag and press Enter"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
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

                                {/* Featured Image - GridFS Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>

                                    {/* GridFS File Upload Component */}
                                    <div className="mb-4">
                                        <FileUpload
                                            onFileUploaded={(file) => handleGridFSFileUpload('featuredImage', file)}
                                            multiple={false}
                                            accept="image/*"
                                            maxFiles={1}
                                            category="content_images"
                                            description="Featured image for article"
                                        />
                                    </div>

                                    {/* Display uploaded file */}
                                    {uploadedFiles.featuredImage && (
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-green-800">
                                                            {uploadedFiles.featuredImage.originalName}
                                                        </p>
                                                        <p className="text-xs text-green-600">
                                                            Uploaded to GridFS - ID: {uploadedFiles.featuredImage.fileId}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeGridFSFile('featuredImage')}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
                                    className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

                                {/* Attachments - GridFS Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>

                                    {/* GridFS File Upload Component */}
                                    <div className="mb-4">
                                        <FileUpload
                                            onFileUploaded={(file) => handleGridFSFileUpload('attachments', file)}
                                            multiple={true}
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                                            maxFiles={10}
                                            category="notice_attachments"
                                            description="Attachments for notice"
                                        />
                                    </div>

                                    {/* Display uploaded files */}
                                    {uploadedFiles.attachments.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-gray-700">Uploaded Attachments:</h4>
                                            {uploadedFiles.attachments.map((file, index) => (
                                                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                            <div>
                                                                <p className="text-sm font-medium text-green-800">
                                                                    {file.originalName}
                                                                </p>
                                                                <p className="text-xs text-green-600">
                                                                    ID: {file.fileId}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeGridFSFile('attachments', index)}
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                    className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

                                {/* Gallery Items - GridFS Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Items *</label>

                                    {/* GridFS File Upload Component */}
                                    <div className="mb-4">
                                        <FileUpload
                                            onFileUploaded={(file) => handleGridFSFileUpload('galleryItems', file)}
                                            multiple={true}
                                            accept="image/*,video/*"
                                            maxFiles={20}
                                            category="gallery_photos"
                                            description="Gallery images and videos"
                                        />
                                    </div>

                                    {/* Display uploaded files */}
                                    {uploadedFiles.galleryItems.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-gray-700">Uploaded Gallery Items:</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {uploadedFiles.galleryItems.map((file, index) => (
                                                    <div key={index} className="relative bg-green-50 border border-green-200 p-3 rounded-lg">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-medium text-green-800 truncate">
                                                                    {file.originalName}
                                                                </p>
                                                                <p className="text-xs text-green-600">
                                                                    ID: {file.fileId}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeGridFSFile('galleryItems', index)}
                                                            className="absolute top-1 right-1 text-red-600 hover:text-red-800 bg-white rounded-full p-1"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleSubmit('gallery')}
                                        disabled={loading}
                                        className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {loading ? 'Creating Gallery...' : 'Create Gallery'}
                                    </button>

                                    <button
                                        onClick={async () => {
                                            console.log('=== TEST GALLERY DATA ===');
                                            console.log('Gallery form:', galleryForm);
                                            console.log('Uploaded files:', uploadedFiles);
                                            console.log('Gallery items:', uploadedFiles.galleryItems);

                                            const testData = {
                                                contentType: 'gallery',
                                                ...galleryForm,
                                                galleryItems: uploadedFiles.galleryItems?.map(f => f.fileId) || []
                                            };

                                            console.log('Test data to send:', testData);

                                            try {
                                                const response = await axios.post(
                                                    `${backendUrl}/api/test/test-gallery`,
                                                    testData,
                                                    {
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        }
                                                    }
                                                );
                                                console.log('Test response:', response.data);
                                            } catch (error) {
                                                console.error('Test error:', error);
                                            }
                                        }}
                                        type="button"
                                        className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        Test
                                    </button>
                                </div>
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

export default AddActivities;