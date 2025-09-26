import mongoose from "mongoose";
import { initGridFS } from "./gridfs.js";

// connect to mongodb database
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected:", mongoose.connection.name);
    // Initialize GridFS after connection
    initGridFS();
  });

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "AnkurSchol", // 👈 this is the actual database name
  });
};

export default connectDB;



