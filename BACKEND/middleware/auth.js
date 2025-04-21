const jwt = require('jsonwebtoken');

// Environment variables (ideally these should be in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'tempora-secret-key';

exports.verifyToken = (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: "Authentification requise" });
        }
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user ID to request
        req.userId = decoded.id;
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: "Token invalide" });
    }
};