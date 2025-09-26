import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';

let gfs;
let gridFSBucket;

// Initialize GridFS
export const initGridFS = () => {
    const conn = mongoose.connection;

    // Create GridFS bucket
    gridFSBucket = new GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });

    // Create GridFS collection
    gfs = conn.db.collection('uploads.files');

    console.log('GridFS initialized successfully');
};

// Get GridFS bucket
export const getGridFSBucket = () => {
    if (!gridFSBucket) {
        initGridFS();
    }
    return gridFSBucket;
};

// Get GridFS collection
export const getGridFSCollection = () => {
    if (!gfs) {
        initGridFS();
    }
    return gfs;
};

// Upload file to GridFS
export const uploadToGridFS = (file, metadata = {}) => {
    return new Promise((resolve, reject) => {
        const bucket = getGridFSBucket();
        const uploadStream = bucket.openUploadStream(file.originalname, {
            metadata: {
                ...metadata,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                uploadedAt: new Date()
            }
        });

        uploadStream.on('error', (error) => {
            console.error('GridFS upload error:', error);
            reject(error);
        });

        uploadStream.on('finish', () => {
            resolve({
                id: uploadStream.id,
                filename: uploadStream.filename,
                metadata: uploadStream.options.metadata
            });
        });

        // Write file buffer to GridFS
        uploadStream.end(file.buffer);
    });
};

// Download file from GridFS
export const downloadFromGridFS = (fileId) => {
    return new Promise((resolve, reject) => {
        try {
            const bucket = getGridFSBucket();

            // Convert string ID to ObjectId
            const objectId = new ObjectId(fileId);
            const downloadStream = bucket.openDownloadStream(objectId);

            let chunks = [];

            downloadStream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            downloadStream.on('error', (error) => {
                console.error('GridFS download error:', error);
                reject(error);
            });

            downloadStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                resolve(buffer);
            });
        } catch (error) {
            console.error('Error in downloadFromGridFS:', error);
            reject(error);
        }
    });
};

// Get file info from GridFS
export const getFileInfo = async (fileId) => {
    try {
        const gfs = getGridFSCollection();

        // Convert string ID to ObjectId
        const objectId = new ObjectId(fileId);
        const file = await gfs.findOne({ _id: objectId });
        return file;
    } catch (error) {
        console.error('Error getting file info:', error);
        throw error;
    }
};

// Delete file from GridFS
export const deleteFromGridFS = (fileId) => {
    return new Promise((resolve, reject) => {
        try {
            const bucket = getGridFSBucket();

            // Convert string ID to ObjectId
            const objectId = new ObjectId(fileId);
            bucket.delete(objectId, (error) => {
                if (error) {
                    console.error('GridFS delete error:', error);
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        } catch (error) {
            console.error('Error in deleteFromGridFS:', error);
            reject(error);
        }
    });
};

// List all files in GridFS
export const listFiles = async (filter = {}) => {
    try {
        const gfs = getGridFSCollection();
        const files = await gfs.find(filter).toArray();
        return files;
    } catch (error) {
        console.error('Error listing files:', error);
        throw error;
    }
};

export default {
    initGridFS,
    getGridFSBucket,
    getGridFSCollection,
    uploadToGridFS,
    downloadFromGridFS,
    getFileInfo,
    deleteFromGridFS,
    listFiles
};