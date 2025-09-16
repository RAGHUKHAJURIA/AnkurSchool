
import { Content, Article, Notice, Gallery } from '../models/content.js';
import multer from 'multer';
import { upload } from '../config/cloudinary.js';
import mongoose from 'mongoose';


// Multer middleware for handling file uploads
export const uploadContentFiles = upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'attachments', maxCount: 10 },
  { name: 'galleryItems', maxCount: 20 }
]);

// Helper function to handle errors
const handleError = (res, error) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${error.path}: ${error.value}`
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}: ${error.keyValue[field]}`
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// 

// Main content creation function
export const createContent = async (req, res) => {
  try {

    console.log('Request received:', req.body);
    console.log('Files received:', req.files);
    const { contentType, title, body, ...otherData } = req.body;

    // Validate content type
    if (!['article', 'notice', 'gallery'].includes(contentType)) {
      console.error('Validation errors:', validationError.errors);
      return res.status(400).json({
        success: false,
        message: 'Invalid content type. Must be article, notice, or gallery'
      });
    }

    // Generate slug from title with duplicate handling
    let slug;
    if (title && !req.body.slug) {
      let baseSlug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      // Check if slug already exists and append number if needed
      slug = baseSlug;
      let counter = 1;
      let existingDoc = await Content.findOne({ slug });

      while (existingDoc) {
        slug = `${baseSlug}-${counter}`;
        existingDoc = await Content.findOne({ slug });
        counter++;
      }
    } else {
      slug = req.body.slug;
    }

    // Process uploaded files
    const processedData = {
      ...otherData,
      title,
      body,
      slug,
      contentType
    };

    // Handle featured image for articles
    if (req.files?.featuredImage) {
      processedData.featuredImage = req.files.featuredImage[0].path;
    }

    // Handle attachments for notices
    if (req.files?.attachments) {
      processedData.attachments = req.files.attachments.map(file => ({
        name: file.originalname,
        fileUrl: file.path,
        fileType: file.mimetype.startsWith('image/') ? 'image' :
          file.mimetype === 'application/pdf' ? 'pdf' : 'file'
      }));
    }

    // Handle gallery items
    if (req.files?.galleryItems) {
      processedData.items = req.files.galleryItems.map(file => ({
        type: file.mimetype.startsWith('image/') ? 'image' :
          file.mimetype.startsWith('video/') ? 'video' : 'file',
        url: file.path,
        caption: file.originalname,
        thumbnail: file.mimetype.startsWith('image/') ? file.path : null
      }));

      // Set cover image for gallery if not provided
      if (!processedData.coverImage && req.files.galleryItems.length > 0) {
        const firstImage = req.files.galleryItems.find(file =>
          file.mimetype.startsWith('image/')
        );
        if (firstImage) {
          processedData.coverImage = firstImage.path;
        }
      }
    }

    // Create the appropriate content type
    let content;
    switch (contentType) {
      case 'article':
        content = new Article(processedData);
        break;
      case 'notice':
        content = new Notice(processedData);
        break;
      case 'gallery':
        content = new Gallery(processedData);
        break;
    }

    // Validate before save
    const validationError = content.validateSync();
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationError.errors
      });
    }

    await content.save();

    res.status(201).json({
      success: true,
      message: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} created successfully`,
      data: content
    });

  } catch (error) {
    console.error('Create content error:', error);
    handleError(res, error);
  }
};

// Get all content with filtering, sorting, and pagination
export const getAllContent = async (req, res) => {
  try {
    const {
      contentType,
      status,
      category,
      tags,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filter = {};

    if (contentType) filter.contentType = contentType;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(',') };

    // Count total documents matching the filter
    const total = await Content.countDocuments(filter);

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination and sorting
    const content = await Content.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: content.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: content
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get content by type
export const getContentByType = async (req, res) => {
  try {
    const { type } = req.params;

    // Validate content type
    if (!['article', 'notice', 'gallery'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type. Must be article, notice, or gallery'
      });
    }

    // Build filter object
    const filter = { contentType: type, status: 'published' };

    // Get content sorted by creation date (newest first)
    const content = await Content.find(filter).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get content by ID
// export const getContentById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Validate ObjectId
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid content ID format'
//             });
//         }

//         const content = await Content.findById(id);
//         // Author field has been removed from content model, so we don't need to populate it
//         // .populate('author', 'name email');

//         if (!content) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Content not found'
//             });
//         }

//         // Increment view count
//         content.views += 1;
//         await content.save();

//         res.status(200).json({
//             success: true,
//             data: content
//         });
//     } catch (error) {
//         handleError(res, error);
//     }
// };

export const getContentById = async (req, res) => {
  try {
    console.log('getContentById called with params:', req.params);
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id);
      return res.status(400).json({
        success: false,
        message: 'Invalid content ID format'
      });
    }

    console.log('Searching for content with ID:', id);
    const content = await Content.findById(id);

    if (!content) {
      console.log('Content not found for ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    console.log('Content found, incrementing views');
    // Increment view count
    content.views += 1;
    await content.save();

    console.log('Returning content:', content._id);
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error in getContentById:', error);
    handleError(res, error);
  }
};

// // Get content by slug
// export const getContentBySlug = async (req, res) => {
//     try {
//         const { slug } = req.params;

//         const content = await Content.findOne({ slug });
//         // Author field has been removed from content model, so we don't need to populate it
//         // .populate('author', 'name email');

//         if (!content) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Content not found'
//             });
//         }

//         // Increment view count
//         content.views += 1;
//         await content.save();

//         res.status(200).json({
//             success: true,
//             data: content
//         });
//     } catch (error) {
//         handleError(res, error);
//     }
// };

// Update content
export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content ID format'
      });
    }

    // Generate slug from title if title is being updated
    if (req.body.title && !req.body.slug) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }

    const content = await Content.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content
    });
  } catch (error) {
    handleError(res, error);
  }
};

// // Delete content
export const deleteContent = async (req, res) => {
  try {
    // Check if user has permission to delete content
    // if (!req.user || !req.user.canCreateContent()) {
    //     return res.status(403).json({
    //         success: false,
    //         message: 'Permission denied. Only admin users can delete content'
    //     });
    // }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content ID format'
      });
    }

    const content = await Content.findByIdAndDelete(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    handleError(res, error);
  }
};

// // Get content by type (articles, notices, or galleries)
// export const getContentByType = async (req, res) => {
//     try {
//         const { type } = req.params;
//         const {
//             status,
//             category,
//             page = 1,
//             limit = 10,
//             sort = '-createdAt'
//         } = req.query;

//         // Validate content type
//         if (!['article', 'notice', 'gallery'].includes(type)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid content type. Must be article, notice, or gallery'
//             });
//         }

//         // Build filter object
//         const filter = { contentType: type };

//         if (status) filter.status = status;
//         if (category) filter.category = category;

//         // Count total documents matching the filter
//         const total = await Content.countDocuments(filter);

//         // Calculate pagination
//         const skip = (parseInt(page) - 1) * parseInt(limit);

//         // Execute query with pagination and sorting
//         const content = await Content.find(filter)
//             .sort(sort)
//             .skip(skip)
//             .limit(parseInt(limit))
//             .populate('author', 'name email');

//         res.status(200).json({
//             success: true,
//             count: content.length,
//             total,
//             totalPages: Math.ceil(total / parseInt(limit)),
//             currentPage: parseInt(page),
//             data: content
//         });
//     } catch (error) {
//         handleError(res, error);
//     }
// };