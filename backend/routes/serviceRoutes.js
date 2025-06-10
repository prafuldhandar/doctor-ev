// Service Routes
// This file defines all API endpoints for service requests

const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');

// POST /api/book-service
// Create a new service request
router.post('/book-service', async (req, res) => {
  try {
    console.log('New service request received:', req.body);
    
    // Extract data from request body
    const { name, phone, email, evModel, problemType, location, description } = req.body;
    
    // Validate required fields
    if (!name || !phone || !email || !evModel || !problemType || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Create new service request in database
    const serviceRequest = await ServiceRequest.create({
      name,
      phone,
      email,
      evModel,
      problemType,
      location,
      description
    });
    
    console.log('Service request saved:', serviceRequest._id);
    
    // Send success response
    res.status(201).json({
      success: true,
      message: 'Service request submitted successfully!',
      data: serviceRequest
    });
    
  } catch (error) {
    console.error('Error creating service request:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to submit service request',
      error: error.message
    });
  }
});

// GET /api/requests
// Retrieve all service requests
router.get('/requests', async (req, res) => {
  try {
    console.log('Fetching all service requests...');
    
    // Get all requests from database, sorted by date (newest first)
    const requests = await ServiceRequest.find().sort({ date: -1 });
    
    console.log(`Found ${requests.length} service requests`);
    
    // Send success response with data
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
    
  } catch (error) {
    console.error('Error fetching service requests:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service requests',
      error: error.message
    });
  }
});

// Export the router
module.exports = router;
