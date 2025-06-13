const express = require('express');
const { db } = require('../config/firebase');
const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userData = userDoc.data();
    // Remove sensitive data
    delete userData.password;

    res.json({
      success: true,
      data: { id: userDoc.id, ...userData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    // Don't allow password updates through this endpoint
    delete updateData.password;

    await db.collection('users').doc(userId).update(updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
