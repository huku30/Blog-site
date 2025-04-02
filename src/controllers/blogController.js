const Blog = require('../models/Blog');

// Get all blogs
async function getAllBlogs(req, res) {
    try {
        const blogs = await Blog.find().populate('author', 'name');
        res.status(200).json({ success: true, data: blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get single blog
async function getBlogById(req, res) {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Create blog
async function createBlog(req, res) {
    try {
        const blog = await Blog.create({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id
        });
        res.status(201).json({ success: true, data: blog });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Update blog
async function updateBlog(req, res) {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Delete blog
async function deleteBlog(req, res) {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
};