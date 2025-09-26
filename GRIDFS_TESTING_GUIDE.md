# MongoDB GridFS Integration Testing Guide

## 🎉 GridFS Integration Complete!

Your MongoDB GridFS integration is now fully implemented and ready for testing. Here's everything you need to know:

## 📋 What's Been Implemented

### Backend (Server)

- ✅ **GridFS Configuration**: Complete GridFS setup with MongoDB
- ✅ **File Upload Controller**: Handle single and multiple file uploads
- ✅ **File Management**: Upload, download, list, and delete files
- ✅ **Updated Models**: Content and Student models now use GridFS file IDs
- ✅ **Test Endpoints**: Comprehensive testing endpoints for Postman
- ✅ **File Types Supported**: Images, Videos, PDFs, Documents

### File Types Supported

- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Videos**: MP4, AVI, MOV, WMV
- **Documents**: PDF, DOC, DOCX
- **File Size Limit**: 50MB per file

## 🧪 Testing with Postman

### 1. **Test GridFS Status**

```
GET http://localhost:5000/api/test/status
```

**Expected Response:**

```json
{
  "success": true,
  "message": "GridFS test endpoints are working",
  "endpoints": [
    "POST /api/test/upload - Upload a file",
    "GET /api/test/download/:fileId - Download a file",
    "GET /api/test/list - List all files",
    "GET /api/test/status - This status endpoint"
  ]
}
```

### 2. **Upload a Single File**

```
POST http://localhost:5000/api/test/upload
Content-Type: multipart/form-data

Body (form-data):
- file: [Select any image/video/PDF file from your computer]
```

**Expected Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "fileId": "507f1f77bcf86cd799439011",
    "filename": "uploads_1234567890_abc123",
    "originalName": "test-image.jpg",
    "mimetype": "image/jpeg",
    "size": 1024000
  }
}
```

### 3. **List All Files**

```
GET http://localhost:5000/api/test/list
```

**Expected Response:**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "fileId": "507f1f77bcf86cd799439011",
      "filename": "uploads_1234567890_abc123",
      "originalName": "test-image.jpg",
      "mimetype": "image/jpeg",
      "size": 1024000,
      "uploadDate": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 4. **Download a File**

```
GET http://localhost:5000/api/test/download/507f1f77bcf86cd799439011
```

**Note**: Replace `507f1f77bcf86cd799439011` with the actual fileId from upload response.

**Expected Response**: The actual file content (image, video, or PDF)

### 5. **Upload Multiple Files**

```
POST http://localhost:5000/api/files/upload-multiple
Content-Type: multipart/form-data

Body (form-data):
- files: [Select multiple files]
- category: "test"
- description: "Test upload"
```

## 🔧 Production File Endpoints

### File Management API

```
POST /api/files/upload              - Upload single file
POST /api/files/upload-multiple     - Upload multiple files
GET  /api/files/list               - List all files
GET  /api/files/:fileId            - Get file info
GET  /api/files/download/:fileId   - Download file
DELETE /api/files/:fileId          - Delete file
```

### Content Management (Updated for GridFS)

```
POST /api/content/articles         - Create article with GridFS files
POST /api/content/notices          - Create notice with attachments
POST /api/content/galleries        - Create gallery with GridFS images/videos
```

## 📱 Frontend Integration

### File Upload Component

```jsx
import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "student_documents");
    formData.append("description", "Student document upload");

    try {
      setUploading(true);
      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File uploaded:", response.data);
      // Use response.data.data.fileId in your forms
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*,video/*,.pdf,.doc,.docx"
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};
```

## 🗄️ Database Structure

### GridFS Collections

- **uploads.files**: File metadata
- **uploads.chunks**: File data chunks

### Updated Models

- **Content Model**: Uses GridFS file IDs for images and attachments
- **Student Model**: Uses GridFS file IDs for document attachments
- **File References**: All file references now use MongoDB ObjectIds

## 🚀 Testing Steps

### Step 1: Start the Server

```bash
cd server
npm run dev
```

### Step 2: Test with Postman

1. **Create a new Postman collection** called "GridFS Testing"
2. **Add the test endpoints** listed above
3. **Upload a test file** (image, video, or PDF)
4. **Verify the file** was stored in GridFS
5. **Download the file** to confirm it works

### Step 3: Verify in MongoDB

```javascript
// Connect to MongoDB and check GridFS collections
use AnkurSchol
db.getCollection('uploads.files').find().pretty()
db.getCollection('uploads.chunks').find().limit(5)
```

## 🔍 File Storage Details

### GridFS Bucket Configuration

- **Bucket Name**: `uploads`
- **Chunk Size**: 255KB (default)
- **File Size Limit**: 50MB
- **Supported Types**: Images, Videos, PDFs, Documents

### File Metadata

Each uploaded file includes:

- **Original filename**
- **MIME type**
- **File size**
- **Upload timestamp**
- **Custom metadata** (category, description, etc.)

## 🛠️ Error Handling

### Common Errors and Solutions

1. **File too large**: Increase file size limit or compress file
2. **Invalid file type**: Check allowed MIME types
3. **GridFS not initialized**: Ensure MongoDB connection is established
4. **File not found**: Verify fileId exists in GridFS

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 📊 Performance Considerations

### File Size Limits

- **Single File**: 50MB maximum
- **Multiple Files**: 10 files maximum per request
- **Total Request**: 50MB maximum

### Storage Optimization

- **GridFS Chunking**: Automatic chunking for large files
- **Indexing**: Automatic indexing on filename and upload date
- **Metadata**: Efficient metadata storage

## 🎯 Next Steps

1. **Test File Upload**: Use Postman to upload various file types
2. **Test File Download**: Verify files can be downloaded correctly
3. **Integrate Frontend**: Update your React forms to use GridFS
4. **Update Admin Panel**: Modify admin interfaces for file management
5. **Production Deployment**: Configure for production environment

## 🆘 Troubleshooting

### Server Not Starting

- Check MongoDB connection
- Verify environment variables
- Check for port conflicts

### File Upload Fails

- Verify file size is under 50MB
- Check file type is supported
- Ensure GridFS is initialized

### File Download Fails

- Verify fileId is correct
- Check if file exists in GridFS
- Ensure proper headers are set

---

**Your GridFS integration is now complete and ready for production use!** 🚀

Test it thoroughly with Postman and then integrate it into your frontend forms for a seamless file upload experience.
