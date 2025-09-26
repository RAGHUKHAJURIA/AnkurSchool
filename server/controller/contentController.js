
import { Content, Article, Notice, Gallery } from '../models/content.js';
import multer from 'multer';
import { uploadToGridFS, downloadFromGridFS, getFileInfo, deleteFromGridFS } from '../config/gridfs.js';
import mongoose from 'mongoose';
import axios from 'axios'


// Multer configuration for content files
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

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

    console.log('=== CREATE CONTENT REQUEST ===');
    console.log('Content type:', req.body.contentType);
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Gallery items:', req.body.galleryItems);
    console.log('Gallery items type:', typeof req.body.galleryItems);
    console.log('Gallery items is array:', Array.isArray(req.body.galleryItems));
    console.log('Attachments:', req.body.attachments);
    console.log('Featured image:', req.body.featuredImage);
    console.log('================================');

    const { contentType, title, body, ...otherData } = req.body;

    // Validate content type
    if (!['article', 'notice', 'gallery'].includes(contentType)) {
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

    // Handle featured image for articles (GridFS file ID)
    if (req.body.featuredImage) {
      try {
        const fileInfo = await getFileInfo(req.body.featuredImage);
        if (fileInfo) {
          processedData.featuredImage = req.body.featuredImage;
        } else {
          console.error(`Featured image file not found: ${req.body.featuredImage}`);
        }
      } catch (error) {
        console.error(`Error getting featured image info:`, error);
      }
    }

    // Handle attachments for notices (GridFS file IDs)
    if (req.body.attachments) {
      const attachmentIds = Array.isArray(req.body.attachments) ? req.body.attachments : [req.body.attachments];

      // Filter out null/undefined file IDs
      const validFileIds = attachmentIds.filter(fileId => fileId && fileId !== 'null' && fileId !== 'undefined');
      console.log('Valid attachment IDs:', validFileIds);

      if (validFileIds.length === 0) {
        console.log('No valid attachment IDs found, skipping attachments processing');
        processedData.attachments = [];
      } else {
        const attachments = [];
        for (const fileId of validFileIds) {
          try {
            const fileInfo = await getFileInfo(fileId);
            if (fileInfo) {
              attachments.push({
                fileId: fileId,
                name: fileInfo.metadata?.originalName || fileInfo.filename,
                fileType: fileInfo.metadata?.mimetype || fileInfo.contentType || 'application/pdf'
              });
            }
          } catch (error) {
            console.error(`Error getting file info for ${fileId}:`, error);
          }
        }
        processedData.attachments = attachments;
      }
    }

    // Handle gallery items (GridFS file IDs)
    console.log('Checking for gallery items...');
    console.log('req.body.galleryItems exists:', !!req.body.galleryItems);
    console.log('req.body.galleryItems value:', req.body.galleryItems);

    if (req.body.galleryItems) {
      console.log('Processing gallery items:', req.body.galleryItems);
      const galleryItemIds = Array.isArray(req.body.galleryItems) ? req.body.galleryItems : [req.body.galleryItems];

      // Filter out null/undefined file IDs
      const validFileIds = galleryItemIds.filter(fileId => fileId && fileId !== 'null' && fileId !== 'undefined');
      console.log('Valid gallery item IDs:', validFileIds);

      if (validFileIds.length === 0) {
        console.log('No valid file IDs found, skipping gallery items processing');
        processedData.items = [];
      } else {
        const items = [];
        for (const fileId of validFileIds) {
          try {
            console.log(`Getting file info for: ${fileId}`);
            const fileInfo = await getFileInfo(fileId);
            console.log('File info:', fileInfo);
            if (fileInfo) {
              const fileType = fileInfo.metadata?.mimetype || fileInfo.contentType || 'image/jpeg';
              const item = {
                type: fileType.startsWith('image/') ? 'image' :
                  fileType.startsWith('video/') ? 'video' : 'file',
                fileId: fileId,
                caption: fileInfo.metadata?.originalName || fileInfo.filename,
                thumbnail: fileType.startsWith('image/') ? fileId : null
              };
              console.log('Created gallery item:', item);
              items.push(item);
            } else {
              console.log(`No file info found for fileId: ${fileId}`);
            }
          } catch (error) {
            console.error(`Error getting file info for ${fileId}:`, error);
          }
        }
        console.log('Final gallery items:', items);
        processedData.items = items;
      }

      // Set cover image for gallery if not provided
      if (!processedData.coverImage && processedData.items && processedData.items.length > 0) {
        const firstImage = processedData.items.find(item => item.type === 'image');
        if (firstImage) {
          processedData.coverImage = firstImage.fileId;
          console.log('Set cover image to first image:', firstImage.fileId);
        } else {
          processedData.coverImage = processedData.items[0].fileId; // Use first file as cover
          console.log('Set cover image to first file:', processedData.items[0].fileId);
        }
      } else {
        console.log('Cover image not set - items length:', processedData.items?.length || 0, 'existing coverImage:', processedData.coverImage);
      }
    } else {
      console.log('No galleryItems found in request body');
      console.log('Available keys in req.body:', Object.keys(req.body));
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

    console.log('Content saved successfully:', {
      id: content._id,
      contentType: content.contentType,
      title: content.title,
      coverImage: content.coverImage,
      items: content.items,
      itemsLength: content.items?.length || 0
    });

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

    console.log(`Found ${content.length} ${type} items`);
    if (content.length > 0) {
      console.log('First item:', {
        id: content[0]._id,
        title: content[0].title,
        contentType: content[0].contentType,
        coverImage: content[0].coverImage,
        items: content[0].items,
        itemsLength: content[0].items?.length || 0
      });
    }

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

// Serve file from GridFS
export const serveFile = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const fileStream = await getFileStream(filename);

    // Set appropriate headers
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    });

    // Get file info for content type
    try {
      const fileInfo = await getFileInfo(filename);
      res.set({
        'Content-Type': fileInfo.metadata?.contentType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${fileInfo.metadata?.originalName || filename}"`
      });
    } catch (error) {
      console.warn('Could not get file info:', error.message);
    }

    fileStream.pipe(res);
  } catch (error) {
    console.error('Serve file error:', error);
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
};

// Download file from GridFS
export const downloadFile = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const fileStream = await getFileStream(filename);

    // Get file info for download headers
    const fileInfo = await getFileInfo(filename);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileInfo.metadata?.originalName || filename}"`
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
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