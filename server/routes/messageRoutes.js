const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getConversations,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.post('/', protect, sendMessage);
router.get('/:userId', protect, getMessages);

module.exports = router;
