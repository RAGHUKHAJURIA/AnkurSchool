// // config/cloudinary.js
// import multer from 'multer';
// import cloudinary from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET_KEY
// });

// // Create Cloudinary storage engine for Multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: 'school-content',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp4', 'mov', 'avi'],
//     resource_type: 'auto'
//   }
// });

// export const upload = multer({ storage });

// export default cloudinary;

// config/cloudinary.js
// import multer from 'multer';
// import cloudinary from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET_KEY
// });

// // Create Cloudinary storage engine for Multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: 'school-content',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp4', 'mov', 'avi'],
//     resource_type: 'auto'
//   }
// });

// export const upload = multer({ 
//   storage,
//   limits: {
//     fileSize: 50 * 1024 * 1024, // 50MB limit
//   }
// });

// export default cloudinary;

import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Create separate storage configurations for different file types
const getCloudinaryParams = (req, file) => {
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');

  return {
    folder: 'school-content',
    resource_type: isImage ? 'image' : isVideo ? 'video' : 'raw',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'mp4', 'mov', 'avi'],
  };
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: getCloudinaryParams
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export default cloudinary;