const express = require('express');
const axios = require('axios');
const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

// Test ML service connection
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`);
    res.json({
      success: true,
      mlService: response.data
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'ML service unavailable',
      details: error.message
    });
  }
});

// Predict sentiment for single text
router.post('/predict', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Valid text is required'
      });
    }

    const response = await axios.post(`${ML_SERVICE_URL}/predict`, { text });
    
    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('ML Prediction Error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data.error || 'ML service error'
      });
    }
    
    res.status(503).json({
      success: false,
      error: 'ML service unavailable'
    });
  }
});

// Predict sentiment for multiple texts
router.post('/predict/batch', async (req, res) => {
  try {
    const { texts } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        success: false,
        error: 'Valid texts array is required'
      });
    }

    const response = await axios.post(`${ML_SERVICE_URL}/predict/batch`, { texts });
    
    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('ML Batch Prediction Error:', error.message);
    
    res.status(503).json({
      success: false,
      error: 'ML service unavailable'
    });
  }
});

module.exports = router;
