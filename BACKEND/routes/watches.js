const express = require("express");
const router = express.Router();
const controllers = require("../controllers/watches");

// Watch routes
router.get("/watches", controllers.getAllWatches);
router.get("/watches/:id", controllers.getWatchById);
router.get("/categories", controllers.getAllCategories);
router.get("/categories/:categoryId/watches", controllers.getWatchesByCategory);

module.exports = router;