const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    console.log('New registration request:', req.body.email);
    
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: email === 'admin@evcareassist.com' ? 'admin' : 'user'
    });
    
    console.log('User registered successfully:', user._id);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'User not found or invalid credentials'
      });
    }
    
    if (email === 'admin@evcareassist.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log('Updated user role to admin');
    }
    
    console.log('Login successful:', user._id);
    
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

module.exports = router;
