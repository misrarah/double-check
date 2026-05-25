const express = require('express');
const { getChannelVideos, getChannelMeta } = require('../services/youtubeService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const maxResults = Math.min(parseInt(req.query.maxResults || 12, 10), 50);
    const pageToken = req.query.pageToken || '';
    const data = await getChannelVideos(maxResults, pageToken);
    res.json(data);
  } catch (err) {
    console.error('Error fetching videos:', err.message);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

module.exports = router;
