// Script to clean up invalid file references in the database
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ankurschol:ankurschol@ankurschol.xtct0ji.mongodb.net/AnkurSchol';

async function cleanupInvalidData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all content documents
        const Content = mongoose.model('Content', new mongoose.Schema({}, { strict: false }));
        const contents = await Content.find({});
        
        console.log(`Found ${contents.length} content documents`);
        
        let updatedCount = 0;
        
        for (const content of contents) {
            let needsUpdate = false;
            const updates = {};
            
            // Check and fix coverImage
            if (content.coverImage && content.coverImage !== null) {
                try {
                    const { getFileInfo } = await import('./server/config/gridfs.js');
                    const fileInfo = await getFileInfo(content.coverImage);
                    if (!fileInfo) {
                        console.log(`Invalid coverImage for ${content._id}: ${content.coverImage}`);
                        updates.coverImage = null;
                        needsUpdate = true;
                    }
                } catch (error) {
                    console.log(`Error checking coverImage for ${content._id}: ${error.message}`);
                    updates.coverImage = null;
                    needsUpdate = true;
                }
            }
            
            // Check and fix featuredImage
            if (content.featuredImage && content.featuredImage !== null) {
                try {
                    const { getFileInfo } = await import('./server/config/gridfs.js');
                    const fileInfo = await getFileInfo(content.featuredImage);
                    if (!fileInfo) {
                        console.log(`Invalid featuredImage for ${content._id}: ${content.featuredImage}`);
                        updates.featuredImage = null;
                        needsUpdate = true;
                    }
                } catch (error) {
                    console.log(`Error checking featuredImage for ${content._id}: ${error.message}`);
                    updates.featuredImage = null;
                    needsUpdate = true;
                }
            }
            
            // Check and fix items array
            if (content.items && Array.isArray(content.items) && content.items.length > 0) {
                const validItems = [];
                for (const item of content.items) {
                    if (item.fileId) {
                        try {
                            const { getFileInfo } = await import('./server/config/gridfs.js');
                            const fileInfo = await getFileInfo(item.fileId);
                            if (fileInfo) {
                                validItems.push(item);
                            } else {
                                console.log(`Invalid fileId in items for ${content._id}: ${item.fileId}`);
                            }
                        } catch (error) {
                            console.log(`Error checking fileId in items for ${content._id}: ${error.message}`);
                        }
                    }
                }
                if (validItems.length !== content.items.length) {
                    updates.items = validItems;
                    needsUpdate = true;
                }
            }
            
            // Check and fix attachments array
            if (content.attachments && Array.isArray(content.attachments) && content.attachments.length > 0) {
                const validAttachments = [];
                for (const attachment of content.attachments) {
                    if (attachment.fileId) {
                        try {
                            const { getFileInfo } = await import('./server/config/gridfs.js');
                            const fileInfo = await getFileInfo(attachment.fileId);
                            if (fileInfo) {
                                validAttachments.push(attachment);
                            } else {
                                console.log(`Invalid fileId in attachments for ${content._id}: ${attachment.fileId}`);
                            }
                        } catch (error) {
                            console.log(`Error checking fileId in attachments for ${content._id}: ${error.message}`);
                        }
                    }
                }
                if (validAttachments.length !== content.attachments.length) {
                    updates.attachments = validAttachments;
                    needsUpdate = true;
                }
            }
            
            if (needsUpdate) {
                await Content.findByIdAndUpdate(content._id, updates);
                console.log(`Updated content ${content._id}`);
                updatedCount++;
            }
        }
        
        console.log(`Cleanup complete. Updated ${updatedCount} documents.`);
        
    } catch (error) {
        console.error('Cleanup error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

cleanupInvalidData();
