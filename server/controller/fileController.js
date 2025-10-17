import multer from 'multer';
import { uploadToGridFS, downloadFromGridFS, getFileInfo, deleteFromGridFS, listFiles } from '../config/gridfs.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to allow specific file types
const fileFilter = (req, file, cb) => {
    // Allow images, videos, and PDFs
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/avi',
        'video/mov',
        'video/wmv',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Middleware for single file upload
export const uploadSingle = upload.single('file');

// Middleware for multiple file upload
export const uploadMultiple = upload.array('files', 10); // Max 10 files

// Upload single file
export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const fileData = await uploadToGridFS(req.file, {
            uploadedBy: req.user?.id || 'anonymous',
            category: req.body.category || 'general',
            description: req.body.description || ''
        });

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                fileId: fileData.id,
                filename: fileData.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                metadata: fileData.metadata
            }
        });

    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
};

// Upload multiple files
export const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const fileData = await uploadToGridFS(file, {
                uploadedBy: req.user?.id || 'anonymous',
                category: req.body.category || 'general',
                description: req.body.description || ''
            });

            uploadedFiles.push({
                fileId: fileData.id,
                filename: fileData.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                metadata: fileData.metadata
            });
        }

        console.log('Multiple files uploaded successfully:', uploadedFiles);
        console.log('File IDs:', uploadedFiles.map(f => f.fileId));

        res.status(200).json({
            success: true,
            message: `${uploadedFiles.length} files uploaded successfully`,
            data: uploadedFiles
        });

    } catch (error) {
        console.error('Multiple file upload error:', error);
        res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
};

// Download file
// export const downloadFile = async (req, res) => {
//     try {
//         const { fileId } = req.params;
//         console.log('File download request for:', fileId);

//         if (!fileId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'File ID is required'
//             });
//         }

//         // Get file info
//         const fileInfo = await getFileInfo(fileId);
//         console.log('File info:', fileInfo);

//         if (!fileInfo) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'File not found'
//             });
//         }

//         // Download file buffer
//         const fileBuffer = await downloadFromGridFS(fileId);
//         console.log('File buffer size:', fileBuffer.length);

//         // Set appropriate headers before sending
//         res.set({
//             'Content-Type': fileInfo.metadata?.mimetype || fileInfo.contentType || 'application/octet-stream',
//             'Content-Disposition': `inline; filename="${fileInfo.filename}"`,
//             'Content-Length': fileBuffer.length,
//             'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
//         });

//         // Send the file buffer
//         res.send(fileBuffer);

//     } catch (error) {
//         console.error('File download error:', error);

//         // Check if response has already been sent
//         if (!res.headersSent) {
//             res.status(500).json({
//                 success: false,
//                 message: 'File download failed',
//                 error: error.message
//             });
//         }
//     }
// };


import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";

export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log("File download request for:", fileId);

    if (!fileId) {
      return res.status(400).json({ success: false, message: "File ID is required" });
    }

    // Ensure valid ObjectId
    const objectId = new ObjectId(fileId);

    // Use existing Mongoose connection (from connectDB)
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // Fetch file info
    const filesCollection = db.collection("uploads.files");
    const fileInfo = await filesCollection.findOne({ _id: objectId });

    if (!fileInfo) {
      console.log("File not found in GridFS");
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // Set headers before streaming
    res.set({
      "Content-Type": fileInfo.metadata?.mimetype || fileInfo.contentType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${fileInfo.filename}"`,
      "Cache-Control": "public, max-age=31536000",
    });

    // Stream file directly to response
    const downloadStream = bucket.openDownloadStream(objectId);
    downloadStream.pipe(res);

    downloadStream.on("error", (err) => {
      console.error("GridFS stream error:", err);
      if (!res.headersSent) res.status(500).json({ success: false, message: "Error reading file" });
    });

    downloadStream.on("end", () => {
      console.log("File streamed successfully:", fileId);
    });

  } catch (error) {
    console.error("File download error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "File download failed", error: error.message });
    }
  }
};


// Get file info
export const getFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }

        const fileInfo = await getFileInfo(fileId);

        if (!fileInfo) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                fileId: fileInfo._id,
                filename: fileInfo.filename,
                originalName: fileInfo.metadata?.originalName || fileInfo.filename,
                mimetype: fileInfo.metadata?.mimetype || fileInfo.contentType,
                size: fileInfo.length,
                uploadDate: fileInfo.uploadDate,
                metadata: fileInfo.metadata
            }
        });

    } catch (error) {
        console.error('Get file info error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get file info',
            error: error.message
        });
    }
};

// List all files
export const getAllFiles = async (req, res) => {
    try {
        const { category, uploadedBy } = req.query;

        let filter = {};
        if (category) filter['metadata.category'] = category;
        if (uploadedBy) filter['metadata.uploadedBy'] = uploadedBy;

        const files = await listFiles(filter);

        const fileList = files.map(file => ({
            fileId: file._id,
            filename: file.filename,
            originalName: file.metadata?.originalName || file.filename,
            mimetype: file.metadata?.mimetype || file.contentType,
            size: file.length,
            uploadDate: file.uploadDate,
            metadata: file.metadata
        }));

        res.status(200).json({
            success: true,
            count: fileList.length,
            data: fileList
        });

    } catch (error) {
        console.error('List files error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list files',
            error: error.message
        });
    }
};

// Delete file
export const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }

        // Check if file exists
        const fileInfo = await getFileInfo(fileId);

        if (!fileInfo) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Delete file
        await deleteFromGridFS(fileId);

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });

    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
};

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 50MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 10 files.'
            });
        }
    }

    if (error.message.includes('Invalid file type')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    res.status(500).json({
        success: false,
        message: 'Upload error',
        error: error.message
    });
};
