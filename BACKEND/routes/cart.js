const express = require("express");
const router = express.Router();
const controllers = require("../controllers/cart");
const authMiddleware = require("../middleware/auth");

// All cart routes require authentication
router.use(authMiddleware.verifyToken);

// Add a watch to cart
router.post("/", controllers.addToCart);

// Remove a watch from cart
router.delete("/:watchId", controllers.removeFromCart);

// Update quantity of a watch in the cart
router.put("/:watchId", controllers.updateCartItem);

// Get all items in user's cart
router.get("/", controllers.getUserCart);

// Check if a watch is in user's cart
router.get("/check/:watchId", controllers.checkIsInCart);

// Get cart count (number of items)
router.get("/count", controllers.getCartCount);

// Clear cart (remove all items)
// Make sure this route is defined BEFORE /:watchId route to avoid conflicts
router.delete("/clear", controllers.clearCart);

module.exports = router;