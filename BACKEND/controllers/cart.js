/**
 * Cart Controller
 * Handles all cart-related operations with stock management
 */

const pool = require('../db');

/**
 * Get all items in user's cart with complete product details
 */
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
        
        // Calculate total price and check stock status
        let totalPrice = 0;
        const itemsWithStockStatus = cartItems.map(item => {
            const price = item.reduction > 0 
                ? item.prix * (1 - item.reduction/100) 
                : item.prix;
            totalPrice += price * item.quantity;
            
            return {
                ...item,
                hasEnoughStock: item.stock >= item.quantity,
                availableStock: item.stock
            };
        });
        
        res.status(200).json({
            message: "User cart retrieved",
            count: cartItems.length,
            totalPrice: parseFloat(totalPrice.toFixed(2)),
            cartItems: itemsWithStockStatus
        });
        
    } catch (error) {
        console.error('Get user cart error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * Add a watch to user's cart
 */
exports.addToCart = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const { watchId, quantity = 1 } = req.body;
        
        if (!watchId) {
            return res.status(400).json({ message: "Watch ID is required" });
        }
        
        // Check if the watch exists and has enough stock
        const [watches] = await pool.query('SELECT * FROM montre WHERE montre_id = ?', [watchId]);
        
        if (watches.length === 0) {
            return res.status(404).json({ message: "Watch not found" });
        }
        
        const watch = watches[0];
        
        // Check stock
        if (watch.stock < quantity) {
            return res.status(400).json({ 
                message: "Stock insuffisant", 
                availableStock: watch.stock 
            });
        }
        
        // Check if already in cart
        const [existingItems] = await pool.query(
            'SELECT * FROM panier WHERE user_id = ? AND montre_id = ?', 
            [userId, watchId]
        );
        
        if (existingItems.length > 0) {
            // Check if new total quantity exceeds stock
            const currentQuantity = existingItems[0].quantity;
            const newTotalQuantity = currentQuantity + quantity;
            
            if (newTotalQuantity > watch.stock) {
                return res.status(400).json({ 
                    message: "La quantité totale dépasse le stock disponible", 
                    availableStock: watch.stock,
                    currentInCart: currentQuantity
                });
            }
            
            // Update quantity instead of adding new item
            await pool.query(
                'UPDATE panier SET quantity = quantity + ? WHERE user_id = ? AND montre_id = ?',
                [quantity, userId, watchId]
            );
            
            return res.status(200).json({
                message: "Quantité mise à jour",
                data: {
                    userId,
                    watchId,
                    quantity: currentQuantity + quantity
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

/**
 * Remove a watch from user's cart
 */
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

/**
 * Update quantity of a watch in the cart
 */
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const watchId = req.params.watchId;
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Valid quantity is required" });
        }
        
        // Check stock
        const [watches] = await pool.query('SELECT stock FROM montre WHERE montre_id = ?', [watchId]);
        
        if (watches.length === 0) {
            return res.status(404).json({ message: "Watch not found" });
        }
        
        const stock = watches[0].stock;
        
        if (quantity > stock) {
            return res.status(400).json({ 
                message: "Quantité demandée supérieure au stock disponible", 
                availableStock: stock 
            });
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

/**
 * Check if a watch is in user's cart
 */
exports.checkIsInCart = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const watchId = req.params.watchId;
        
        // Check if in cart
        const [cartItems] = await pool.query(
            'SELECT * FROM panier WHERE user_id = ? AND montre_id = ?',
            [userId, watchId]
        );
        
        // Get watch stock
        const [watchData] = await pool.query(
            'SELECT stock FROM montre WHERE montre_id = ?',
            [watchId]
        );
        
        const isInCart = cartItems.length > 0;
        const stock = watchData.length > 0 ? watchData[0].stock : 0;
        const hasStock = stock > 0;
        
        res.status(200).json({
            isInCart,
            quantity: isInCart ? cartItems[0].quantity : 0,
            cartItemId: isInCart ? cartItems[0].pannier_id : null,
            stock,
            hasStock
        });
        
    } catch (error) {
        console.error('Check cart error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * Get cart count (number of items)
 */
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

/**
 * Clear cart (remove all items)
 */
exports.clearCart = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        
        // Delete all cart items for this user
        const [result] = await pool.query(
            'DELETE FROM panier WHERE user_id = ?',
            [userId]
        );
        
        res.status(200).json({
            message: "Cart cleared successfully",
            itemsRemoved: result.affectedRows
        });
        
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * Process checkout and update stock
 */
exports.processCheckout = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const userId = req.userId; // From auth middleware
        
        await connection.beginTransaction();
        
        // Get user's cart items with current stock information
        const [cartItems] = await connection.query(
            `SELECT p.montre_id, p.quantity, m.stock, m.nom 
             FROM panier p
             JOIN montre m ON p.montre_id = m.montre_id
             WHERE p.user_id = ?`,
            [userId]
        );
        
        if (cartItems.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: "Le panier est vide" });
        }
        
        // Check stock for all items
        const outOfStockItems = [];
        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                outOfStockItems.push({
                    montre_id: item.montre_id,
                    nom: item.nom,
                    requestedQuantity: item.quantity,
                    availableStock: item.stock
                });
            }
        }
        
        if (outOfStockItems.length > 0) {
            await connection.rollback();
            return res.status(400).json({ 
                message: "Certains articles n'ont pas de stock suffisant", 
                outOfStockItems 
            });
        }
        
        // Create order record (if you have an orders table)
        // const [orderResult] = await connection.query(
        //     'INSERT INTO orders (user_id, order_date, status) VALUES (?, NOW(), "completed")',
        //     [userId]
        // );
        // const orderId = orderResult.insertId;
        
        // Update stock for each item
        for (const item of cartItems) {
            await connection.query(
                'UPDATE montre SET stock = stock - ? WHERE montre_id = ?',
                [item.quantity, item.montre_id]
            );
            
            // Add to order items if you have an order_items table
            // await connection.query(
            //     'INSERT INTO order_items (order_id, montre_id, quantity, price) VALUES (?, ?, ?, (SELECT prix * (1 - reduction/100) FROM montre WHERE montre_id = ?))',
            //     [orderId, item.montre_id, item.quantity, item.montre_id]
            // );
        }
        
        // Clear the user's cart
        await connection.query(
            'DELETE FROM panier WHERE user_id = ?',
            [userId]
        );
        
        // Commit the transaction
        await connection.commit();
        
        res.status(200).json({
            message: "Commande traitée avec succès",
            // orderId: orderId
        });
        
    } catch (error) {
        // Rollback in case of error
        await connection.rollback();
        console.error('Checkout error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    } finally {
        connection.release();
    }
};