const express = require("express");
const router = express.Router();
const controllers = require("../controllers/watches");

// Watch routes
router.get("/watches", controllers.getAllWatches);
router.get("/watches/:id", controllers.getWatchById);
router.get("/categories", controllers.getAllCategories);
router.get("/categories/:categoryId/watches", controllers.getWatchesByCategory);

// Get categories for a specific watch
router.get("/watches/:id/categories", controllers.getWatchCategories);

// Get colors for a specific watch
router.get("/watches/:id/colors", controllers.getWatchColors);

// Get materials for a specific watch
router.get("/watches/:id/materials", controllers.getWatchMaterials);


// Route pour filtrer les montres
router.get("/filter-watches", controllers.filterWatches);

module.exports = router;