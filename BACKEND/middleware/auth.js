const jwt = require('jsonwebtoken');

// Environment variables (ideally these should be in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'tempora-secret-key';

exports.verifyToken = (req, res, next) => {
    try {
        console.log('Verifying token...');
        // Récupérer le token depuis l'en-tête Authorization
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({ message: "Authentification requise" });
        }
        
        // Format attendu: "Bearer TOKEN"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            console.log('Invalid Authorization format:', authHeader);
            return res.status(401).json({ message: "Format d'autorisation invalide" });
        }
        
        const token = parts[1];
        
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attacher l'ID utilisateur à la requête pour utilisation ultérieure
        req.userId = decoded.id;
        
        // Log successful auth for debugging
        console.log(`User ${decoded.id} authenticated successfully`);
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Session expirée, veuillez vous reconnecter" });
        }
        res.status(401).json({ message: "Token invalide" });
    }
};