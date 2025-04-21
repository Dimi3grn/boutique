const express = require("express");
const router = express.Router();
const controllers = require("../controllers/favorites");
const authMiddleware = require("../middleware/auth");

// All favorites routes require authentication
router.use(authMiddleware.verifyToken);

// Add a watch to favorites
router.post("/", controllers.addToFavorites);

// Remove a watch from favorites
router.delete("/:watchId", controllers.removeFromFavorites);

// Get all user favorites
router.get("/", controllers.getUserFavorites);

// Check if a watch is in user's favorites
router.get("/check/:watchId", controllers.checkIsFavorite);

module.exports = router;