const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Environment variables (ideally these should be in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'tempora-secret-key';
const JWT_EXPIRES_IN = '24h';

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
        }
        
        // Check if email already exists
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }
        
        // Check if username already exists
        const [existingUsernames] = await pool.query(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );
        
        if (existingUsernames.length > 0) {
            return res.status(400).json({ message: "Ce nom d'utilisateur est déjà utilisé" });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())',
            [username, email, hashedPassword]
        );
        
        res.status(201).json({
            message: "Inscription réussie",
            user: {
                id: result.insertId,
                username,
                email
            }
        });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe requis" });
        }
        
        // Find user by email
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }
        
        const user = users[0];
        
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.user_id }, // Assurez-vous d'utiliser le bon nom de colonne pour l'ID
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        // Retourner le token directement dans la réponse pour utilisation avec localStorage
        res.status(200).json({
            message: "Connexion réussie",
            token: token, // Le token à stocker dans localStorage
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Erreur serveur lors de la connexion" });
    }
};

exports.logout = (req, res) => {
    // Puisque nous utilisons localStorage, il n'y a pas besoin de nettoyer les cookies côté serveur
    // La déconnexion sera gérée côté client en supprimant le token du localStorage
    res.status(200).json({ message: "Déconnexion réussie" });
};

exports.getProfile = async (req, res) => {
    try {
        // User ID is set by the verifyToken middleware
        const userId = req.userId;
        
        // Get user data
        const [users] = await pool.query(
            'SELECT user_id, username, email, created_at FROM users WHERE user_id = ?', 
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        
        const user = users[0];
        
        res.status(200).json({
            message: "Profil récupéré avec succès",
            user
        });
        
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération du profil" });
    }
};

exports.checkAuth = (req, res) => {
    try {
        // Le middleware verifyToken a déjà vérifié le token et défini req.userId
        // Donc si on arrive ici, c'est que l'authentification est valide
        
        // Optionnel: récupérer les informations utilisateur
        pool.query(
            'SELECT user_id, username, email FROM users WHERE user_id = ?', 
            [req.userId],
            (error, results) => {
                if (error) {
                    console.error('Database error during auth check:', error);
                    return res.status(500).json({ 
                        authenticated: false,
                        message: "Erreur lors de la récupération des données utilisateur" 
                    });
                }
                
                if (results.length === 0) {
                    return res.status(404).json({ 
                        authenticated: false,
                        message: "Utilisateur non trouvé" 
                    });
                }
                
                const user = results[0];
                
                res.status(200).json({
                    authenticated: true,
                    user: {
                        id: user.user_id,
                        username: user.username,
                        email: user.email
                    }
                });
            }
        );
        
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(401).json({ 
            authenticated: false,
            message: "Session invalide ou expirée" 
        });
    }
};