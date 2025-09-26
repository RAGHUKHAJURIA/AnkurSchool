import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, File, Image, Video, FileText } from 'lucide-react';
import axios from 'axios';

const FileUpload = ({
    onFileUploaded,
    multiple = false,
    accept = "image/*,video/*,.pdf,.doc,.docx",
    maxFiles = 10,
    category = "general",
    description = ""
}) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const getFileIcon = (mimetype) => {
        if (mimetype.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
        if (mimetype.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
        if (mimetype === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
        return <File className="w-5 h-5 text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFiles = (selectedFiles) => {
        const fileArray = Array.from(selectedFiles);

        // Validate file count
        if (files.length + fileArray.length > maxFiles) {
            alert(`Maximum ${maxFiles} files allowed`);
            return;
        }

        // Validate file types and sizes
        const validFiles = fileArray.filter(file => {
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                alert(`File ${file.name} is too large. Maximum size is 50MB.`);
                return false;
            }
            return true;
        });

        setFiles(prev => [...prev, ...validFiles]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (files.length === 0) {
            alert('Please select files to upload');
            return;
        }

        console.log('Starting file upload...', files.length, 'files');
        setUploading(true);
        const uploadedFiles = [];

        try {
            if (multiple) {
                // Upload multiple files
                const formData = new FormData();
                files.forEach(file => {
                    formData.append('files', file);
                });
                formData.append('category', category);
                formData.append('description', description);

                console.log('Uploading multiple files to:', `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/files/upload-multiple`);
                console.log('FormData contents:', Array.from(formData.entries()));

                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/files/upload-multiple`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                console.log('Upload response:', response.data);
                uploadedFiles.push(...response.data.data);
            } else {
                // Upload single file
                for (const file of files) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('category', category);
                    formData.append('description', description);

                    const response = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/files/upload`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );

                    uploadedFiles.push(response.data.data);
                }
            }

            // Call the callback with uploaded file data
            if (onFileUploaded) {
                const callbackData = multiple ? uploadedFiles : uploadedFiles[0];
                console.log('Calling onFileUploaded with:', callbackData);
                console.log('Multiple mode:', multiple);
                console.log('Uploaded files count:', uploadedFiles.length);
                onFileUploaded(callbackData);
            } else {
                console.warn('onFileUploaded callback not provided');
            }

            // Clear files after successful upload
            setFiles([]);
            alert('Files uploaded successfully!');

        } catch (error) {
            console.error('Upload error:', error);
            console.error('Error response:', error.response?.data);
            alert('Upload failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                        <p className="text-sm text-gray-600">
                            {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500">
                            Images, videos, PDFs up to 50MB each
                        </p>
                    </div>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {getFileIcon(file.type)}
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {files.length > 0 && (
                <div className="mt-4">
                    <button
                        onClick={uploadFiles}
                        disabled={uploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                <span>Upload {files.length} file{files.length > 1 ? 's' : ''}</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
