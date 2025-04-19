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
        console.log("Fetching colors for watch ID:", watchId);
        
        const [rows] = await pool.query(
            'SELECT c.* FROM colors c ' +
            'JOIN have_colors hc ON c.color_id = hc.color_id ' +
            'WHERE hc.montre_id = ?', 
            [watchId]
        );
        
        console.log("Colors found:", rows);
        
        // Vérifiez si la structure de votre réponse correspond à ce qu'attend le frontend
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

exports.filterWatches = async (req, res) => {
    try {
        // Récupérer les paramètres de filtrage de la requête
        const { categories, colors, priceMin, priceMax, hasDiscount } = req.query;
        
        // Construire la requête SQL de base
        let query = 'SELECT m.* FROM montre m';
        let params = [];
        let conditions = [];
        let havingConditions = [];
        let groupBy = 'm.montre_id';
        let joins = [];
        
        // Filtrer par plusieurs catégories (montres appartenant à TOUTES les catégories sélectionnées)
        if (categories && categories.length > 0) {
            const categoryIds = categories.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            
            if (categoryIds.length > 0) {
                joins.push('JOIN have h ON m.montre_id = h.montre_id');
                conditions.push('h.categories_id IN (?)');
                params.push(categoryIds);
                havingConditions.push(`COUNT(DISTINCT h.categories_id) = ${categoryIds.length}`);
            }
        }
        
        // Filtrer par couleurs (montres ayant AU MOINS UNE des couleurs sélectionnées)
        if (colors && colors.length > 0) {
            const colorIds = colors.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            
            if (colorIds.length > 0) {
                joins.push('JOIN have_colors hc ON m.montre_id = hc.montre_id');
                conditions.push('hc.color_id IN (?)');
                params.push(colorIds);
            }
        }
        
        // Ajouter le reste des conditions
        if (priceMin && !isNaN(parseFloat(priceMin))) {
            conditions.push('m.prix >= ?');
            params.push(parseFloat(priceMin));
        }
        
        if (priceMax && !isNaN(parseFloat(priceMax))) {
            conditions.push('m.prix <= ?');
            params.push(parseFloat(priceMax));
        }
        
        if (hasDiscount === 'true') {
            conditions.push('m.reduction > 0');
        }
        
        // Construire la requête complète
        if (joins.length > 0) {
            query += ' ' + joins.join(' ');
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ` GROUP BY ${groupBy}`;
        
        if (havingConditions.length > 0) {
            query += ' HAVING ' + havingConditions.join(' AND ');
        }
        
        console.log('Query:', query);
        console.log('Params:', params);
        
        // Exécuter la requête
        const [rows] = await pool.query(query, params);
        
        res.status(200).json({
            message: "Filtered watches found",
            count: rows.length,
            watches: rows
        });
        
    } catch (error) {
        console.error('Error filtering watches:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get all colors
exports.getAllColors = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM colors');
        
        res.status(200).json({
            message: "Colors found",
            colors: rows
        });
        
    } catch (error) {
        console.error('Error fetching colors:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};