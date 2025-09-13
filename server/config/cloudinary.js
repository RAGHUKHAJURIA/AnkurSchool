// config/cloudinary.js
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Create Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'school-content',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp4', 'mov', 'avi'],
    resource_type: 'auto'
  }
});

export const upload = multer({ storage });

export default cloudinary;