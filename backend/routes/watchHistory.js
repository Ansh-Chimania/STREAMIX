const express = require('express');
const router = express.Router();
const { getWatchHistory, addToHistory, clearHistory } = require('../controllers/watchHistoryController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWatchHistory);
router.post('/', protect, addToHistory);
router.delete('/', protect, clearHistory);

module.exports = router;
