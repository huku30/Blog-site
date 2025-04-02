const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log(`📦 MongoDB Connected: ${conn.connection.host}`);

        // Handle MongoDB connection errors
        mongoose.connection.on('error', err => {
            console.error('❌ MongoDB connection error:', {
                message: err.message,
                code: err.code,
                name: err.name
            });
        });

        // Add reconnection handler
        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected successfully');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🔌 MongoDB disconnected');
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('🛑 MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('❌ Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });

        return conn;

    } catch (error) {
        console.error('❌ MongoDB connection error:', {
            message: error.message,
            code: error.code,
            name: error.name
        });
        process.exit(1);
    }
};

module.exports = connectDB;