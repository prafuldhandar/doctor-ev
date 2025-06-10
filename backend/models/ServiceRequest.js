// ServiceRequest Model
// This defines the structure of service request data in MongoDB

const mongoose = require('mongoose');

// Define the schema for service requests
const ServiceRequestSchema = new mongoose.Schema({
  // Customer name (required field)
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  
  // Customer phone number (required field)
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // Customer email (required field)
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  
  // Electric vehicle model (required field)
  evModel: {
    type: String,
    required: [true, 'EV Model is required'],
    trim: true
  },
  
  // Type of problem (required field)
  problemType: {
    type: String,
    required: [true, 'Problem type is required'],
    enum: ['Battery Issue', 'Charging Problem', 'Motor Issue', 'Software Update', 'Brake System', 'Other']
  },
  
  // Service location (required field)
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  
  // Detailed description of the problem
  description: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Status of the service request
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  
  // Date when request was created
  date: {
    type: Date,
    default: Date.now
  }
});

// Create and export the model
module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
