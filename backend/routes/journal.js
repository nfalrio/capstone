const express = require('express');
const axios = require('axios');
const { db } = require('../config/firebase');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

// Get all journal entries for a user
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user can only access their own data
    if (req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const journalsRef = db.collection('journals');
    const snapshot = await journalsRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const journals = [];
    snapshot.forEach(doc => {
      journals.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      success: true,
      data: journals
    });
  } catch (error) {
    console.error('Error getting journals:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add new journal entry with sentiment analysis
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userId, title, content, mood, tags } = req.body;

    // Verify user can only create data for themselves
    if (req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Analyze sentiment using ML service
    let sentimentData = null;
    try {
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
        text: content
      });
      sentimentData = mlResponse.data;
    } catch (mlError) {
      console.error('ML service error:', mlError.message);
      // Continue without sentiment analysis if ML service fails
    }

    const journalData = {
      userId,
      title,
      content,
      mood: parseInt(mood),
      tags: tags || [],
      sentiment: sentimentData?.sentiment || 'unknown',
      sentimentConfidence: sentimentData?.confidence || 0,
      sentimentProbabilities: sentimentData?.probabilities || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('journals').add(journalData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...journalData }
    });
  } catch (error) {
    console.error('Error creating journal:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update journal entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, mood, tags } = req.body;

    // Get existing journal to verify ownership
    const journalDoc = await db.collection('journals').doc(id).get();
    if (!journalDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    const journalData = journalDoc.data();
    if (journalData.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Re-analyze sentiment if content changed
    let sentimentData = null;
    if (content) {
      try {
        const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
          text: content
        });
        sentimentData = mlResponse.data;
      } catch (mlError) {
        console.error('ML service error:', mlError.message);
      }
    }

    const updateData = {
      title,
      content,
      mood: mood ? parseInt(mood) : undefined,
      tags: tags || [],
      updatedAt: new Date().toISOString()
    };

    // Add sentiment data if analysis was successful
    if (sentimentData) {
      updateData.sentiment = sentimentData.sentiment;
      updateData.sentimentConfidence = sentimentData.confidence;
      updateData.sentimentProbabilities = sentimentData.probabilities;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await db.collection('journals').doc(id).update(updateData);

    res.json({
      success: true,
      data: { id, ...updateData }
    });
  } catch (error) {
    console.error('Error updating journal:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete journal entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get existing journal to verify ownership
    const journalDoc = await db.collection('journals').doc(id).get();
    if (!journalDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    const journalData = journalDoc.data();
    if (journalData.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    await db.collection('journals').doc(id).delete();

    res.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting journal:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Analyze existing journal content
router.post('/:id/analyze', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get journal entry
    const journalDoc = await db.collection('journals').doc(id).get();
    if (!journalDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    const journal = journalDoc.data();

    // Analyze sentiment
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
      text: journal.content
    });

    // Update journal with sentiment analysis
    const updateData = {
      sentiment: mlResponse.data.sentiment,
      sentimentConfidence: mlResponse.data.confidence,
      sentimentProbabilities: mlResponse.data.probabilities,
      updatedAt: new Date().toISOString()
    };

    await db.collection('journals').doc(id).update(updateData);

    res.json({
      success: true,
      data: mlResponse.data
    });
  } catch (error) {
    console.error('Error analyzing journal:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
