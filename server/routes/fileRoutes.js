import express from 'express';
import {
    uploadSingle,
    uploadMultiple,
    uploadFile,
    uploadMultipleFiles,
    downloadFile,
    getFile,
    getAllFiles,
    deleteFile,
    handleUploadError
} from '../controller/fileController.js';

const fileRouter = express.Router();

// File upload routes
fileRouter.post('/upload', uploadSingle, uploadFile, handleUploadError);
fileRouter.post('/upload-multiple', uploadMultiple, uploadMultipleFiles, handleUploadError);

// File management routes
fileRouter.get('/list', getAllFiles);
fileRouter.get('/:fileId', getFile);
fileRouter.get('/download/:fileId', downloadFile);
fileRouter.delete('/:fileId', deleteFile);

export default fileRouter;
