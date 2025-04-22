document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = "http://localhost:3000/";
    const backendUrl = "http://localhost:3000";
    const cartIcon = document.querySelector('.cart');
    
    // Set up event listener for cart icon in the header
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                // User is logged in, navigate to cart page
                window.location.href = 'cart.html';
            } else {
                // Not logged in, redirect to login with a return URL
                window.location.href = 'login.html?returnTo=cart.html';
            }
        });
    }
    
    // Initialize cart count indicator
    updateCartCountIndicator();
    
    // Function to toggle cart item (global function available to other scripts)
    window.addToCart = function(watchId, quantity = 1) {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');
        
        if (!user || !token) {
            // Not logged in, redirect to login
            window.location.href = `login.html?returnTo=product.html?id=${watchId}`;
            return;
        }
        
        // Add to cart
        addToCartRequest(watchId, quantity);
    };
    
    // Function to add item to cart
    function addToCartRequest(watchId, quantity) {
        const token = localStorage.getItem('authToken');
        
        fetch(`${baseUrl}api/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ watchId, quantity })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Session expired, clear local storage and redirect
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    showMessage('error', 'Session expirée, veuillez vous reconnecter');
                    setTimeout(() => {
                        window.location.href = `login.html?returnTo=product.html?id=${watchId}`;
                    }, 2000);
                    throw new Error('Session expirée');
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                // Update the cart count indicator
                updateCartCountIndicator();
                
                // Show confirmation
                showMessage('success', 'Produit ajouté au panier !');
            } else {
                throw new Error(data.message || 'Échec de l\'ajout au panier');
            }
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            if (!error.message.includes('Session expirée')) {
                showMessage('error', 'Impossible d\'ajouter au panier');
            }
        });
    }
    
    // Update cart item quantity
    window.updateCartQuantity = function(watchId, quantity, element) {
        const token = localStorage.getItem('authToken');
        
        fetch(`${baseUrl}api/cart/${watchId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Session expired, clear local storage and redirect
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    showMessage('error', 'Session expirée, veuillez vous reconnecter');
                    setTimeout(() => {
                        window.location.href = 'login.html?returnTo=cart.html';
                    }, 2000);
                    throw new Error('Session expirée');
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                // If on cart page, update the UI
                if (window.location.pathname.includes('cart.html')) {
                    updateCartItem(watchId, quantity);
                }
                
                // Show confirmation
                showMessage('success', 'Quantité mise à jour');
            } else {
                throw new Error(data.message || 'Échec de la mise à jour du panier');
            }
        })
        .catch(error => {
            console.error('Error updating cart:', error);
            if (!error.message.includes('Session expirée')) {
                showMessage('error', 'Impossible de mettre à jour le panier');
            }
        });
    };
    
    // Remove from cart
    window.removeFromCart = function(watchId) {
        const token = localStorage.getItem('authToken');
        
        fetch(`${baseUrl}api/cart/${watchId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Session expired, clear local storage and redirect
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    showMessage('error', 'Session expirée, veuillez vous reconnecter');
                    setTimeout(() => {
                        window.location.href = 'login.html?returnTo=cart.html';
                    }, 2000);
                    throw new Error('Session expirée');
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === "Watch removed from cart") {
                // Update the cart count indicator
                updateCartCountIndicator();
                
                // If on cart page, remove the item
                if (window.location.pathname.includes('cart.html')) {
                    removeCartItem(watchId);
                }
                
                // Show confirmation
                showMessage('success', 'Produit retiré du panier');
            } else {
                throw new Error(data.message || 'Échec de la suppression du panier');
            }
        })
        .catch(error => {
            console.error('Error removing from cart:', error);
            if (!error.message.includes('Session expirée')) {
                showMessage('error', 'Impossible de retirer du panier');
            }
        });
    };
    
    // Clear entire cart
    window.clearCart = function() {
        const token = localStorage.getItem('authToken');
        
        fetch(`${baseUrl}api/cart/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Session expired, clear local storage and redirect
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    showMessage('error', 'Session expirée, veuillez vous reconnecter');
                    setTimeout(() => {
                        window.location.href = 'login.html?returnTo=cart.html';
                    }, 2000);
                    throw new Error('Session expirée');
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === "Cart cleared successfully") {
                // Update the cart count indicator
                updateCartCountIndicator();
                
                // If on cart page, reload the page to show empty cart
                if (window.location.pathname.includes('cart.html')) {
                    loadCart(); // Reload cart display
                }
                
                // Show confirmation
                showMessage('success', 'Panier vidé avec succès');
            } else {
                throw new Error(data.message || 'Échec de la suppression du panier');
            }
        })
        .catch(error => {
            console.error('Error clearing cart:', error);
            if (!error.message.includes('Session expirée')) {
                showMessage('error', 'Impossible de vider le panier');
            }
        });
    };
    
    // Function to load cart on the cart page
    window.loadCart = function() {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');
        
        if (!user || !token) {
            // Redirect to login if not logged in
            window.location.href = 'login.html?returnTo=cart.html';
            return;
        }
        
        const cartContainer = document.getElementById('cart-container');
        
        if (!cartContainer) {
            return; // Not on the cart page
        }
        
        // Show loading indicator
        cartContainer.innerHTML = '<p class="loading-message">Chargement de votre panier...</p>';
        
        fetch(`${baseUrl}api/cart`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Session expired, clear local storage and redirect
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    showMessage('error', 'Session expirée, veuillez vous reconnecter');
                    setTimeout(() => {
                        window.location.href = 'login.html?returnTo=cart.html';
                    }, 2000);
                    throw new Error('Session expirée');
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.cartItems && data.cartItems.length > 0) {
                displayCart(data.cartItems, data.totalPrice);
            } else {
                // No items in cart
                cartContainer.innerHTML = `
                    <div class="empty-cart">
                        <p>Votre panier est vide. Parcourez notre catalogue pour ajouter des produits !</p>
                        <a href="catalogue.html" class="browse-button">Parcourir les montres</a>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading cart:', error);
            if (!error.message.includes('Session expirée')) {
                cartContainer.innerHTML = '<p class="error-message">Impossible de charger votre panier. Veuillez réessayer plus tard.</p>';
            }
        });
    };
    
    // Display cart on the cart page
    function displayCart(cartItems, totalPrice) {
        const cartContainer = document.getElementById('cart-container');
        if (!cartContainer) return;
        
        let html = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Prix</th>
                        <th>Quantité</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        cartItems.forEach(item => {
            // Calculate price after reduction
            const displayPrice = item.reduction > 0 
                ? item.prix * (1 - item.reduction/100) 
                : item.prix;
                
            // Calculate item total price
            const totalItemPrice = displayPrice * item.quantity;
            
            // Format image path
            const imagePath = getFullImagePath(item.image1);
            
            html += `
                <tr data-product-id="${item.montre_id}">
                    <td>
                        <div style="display: flex; align-items: center;">
                            <div class="cart-product-image">
                                <img src="${imagePath}" alt="${item.nom}">
                            </div>
                            <div class="cart-product-info">
                                <h3>${item.nom}</h3>
                                <p>${item.marque}</p>
                            </div>
                        </div>
                    </td>
                    <td class="cart-price">
                        ${item.reduction > 0 
                            ? `<span class="original-price">${item.prix} ${item.devise}</span>${displayPrice.toFixed(2)} ${item.devise}` 
                            : `${item.prix} ${item.devise}`
                        }
                    </td>
                    <td>
                        <div class="cart-quantity">
                            <button onclick="decrementQuantity(${item.montre_id})">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="${item.stock || 10}" 
                                   onchange="updateCartQuantity(${item.montre_id}, this.value)">
                            <button onclick="incrementQuantity(${item.montre_id})">+</button>
                        </div>
                    </td>
                    <td class="cart-price">
                        ${totalItemPrice.toFixed(2)} ${item.devise}
                    </td>
                    <td class="cart-actions">
                        <button onclick="removeFromCart(${item.montre_id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
            
            <div class="cart-summary">
                <h3>Résumé de la commande</h3>
                <div class="summary-row">
                    <span>Sous-total:</span>
                    <span>${totalPrice.toFixed(2)} €</span>
                </div>
                <div class="summary-row">
                    <span>Frais de livraison:</span>
                    <span>Gratuit</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)} €</span>
                </div>
            </div>
            
            <div class="cart-buttons">
                <a href="catalogue.html" class="continue-shopping">Continuer mes achats</a>
                <button class="checkout-button" onclick="processCheckout()">Procéder au paiement</button>
                <button class="continue-shopping" onclick="clearCart()">Vider le panier</button>
            </div>
        `;
        
        cartContainer.innerHTML = html;
    }
    
    // Function to get full image path
    function getFullImagePath(imagePath) {
        if (!imagePath) return '../assets/img/watch-placeholder.jpg'; // Default image
        if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
            return imagePath;
        }
        if (imagePath.startsWith('/')) {
            return backendUrl + imagePath;
        }
        return backendUrl + '/' + imagePath;
    }
    
    // Helper function to update a cart item quantity on the UI
    function updateCartItem(watchId, quantity) {
        const row = document.querySelector(`tr[data-product-id="${watchId}"]`);
        if (!row) return;
        
        // Update quantity input
        const quantityInput = row.querySelector('.cart-quantity input');
        if (quantityInput) {
            quantityInput.value = quantity;
        }
        
        // Update price total
        const priceCell = row.querySelector('td:nth-child(2)');
        const totalCell = row.querySelector('td:nth-child(4)');
        
        if (priceCell && totalCell) {
            // Parse the price (handle both regular and discount cases)
            let price;
            const priceText = priceCell.textContent.trim();
            
            if (priceText.includes('€')) {
                // If there's a discount, get the actual price (second number)
                const matches = priceText.match(/(\d+\.\d+|\d+)\s*€/g);
                if (matches && matches.length > 0) {
                    // Get the last price in case there's a discount
                    const lastPrice = matches[matches.length - 1];
                    price = parseFloat(lastPrice.replace('€', '').trim());
                }
            }
            
            if (price) {
                // Update total cell
                const totalPrice = price * quantity;
                const currency = priceText.includes('€') ? '€' : '';
                totalCell.textContent = `${totalPrice.toFixed(2)} ${currency}`;
                
                // Update summary
                updateCartSummary();
            }
        }
    }
    
    // Helper function to remove a cart item from the UI
    function removeCartItem(watchId) {
        const row = document.querySelector(`tr[data-product-id="${watchId}"]`);
        if (!row) return;
        
        // Remove with fade out animation
        row.style.transition = 'opacity 0.3s ease';
        row.style.opacity = '0';
        
        setTimeout(() => {
            row.remove();
            
            // Check if there are any items left
            const remainingRows = document.querySelectorAll('.cart-table tbody tr');
            if (remainingRows.length === 0) {
                // No items left, display empty cart message
                const cartContainer = document.getElementById('cart-container');
                if (cartContainer) {
                    cartContainer.innerHTML = `
                        <div class="empty-cart">
                            <p>Votre panier est vide. Parcourez notre catalogue pour ajouter des produits !</p>
                            <a href="catalogue.html" class="browse-button">Parcourir les montres</a>
                        </div>
                    `;
                }
            } else {
                // Update summary
                updateCartSummary();
            }
        }, 300);
    }
    
    // Function to update the cart summary totals
    function updateCartSummary() {
        const rows = document.querySelectorAll('.cart-table tbody tr');
        let total = 0;
        
        rows.forEach(row => {
            const totalCell = row.querySelector('td:nth-child(4)');
            if (totalCell) {
                const totalText = totalCell.textContent.trim();
                const totalMatch = totalText.match(/(\d+\.\d+|\d+)/);
                if (totalMatch) {
                    total += parseFloat(totalMatch[0]);
                }
            }
        });
        
        // Update summary rows
        const summaryTotal = document.querySelector('.summary-row.total span:last-child');
        const summarySubtotal = document.querySelector('.summary-row:first-child span:last-child');
        
        if (summaryTotal) {
            summaryTotal.textContent = `${total.toFixed(2)} €`;
        }
        
        if (summarySubtotal) {
            summarySubtotal.textContent = `${total.toFixed(2)} €`;
        }
    }
    
    // Function to update cart count indicator
    function updateCartCountIndicator() {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');
        
        if (!user || !token) return;
        
        fetch(`${baseUrl}api/cart/count`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.count !== undefined) {
                displayCartCount(data.count);
            }
        })
        .catch(error => {
            console.error('Error getting cart count:', error);
        });
    }
    
    // Display cart count on the cart icon
    function displayCartCount(count) {
        const cartDiv = document.querySelector('.cart');
        if (!cartDiv) return;
        
        // Remove existing count element if it exists
        const existingCount = cartDiv.querySelector('.cart-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        // Only add indicator if count is greater than 0
        if (count > 0) {
            const countElement = document.createElement('div');
            countElement.className = 'cart-count';
            countElement.textContent = count > 99 ? '99+' : count;
            
            // Make sure the cart div is relatively positioned
            cartDiv.style.position = 'relative';
            cartDiv.appendChild(countElement);
        }
    }
    
    // Functions for quantity adjustment buttons
    window.incrementQuantity = function(watchId) {
        const row = document.querySelector(`tr[data-product-id="${watchId}"]`);
        if (!row) return;
        
        const input = row.querySelector('.cart-quantity input');
        if (input) {
            const currentValue = parseInt(input.value);
            const maxValue = parseInt(input.getAttribute('max')) || 10;
            
            if (currentValue < maxValue) {
                const newValue = currentValue + 1;
                input.value = newValue;
                updateCartQuantity(watchId, newValue);
            }
        }
    };
    
    window.decrementQuantity = function(watchId) {
        const row = document.querySelector(`tr[data-product-id="${watchId}"]`);
        if (!row) return;
        
        const input = row.querySelector('.cart-quantity input');
        if (input) {
            const currentValue = parseInt(input.value);
            
            if (currentValue > 1) {
                const newValue = currentValue - 1;
                input.value = newValue;
                updateCartQuantity(watchId, newValue);
            }
        }
    };
    
    // Process checkout function
    window.processCheckout = function() {
        // This would normally connect to a payment system
        // For this demo, just display a success message
        showMessage('success', 'Commande validée avec succès! Merci pour votre achat.');
        
        // Clear the cart after checkout
        setTimeout(() => {
            clearCart();
        }, 1500);
    };
    
    // Function to show success/error messages (global, can be used by other scripts)
    window.showMessage = function(type, message) {
        // Create message element if it doesn't exist
        let messageElement = document.querySelector('.message-toast');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'message-toast';
            document.body.appendChild(messageElement);
        }
        
        // Set message content
        messageElement.textContent = message;
        messageElement.className = `message-toast ${type}`;
        
        // Show message
        messageElement.classList.add('visible');
        
        // Hide message after delay
        setTimeout(() => {
            messageElement.classList.remove('visible');
        }, 3000);
    };
    
    // If we're on the cart page, load cart
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
});