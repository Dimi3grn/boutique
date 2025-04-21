const express = require("express");
const router = express.Router();
const controllers = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

// Authentication routes
router.post("/register", controllers.register);
router.post("/login", controllers.login);
router.post("/logout", controllers.logout);

// Protected routes
router.get("/profile", authMiddleware.verifyToken, controllers.getProfile);
router.get("/check", controllers.checkAuth);

module.exports = router;