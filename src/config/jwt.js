const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables!');
    process.exit(1);
}

console.log('JWT configuration loaded successfully');
