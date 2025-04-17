const pool = require('../db');

exports.getAllWatches = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM montre');
        
        res.status(200).json({
            message: "Watches found",
            watches: rows
        });
        
    } catch (error) {
        console.error('Error fetching watches:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get watch by ID
exports.getWatchById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [rows] = await pool.query('SELECT * FROM montre WHERE montre_id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Watch not found" });
        }

        res.status(200).json({
            message: "Watch found",
            watch: rows[0]
        });
        
    } catch (error) {
        console.error('Error fetching watch by ID:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get watches by category
exports.getWatchesByCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        
        // Using the "have" table for the relationship
        const [rows] = await pool.query(
            'SELECT m.* FROM montre m ' +
            'JOIN have h ON m.montre_id = h.montre_id ' + 
            'WHERE h.categories_id = ?', 
            [categoryId]
        );
        
        res.status(200).json({
            message: "Watches in category found",
            watches: rows
        });
        
    } catch (error) {
        console.error('Error fetching watches by category:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories');
        
        res.status(200).json({
            message: "Categories found",
            categories: rows
        });
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get categories for a specific watch
exports.getWatchCategories = async (req, res) => {
    try {
        const watchId = parseInt(req.params.id);
        
        const [rows] = await pool.query(
            'SELECT c.* FROM categories c ' +
            'JOIN have h ON c.categories_id = h.categories_id ' +
            'WHERE h.montre_id = ?', 
            [watchId]
        );
        
        res.status(200).json({
            message: "Categories found",
            categories: rows
        });
        
    } catch (error) {
        console.error('Error fetching watch categories:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get colors for a specific watch
exports.getWatchColors = async (req, res) => {
    try {
        const watchId = parseInt(req.params.id);
        
        const [rows] = await pool.query(
            'SELECT c.* FROM colors c ' +
            'JOIN have_colors hc ON c.color_id = hc.color_id ' +
            'WHERE hc.montre_id = ?', 
            [watchId]
        );
        
        res.status(200).json({
            message: "Colors found",
            colors: rows
        });
        
    } catch (error) {
        console.error('Error fetching watch colors:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get materials for a specific watch
exports.getWatchMaterials = async (req, res) => {
    try {
        const watchId = parseInt(req.params.id);
        
        const [rows] = await pool.query(
            'SELECT m.* FROM matieres m ' +
            'JOIN have_matieres hm ON m.matiere_id = hm.matiere_id ' +
            'WHERE hm.montre_id = ?', 
            [watchId]
        );
        
        res.status(200).json({
            message: "Materials found",
            materials: rows
        });
        
    } catch (error) {
        console.error('Error fetching watch materials:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};