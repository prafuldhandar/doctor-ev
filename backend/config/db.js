// Database configuration file
// This file handles the connection to MongoDB

const mongoose = require('mongoose');

// MongoDB connection string
// MongoDB Atlas cloud database
const MONGO_URI = 'mongodb+srv://prafuldhandar:12345678000@cluster0.lkpvqds.mongodb.net/evcareassist';

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB with options
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Export the connection function
module.exports = connectDB;
