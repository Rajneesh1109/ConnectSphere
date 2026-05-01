const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeedPosts,
  likePost,
  addComment,
  deletePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createPost)
  .get(protect, getFeedPosts);

router.route('/:id')
  .delete(protect, deletePost);

router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);

module.exports = router;
