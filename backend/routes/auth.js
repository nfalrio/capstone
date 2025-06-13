const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const usersRef = db.collection('users');
    const existingUser  = await usersRef.where('email', '==', email).get();
    
    if (!existingUser .empty) {
      return res.status(400).json({
        success: false,
        error: 'User  already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
      profile: {
        phone: '',
        location: '',
        occupation: '',
        education: '',
        bio: ''
      }
    };

    const docRef = await usersRef.add(userData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: docRef.id, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: docRef.id,
          email,
          name
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const usersRef = db.collection('users');
    const userSnapshot = await usersRef.where('email', '==', email).get();
    
    if (userSnapshot.empty) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: userDoc.id, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: userDoc.id,
          email: user.email,
          name: user.name
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
