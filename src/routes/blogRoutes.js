const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const blogController = require('../controllers/blogController');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Protected routes
router.post('/', protect, blogController.createBlog);
router.put('/:id', protect, blogController.updateBlog);
router.delete('/:id', protect, blogController.deleteBlog);

module.exports = router;