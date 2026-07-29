require('dotenv').config();

const express = require('express');
const cors = require('cors');
const tripRoutes = require('./routes/trip');

const app = express();
const PORT = process.env.PORT || 5001;
const rawOrigin = process.env.CLIENT_ORIGIN || '*';
const cleanOrigin = rawOrigin === '*' ? '*' : rawOrigin.replace(/\/$/, '');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || cleanOrigin === '*' || origin.replace(/\/$/, '') === cleanOrigin) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
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
