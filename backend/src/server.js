require('dotenv').config();
const express = require('express');
const cors = require('cors');
const intentRoutes = require('./routes/intentRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Routes
app.use('/api/intent', intentRoutes);

// Root Test Route (User Req #4)
app.get('/', (req, res) => {
  res.send('Backend is alive');
});

// Guaranteed Test Route (User Req #5)
app.post('/parse-intent', (req, res) => {
  console.log('DIRECT ROUTE HIT:', req.body);
  res.json({ status: 'ok', source: 'direct-route', received: req.body });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'intent-parser-backend' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
