const pool = require('../db');

// Add a watch to user's cart
exports.addToCart = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const { watchId, quantity = 1 } = req.body;
        
        if (!watchId) {
            return res.status(400).json({ message: "Watch ID is required" });
        }
        
        // Check if the watch exists
        const [watches] = await pool.query('SELECT * FROM montre WHERE montre_id = ?', [watchId]);
        
        if (watches.length === 0) {
            return res.status(404).json({ message: "Watch not found" });
        }
        
        // Check if already in cart
        const [existingItems] = await pool.query(
            'SELECT * FROM panier WHERE user_id = ? AND montre_id = ?', 
            [userId, watchId]
        );
        
        if (existingItems.length > 0) {
            // Update quantity instead of adding new item
            await pool.query(
                'UPDATE panier SET quantity = ? WHERE user_id = ? AND montre_id = ?',
                [quantity, userId, watchId]
            );
            
            return res.status(200).json({
                message: "Cart updated successfully",
                data: {
                    userId,
                    watchId,
                    quantity
                }
            });
        }
        
        // Add to cart
        await pool.query(
            'INSERT INTO panier (user_id, montre_id, quantity) VALUES (?, ?, ?)',
            [userId, watchId, quantity]
        );
        
        res.status(201).json({
            message: "Watch added to cart",
            data: {
                userId,
                watchId,
                quantity
            }
        });
        
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Remove a watch from user's cart
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const watchId = req.params.watchId;
        
        // Remove from cart
        const [result] = await pool.query(
            'DELETE FROM panier WHERE user_id = ? AND montre_id = ?',
            [userId, watchId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        
        res.status(200).json({
            message: "Watch removed from cart",
            data: {
                userId,
                watchId
            }
        });
        
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update quantity of a watch in the cart
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const watchId = req.params.watchId;
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Valid quantity is required" });
        }
        
        // Update cart item
        const [result] = await pool.query(
            'UPDATE panier SET quantity = ? WHERE user_id = ? AND montre_id = ?',
            [quantity, userId, watchId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        
        res.status(200).json({
            message: "Cart item updated",
            data: {
                userId,
                watchId,
                quantity
            }
        });
        
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all items in user's cart with complete product details
exports.getUserCart = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        
        // Get user's cart items with complete watch details
        const [cartItems] = await pool.query(
            `SELECT m.*, p.quantity, p.pannier_id 
             FROM panier p
             JOIN montre m ON p.montre_id = m.montre_id
             WHERE p.user_id = ?`,
            [userId]
        );
        
        // Calculate total price
        let totalPrice = 0;
        cartItems.forEach(item => {
            const price = item.reduction > 0 
                ? item.prix * (1 - item.reduction/100) 
                : item.prix;
            totalPrice += price * item.quantity;
        });
        
        res.status(200).json({
            message: "User cart retrieved",
            count: cartItems.length,
            totalPrice: parseFloat(totalPrice.toFixed(2)),
            cartItems
        });
        
    } catch (error) {
        console.error('Get user cart error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Check if a watch is in user's cart
exports.checkIsInCart = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const watchId = req.params.watchId;
        
        // Check if in cart
        const [cartItems] = await pool.query(
            'SELECT * FROM panier WHERE user_id = ? AND montre_id = ?',
            [userId, watchId]
        );
        
        const isInCart = cartItems.length > 0;
        
        res.status(200).json({
            isInCart,
            quantity: isInCart ? cartItems[0].quantity : 0,
            cartItemId: isInCart ? cartItems[0].pannier_id : null
        });
        
    } catch (error) {
        console.error('Check cart error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get cart count (number of items)
exports.getCartCount = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        
        // Count cart items
        const [result] = await pool.query(
            'SELECT COUNT(*) as count FROM panier WHERE user_id = ?',
            [userId]
        );
        
        res.status(200).json({
            count: result[0].count
        });
        
    } catch (error) {
        console.error('Get cart count error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Clear cart (remove all items)
exports.clearCart = async (req, res) => {
    try {
        
        const userId = req.userId; // From auth middleware
        
        // Log for debugging
        console.log(`Clearing cart for user ${userId}`);
        
        // Delete all cart items for this user
        const [result] = await pool.query(
            'DELETE FROM panier WHERE user_id = ?',
            [userId]
        );
        
        console.log(`Deleted ${result.affectedRows} items from cart`);
        
        res.status(200).json({
            message: "Cart cleared successfully"
        });
        
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};