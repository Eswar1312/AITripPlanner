require('dotenv').config();

const express = require('express');
const cors = require('cors');
const tripRoutes = require('./routes/trip');

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => {
  res.json({
    name: 'Talk2Trip API',
    version: '1.0.0',
    endpoints: ['/api/health', '/api/generate-trip', '/api/refine-trip'],
  });
});

app.use('/api', tripRoutes);

app.use((err, _req, res, _next) => {
  console.error('[Talk2Trip] Unhandled error:', err);
  res.status(500).json({
    success: false,
    code: 'SERVER_ERROR',
    message: 'Unexpected server error.',
  });
});

app.listen(PORT, () => {
  console.log(`Talk2Trip API running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is missing. Set it in server/.env');
  }
});
