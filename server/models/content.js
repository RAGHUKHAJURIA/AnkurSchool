import mongoose from 'mongoose';

// Base content schema with common fields for all content types
const contentSchema = new mongoose.Schema(
  {
    // Title of the content
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150
    },

    // Slug (for SEO-friendly URLs, e.g., "/articles/parent-teacher-meeting")
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // Content type discriminator
    contentType: {
      type: String,
      enum: ['article', 'notice', 'gallery'],
      required: true
    },

    // Status (draft vs published)
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },

    // For scheduling posts (optional)
    publishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
    discriminatorKey: 'contentType' // This allows for different content type schemas
  }
);

// Create the base Content model
const Content = mongoose.model('Content', contentSchema);

// Article schema (for blog posts, news articles, etc.)
const articleSchema = new mongoose.Schema({
  // Main content (HTML/Markdown if using rich-text editor)
  body: {
    type: String,
    required: true
  },

  // Short summary/intro (for previews or card views)
  excerpt: {
    type: String,
    maxlength: 250
  },

  // Category of the article
  category: {
    type: String,
    enum: ['news', 'event', 'blog', 'academic'],
    default: 'news'
  },

  // Tags (for filtering/searching content)
  tags: [
    {
      type: String,
      trim: true
    }
  ],

  // Featured image (GridFS file ID)
  featuredImage: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },

});

// Notice schema (for school announcements, alerts, etc.)
const noticeSchema = new mongoose.Schema({
  // Notice content
  body: {
    type: String,
    required: true
  },

  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Target audience
  audience: {
    type: String,
    enum: ['all', 'students', 'parents', 'staff', 'faculty'],
    default: 'all'
  },

  // Expiry date (when the notice is no longer relevant)
  expiresAt: {
    type: Date,
    default: null
  },

  // Attachments (files, PDFs, etc.) - GridFS file IDs
  attachments: [
    {
      fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      name: String,
      fileType: String
    }
  ]
});

// Gallery schema (for photo albums, event galleries, etc.)
const gallerySchema = new mongoose.Schema({
  // Description of the gallery
  description: {
    type: String,
    required: true
  },

  // Category of the gallery
  category: {
    type: String,
    enum: ['event', 'campus', 'classroom', 'sports', 'cultural', 'other'],
    default: 'event'
  },

  // Gallery items (photos, videos) - GridFS file IDs
  items: [
    {
      type: {
        type: String,
        enum: ['image', 'video'],
        default: 'image'
      },
      fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      caption: {
        type: String,
        default: ''
      },
      thumbnail: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      }
    }
  ],

  // Event date (if applicable)
  eventDate: {
    type: Date,
    default: null
  },

  // Cover image (GridFS file ID for the gallery)
  coverImage: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }
});

// Register the discriminators
const Article = Content.discriminator('article', articleSchema);
const Notice = Content.discriminator('notice', noticeSchema);
const Gallery = Content.discriminator('gallery', gallerySchema);

export { Content, Article, Notice, Gallery };
