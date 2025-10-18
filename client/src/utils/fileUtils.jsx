// Utility functions for handling file URLs with GridFS

const backendUrl = 'https://ankurschool-v6d0.onrender.com'

/**
 * Generate file URL for serving files from GridFS
 * @param {string} fileId - The GridFS file ID
 * @returns {string} - Complete URL to serve the file
 */
export const getFileUrl = (fileId) => {
    if (!fileId) {
        console.log('getFileUrl: No fileId provided');
        return null;
    }
    const url = `https://ankurschool-v6d0.onrender.com/api/files/${fileId}`;
    console.log('Generated file URL:', url, 'for fileId:', fileId);
    return url;
};

/**
 * Generate download URL for files from GridFS
 * @param {string} fileId - The GridFS file ID
 * @returns {string} - Complete URL to download the file
 */
export const getDownloadUrl = (fileId) => {
    if (!fileId) return null;
    return `https://ankurschool-v6d0.onrender.com/api/files/download/${fileId}`;
};

/**
 * Handle file download with proper error handling
 * @param {string} fileId - The GridFS file ID
 * @param {string} originalName - The original filename for download
 * @param {string} attachmentId - Unique ID for tracking download state
 * @param {function} setDownloading - Function to set downloading state
 */
export const handleFileDownload = async (fileId, originalName, attachmentId, setDownloading) => {
    try {
        setDownloading(attachmentId);

        const downloadUrl = getDownloadUrl(fileId);
        console.log('Attempting to download:', downloadUrl);

        const response = await fetch(downloadUrl, {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Create download link
        const downloadLink = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadLink;
        link.download = originalName || 'download';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        window.URL.revokeObjectURL(downloadLink);

        console.log('Download successful');
        setTimeout(() => setDownloading(null), 1500);

    } catch (error) {
        console.error('Download failed:', error);

        // Fallback: Open in new tab
        const fileUrl = getFileUrl(fileId);
        window.open(fileUrl, '_blank');
        setDownloading(null);

        const errorMsg = 'Download failed. The file has been opened in a new tab instead.';
        console.log(errorMsg);
    }
};

/**
 * Handle file viewing in new tab
 * @param {string} fileId - The GridFS file ID
 */
export const handleFileView = (fileId) => {
    const fileUrl = getFileUrl(fileId);
    window.open(fileUrl, '_blank');
};

/**
 * Get file icon based on file type
 * @param {string} fileType - The file type (image, pdf, file, etc.)
 * @returns {JSX.Element} - File icon component
 */
export const getFileIcon = (fileType) => {
    const iconClass = "w-5 h-5";

    switch (fileType) {
        case 'image':
            return (
                <svg className={`${iconClass} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
        case 'pdf':
            return (
                <svg className={`${iconClass} text-red-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            );
        case 'video':
            return (
                <svg className={`${iconClass} text-purple-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            );
        default:
            return (
                <svg className={`${iconClass} text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
    }
};
