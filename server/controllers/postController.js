const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const newPost = await Post.create({
      author: req.user._id,
      content,
      image: image || '',
    });

    const post = await Post.findById(newPost._id).populate('author', 'name avatar');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get feed posts
// @route   GET /api/posts
// @access  Private
const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Like or unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    if (post.likes.includes(req.user._id)) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json(post.likes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: req.user._id,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the newly added comment's user and post author
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');

    res.status(201).json(updatedPost.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this post' });
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  likePost,
  addComment,
  deletePost,
};
