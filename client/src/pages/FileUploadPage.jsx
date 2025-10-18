import React, { useState } from 'react';
import { Upload, FileText, Image, Video, Download, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import axios from 'axios';

const FileUploadPage = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('general');

    const handleFileUploaded = (uploadedFile) => {
        if (Array.isArray(uploadedFile)) {
            setUploadedFiles(prev => [...prev, ...uploadedFile]);
        } else {
            setUploadedFiles(prev => [...prev, uploadedFile]);
        }
    };

    const downloadFile = async (fileId, filename) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/files/download/${fileId}`,
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file');
        }
    };

    const deleteFile = async (fileId) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                await axios.delete(`http://localhost:5000/api/files/${fileId}`);
                setUploadedFiles(prev => prev.filter(file => file.fileId !== fileId));
                alert('File deleted successfully');
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete file');
            }
        }
    };

    const getFileIcon = (mimetype) => {
        if (mimetype.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
        if (mimetype.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
        if (mimetype === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
        return <FileText className="w-5 h-5 text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            {/* Header Section */}
            <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm font-medium mb-6">
                        📁 File Upload Center
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Upload <span className="text-blue-400">Files</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Upload images, videos, PDFs, and documents directly to MongoDB GridFS
                    </p>
                </div>
            </div>

            {/* File Upload Section */}
            <div className="px-4 sm:px-6 lg:px-8 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Upload Files</h2>
                            <p className="text-gray-300">Select files from your computer to upload to the database</p>
                        </div>

                        {/* Category Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                File Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="general" className="text-gray-700">General</option>
                                <option value="student_documents" className="text-gray-700">Student Documents</option>
                                <option value="content_images" className="text-gray-700">Content Images</option>
                                <option value="gallery_photos" className="text-gray-700">Gallery Photos</option>
                                <option value="notices_attachments" className="text-gray-700">Notice Attachments</option>
                                <option value="test" className="text-gray-700">Test Files</option>
                            </select>
                        </div>

                        {/* File Upload Component */}
                        <FileUpload
                            onFileUploaded={handleFileUploaded}
                            multiple={true}
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            maxFiles={10}
                            category={selectedCategory}
                            description={`Files uploaded via file upload page - ${selectedCategory}`}
                        />
                    </div>
                </div>
            </div>

            {/* Uploaded Files Section */}
            {uploadedFiles.length > 0 && (
                <div className="px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Uploaded Files</h2>
                                <p className="text-gray-300">Manage your uploaded files</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                {getFileIcon(file.mimetype)}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {file.originalName}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-xs text-gray-400">
                                                <p>Type: {file.mimetype}</p>
                                                <p>ID: {file.fileId}</p>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => downloadFile(file.fileId, file.originalName)}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    <span>Download</span>
                                                </button>
                                                <button
                                                    onClick={() => deleteFile(file.fileId)}
                                                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors flex items-center justify-center"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions Section */}
            <div className="px-4 sm:px-6 lg:px-8 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6">How to Use</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Supported File Types</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <Image className="w-4 h-4 text-blue-400" />
                                        Images: JPEG, PNG, GIF, WebP
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-purple-400" />
                                        Videos: MP4, AVI, MOV, WMV
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-red-400" />
                                        Documents: PDF, DOC, DOCX
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">File Limits</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li>• Maximum file size: 50MB</li>
                                    <li>• Maximum files per upload: 10</li>
                                    <li>• Drag & drop supported</li>
                                    <li>• Files stored in MongoDB GridFS</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUploadPage;
