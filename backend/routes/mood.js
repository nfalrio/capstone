const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all mood entries for a user
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

    const moodsRef = db.collection('moods');
    const snapshot = await moodsRef
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();
    
    const moods = [];
    snapshot.forEach(doc => {
      moods.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      success: true,
      data: moods
    });
  } catch (error) {
    console.error('Error getting moods:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add new mood entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userId, mood, note, date, stressLevel, tags } = req.body;

    // Verify user can only create data for themselves
    if (req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const moodData = {
      userId,
      mood: parseInt(mood),
      note: note || '',
      date: date || new Date().toISOString(),
      stressLevel: stressLevel || null,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('moods').add(moodData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...moodData }
    });
  } catch (error) {
    console.error('Error creating mood:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update mood entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get existing mood to verify ownership
    const moodDoc = await db.collection('moods').doc(id).get();
    if (!moodDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }

    const moodData = moodDoc.data();
    if (moodData.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await db.collection('moods').doc(id).update(updateData);

    res.json({
      success: true,
      data: { id, ...updateData }
    });
  } catch (error) {
    console.error('Error updating mood:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete mood entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get existing mood to verify ownership
    const moodDoc = await db.collection('moods').doc(id).get();
    if (!moodDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }

    const moodData = moodDoc.data();
    if (moodData.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    await db.collection('moods').doc(id).delete();

    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mood:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get mood statistics
router.get('/:userId/stats', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = '30' } = req.query;
    
    // Verify user can only access their own data
    if (req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    const moodsRef = db.collection('moods');
    const snapshot = await moodsRef
      .where('userId', '==', userId)
      .where('date', '>=', startDate.toISOString())
      .get();
    
    const moods = [];
    snapshot.forEach(doc => {
      moods.push(doc.data());
    });

    // Calculate statistics
    const stats = {
      totalEntries: moods.length,
      averageMood: moods.length > 0 ? moods.reduce((sum, m) => sum + m.mood, 0) / moods.length : 0,
      moodDistribution: {},
      period: parseInt(period)
    };

    // Count mood distribution
    [1, 2, 3, 4, 5].forEach(mood => {
      stats.moodDistribution[mood] = moods.filter(m => m.mood === mood).length;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting mood stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
