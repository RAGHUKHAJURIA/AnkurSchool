// Script to sync Clerk user to database with admin role
// Run this script to create your admin user in the database

import mongoose from 'mongoose';
import User from './server/models/user.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './server/.env' });

const syncAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ankur-school');
        console.log('Connected to MongoDB');

        // Get user input
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (query) => new Promise((resolve) => rl.question(query, resolve));

        console.log('\n🔧 Admin User Sync Tool');
        console.log('========================\n');

        const clerkUserId = await question('Enter your Clerk User ID (from Clerk dashboard): ');
        const email = await question('Enter your email address: ');
        const name = await question('Enter your name (or press Enter to use email prefix): ');

        rl.close();

        // Check if user already exists
        let user = await User.findOne({ externalId: clerkUserId });

        if (user) {
            // Update existing user to admin
            user.role = 'admin';
            user.email = email;
            user.name = name || user.name;
            await user.save();
            console.log('\n✅ User updated to admin role!');
        } else {
            // Create new admin user
            user = new User({
                externalId: clerkUserId,
                email: email,
                name: name || email.split('@')[0],
                role: 'admin'
            });
            await user.save();
            console.log('\n✅ Admin user created successfully!');
        }

        console.log('\n📋 User Details:');
        console.log(`ID: ${user._id}`);
        console.log(`Clerk ID: ${user.externalId}`);
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.name}`);
        console.log(`Role: ${user.role}`);

        console.log('\n🎉 You can now access admin routes!');
        console.log('Try logging in to the admin panel at: http://localhost:5173/admin');

    } catch (error) {
        console.error('❌ Error syncing user:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
        process.exit(0);
    }
};

// Run the sync
syncAdminUser();
