const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

// Optional auth - doesn't require token but attaches user if present
function optionalAuth(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            req.user = decoded;
        }
        next();
    } catch (error) {
        // If token is invalid, just proceed without user
        next();
    }
}

module.exports = {
    authMiddleware,
    optionalAuth,
};
