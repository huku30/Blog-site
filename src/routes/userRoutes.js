const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Public routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserProfile);
router.get('/:id/blogs', userController.getUserBlogs);

// Protected routes - Fix the PUT route
router.put('/:id', protect, userController.updateProfile);
router.delete('/:id', protect, userController.deleteAccount);

module.exports = router;