const pool = require('../db');

// Add a watch to user's favorites
exports.addToFavorites = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const { watchId } = req.body;
        
        if (!watchId) {
            return res.status(400).json({ message: "Watch ID is required" });
        }
        
        // Check if the watch exists
        const [watches] = await pool.query('SELECT * FROM montre WHERE montre_id = ?', [watchId]);
        
        if (watches.length === 0) {
            return res.status(404).json({ message: "Watch not found" });
        }
        
        // Check if already in favorites
        const [existingFavorites] = await pool.query(
            'SELECT * FROM favorited WHERE user_id = ? AND montre_id = ?', 
            [userId, watchId]
        );
        
        if (existingFavorites.length > 0) {
            return res.status(400).json({ message: "Watch already in favorites" });
        }
        
        // Add to favorites
        await pool.query(
            'INSERT INTO favorited (user_id, montre_id) VALUES (?, ?)',
            [userId, watchId]
        );
        
        res.status(201).json({
            message: "Watch added to favorites",
            data: {
                userId,
                watchId
            }
        });
        
    } catch (error) {
        console.error('Add to favorites error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Remove a watch from user's favorites
exports.removeFromFavorites = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const watchId = req.params.watchId;
        
        // Remove from favorites
        const [result] = await pool.query(
            'DELETE FROM favorited WHERE user_id = ? AND montre_id = ?',
            [userId, watchId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Favorite not found" });
        }
        
        res.status(200).json({
            message: "Watch removed from favorites",
            data: {
                userId,
                watchId
            }
        });
        
    } catch (error) {
        console.error('Remove from favorites error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all favorites for a user
exports.getUserFavorites = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        
        // Get user's favorite watches with complete watch details
        const [favorites] = await pool.query(
            `SELECT m.*, f.fav_id 
             FROM favorited f
             JOIN montre m ON f.montre_id = m.montre_id
             WHERE f.user_id = ?`,
            [userId]
        );
        
        res.status(200).json({
            message: "User favorites retrieved",
            count: favorites.length,
            favorites
        });
        
    } catch (error) {
        console.error('Get user favorites error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Check if a watch is in user's favorites
exports.checkIsFavorite = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const watchId = req.params.watchId;
        
        // Check if in favorites
        const [favorites] = await pool.query(
            'SELECT * FROM favorited WHERE user_id = ? AND montre_id = ?',
            [userId, watchId]
        );
        
        const isFavorite = favorites.length > 0;
        
        res.status(200).json({
            isFavorite,
            favId: isFavorite ? favorites[0].fav_id : null
        });
        
    } catch (error) {
        console.error('Check favorite error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};