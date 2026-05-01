const express = require('express');
const router = express.Router();
const { getUserById, followUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', getUserById);
router.put('/:id/follow', protect, followUser);

module.exports = router;
