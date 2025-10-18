import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const ImageUploadTest = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { getToken } = useAuth();

    const handleFileUploaded = (file) => {
        console.log('File uploaded successfully:', file);
        setUploadedFiles(prev => [...prev, file]);
        setMessage({ type: 'success', text: `File uploaded: ${file.originalName}` });
    };

    const createTestGallery = async () => {
        if (uploadedFiles.length === 0) {
            setMessage({ type: 'error', text: 'Please upload at least one image first' });
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();

            const galleryData = {
                contentType: 'gallery',
                title: 'Test Gallery from Debug Component',
                description: 'This is a test gallery created from the debug component',
                category: 'test',
                status: 'published',
                galleryItems: uploadedFiles.map(file => file.fileId)
            };

            console.log('Creating gallery with data:', galleryData);

            const response = await axios.post('https://ankurschool-v6d0.onrender.com/api/content', galleryData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Gallery creation response:', response.data);

            if (response.status >= 200 && response.status < 300) {
                setMessage({ type: 'success', text: 'Gallery created successfully!' });
                setUploadedFiles([]);
            } else {
                setMessage({ type: 'error', text: 'Failed to create gallery' });
            }
        } catch (error) {
            console.error('Error creating gallery:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || error.message || 'Failed to create gallery'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Image Upload Debug Test</h1>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Step 1: Upload Images</h2>
                <FileUpload
                    onFileUploaded={handleFileUploaded}
                    multiple={true}
                    accept="image/*"
                    maxFiles={5}
                    category="debug_test"
                    description="Test image upload"
                />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Step 2: Uploaded Files</h2>
                {uploadedFiles.length === 0 ? (
                    <p className="text-gray-500">No files uploaded yet</p>
                ) : (
                    <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-green-800">{file.originalName}</p>
                                        <p className="text-sm text-green-600">File ID: {file.fileId}</p>
                                    </div>
                                    <button
                                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Step 3: Create Gallery</h2>
                <button
                    onClick={createTestGallery}
                    disabled={loading || uploadedFiles.length === 0}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create Test Gallery'}
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
                    message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
                        'bg-blue-50 border border-blue-200 text-blue-800'
                    }`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default ImageUploadTest;
