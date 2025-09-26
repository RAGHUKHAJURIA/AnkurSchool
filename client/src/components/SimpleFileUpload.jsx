import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import FileUpload from './FileUpload';

const SimpleFileUpload = ({ onFileUploaded, title = "Upload File" }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

    const handleFileUploaded = (file) => {
        setUploadedFile(file);
        setUploadStatus('success');

        // Call the parent callback if provided
        if (onFileUploaded) {
            onFileUploaded(file);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

            <FileUpload
                onFileUploaded={handleFileUploaded}
                multiple={false}
                accept="image/*,video/*,.pdf,.doc,.docx"
                maxFiles={1}
                category="simple_upload"
                description="Simple file upload"
            />

            {uploadedFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                            <p className="text-sm font-medium text-green-800">
                                File uploaded successfully!
                            </p>
                            <p className="text-xs text-green-600">
                                {uploadedFile.originalName} ({uploadedFile.size} bytes)
                            </p>
                            <p className="text-xs text-green-600">
                                File ID: {uploadedFile.fileId}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleFileUpload;
