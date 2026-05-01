const express = require('express');
const router = express.Router();
const { getUserById, followUser, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchUsers);
router.get('/:id', getUserById);
router.put('/:id/follow', protect, followUser);

module.exports = router;
