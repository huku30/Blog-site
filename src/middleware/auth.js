const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        console.log('Auth header received:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Please provide a valid authentication token'
            });
        }

        // Extract and clean token
        const token = authHeader.split(' ')[1].trim();
        console.log('Token extracted:', token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found in authorization header'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log('Token decoded successfully:', decoded);

            // Get user from database
            console.log("user id recieved in auth.js", decoded);
            const user = await User.findById(decoded.userId || decoded._id);
            console.log(user)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Attach user to request
            req.user = user;
            next();

        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        // return res.status(500).json({
        //     success: false,
        //     message: 'Internal server error'
        // });
    }
};

module.exports = { protect };