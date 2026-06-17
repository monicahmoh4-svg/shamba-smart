require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const { initDB } = require('./db');

const aiRoutes      = require('./routes/ai');
const cropsRoutes   = require('./routes/crops');
const marketRoutes  = require('./routes/market');
const adminRoutes   = require('./routes/admin');
const weatherRoutes = require('./routes/weather');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── API Routes
app.use('/api/ai',      aiRoutes);
app.use('/api/crops',   cropsRoutes);
app.use('/api/market',  marketRoutes);
app.use('/api/admin',   adminRoutes);
app.use('/api/weather', weatherRoutes);

// ── Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date(), version: '2.0.0' })
);

// ── Serve Admin SPA (at /admin/)
const adminDist = path.join(__dirname, '../admin/dist');
app.use('/admin', express.static(adminDist));
app.get('/admin/*', (req, res) => {
  const file = path.join(adminDist, 'index.html');
  if (fs.existsSync(file)) return res.sendFile(file);
  res.status(404).send('<h2>Admin not built. Run: npm run build</h2>');
});

// ── Serve Client SPA (at /)
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  const file = path.join(clientDist, 'index.html');
  if (fs.existsSync(file)) return res.sendFile(file);
  res.status(404).send('<h2>Client not built. Run: npm run build</h2>');
});

// ── Start
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🌾 Shamba Smart v2.0 running!`);
    console.log(`   Farmer App  → http://localhost:${PORT}`);
    console.log(`   Admin Panel → http://localhost:${PORT}/admin\n`);
  });
}).catch(err => {
  console.error('DB init error:', err.message);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
