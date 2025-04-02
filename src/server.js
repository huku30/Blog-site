const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({ 
        status: 'error',
        message: 'Route not found' 
    });
});

// Unified error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Connect to MongoDB and start server with retry mechanism
async function startServer(initialPort) {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('📦 MongoDB Connected successfully');

        let currentPort = initialPort;
        let maxAttempts = 10;
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                await new Promise((resolve, reject) => {
                    const server = app.listen(currentPort)
                        .once('listening', () => {
                            console.log(`✅ Server started successfully on http://localhost:${currentPort}`);
                            resolve();
                        })
                        .once('error', (err) => {
                            if (err.code === 'EADDRINUSE') {
                                currentPort++;
                                attempts++;
                                reject(err);
                            } else {
                                reject(err);
                            }
                        });
                });
                break;
            } catch (err) {
                if (attempts === maxAttempts) {
                    throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
                }
                console.log(`Port ${currentPort - 1} in use, trying ${currentPort}...`);
            }
        }
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

const PORT = process.env.PORT || 3000;
startServer(PORT);

module.exports = app;