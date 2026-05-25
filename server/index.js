require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getChannelMeta } = require('./services/youtubeService');
const videosRouter = require('./routes/videos');

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: IS_PROD ? false : 'http://localhost:5173',
}));
app.use(express.json());

app.use('/api/videos', videosRouter);

app.get('/api/channel', async (req, res) => {
  try {
    const meta = await getChannelMeta();
    res.json(meta);
  } catch (err) {
    console.error('Error fetching channel:', err.message);
    res.status(500).json({ error: 'Failed to fetch channel info' });
  }
});

if (IS_PROD) {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
