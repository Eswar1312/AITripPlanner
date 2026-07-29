const express = require('express');
const { generateTrip, refineTrip } = require('../services/gemini');
const { validateTrip } = require('../utils/schema');

const router = express.Router();

router.post('/generate-trip', async (req, res) => {
  try {
    const { prompt } = req.body ?? {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        code: 'BAD_REQUEST',
        message: 'A non-empty trip prompt is required.',
      });
    }

    if (prompt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        code: 'BAD_REQUEST',
        message: 'Please describe your trip in a bit more detail (at least 10 characters).',
      });
    }

    const trip = await generateTrip(prompt.trim());

    return res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    return sendError(res, error);
  }
});

router.post('/refine-trip', async (req, res) => {
  try {
    const { trip, refinement } = req.body ?? {};

    if (!refinement || typeof refinement !== 'string' || !refinement.trim()) {
      return res.status(400).json({
        success: false,
        code: 'BAD_REQUEST',
        message: 'A refinement instruction is required.',
      });
    }

    const existing = validateTrip(trip);
    if (!existing.success) {
      return res.status(400).json({
        success: false,
        code: 'BAD_REQUEST',
        message: 'Existing trip JSON is invalid.',
        details: existing.error.issues?.slice(0, 8),
      });
    }

    const updated = await refineTrip(existing.data, refinement.trim());

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return sendError(res, error);
  }
});

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'Talk2Trip API',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

function sendError(res, error) {
  const code = error.code || 'SERVER_ERROR';
  const statusMap = {
    MISSING_API_KEY: 500,
    EMPTY_RESPONSE: 502,
    MALFORMED_JSON: 502,
    INVALID_SCHEMA: 502,
    RATE_LIMIT: 429,
    TIMEOUT: 504,
    API_FAILURE: 502,
  };

  const status = statusMap[code] || 500;

  console.error(`[Talk2Trip] ${code}:`, error.message, error.details || '');

  return res.status(status).json({
    success: false,
    code,
    message: error.message || 'Something went wrong while planning your trip.',
    details: error.details || undefined,
  });
}

module.exports = router;
