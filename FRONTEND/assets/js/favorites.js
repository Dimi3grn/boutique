document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = "http://localhost:3000/";
    const backendUrl = "http://localhost:3000";
    const heartIcon = document.querySelector('.heart');
    
    // Set up event listener for heart icon in the header
    if (heartIcon) {
        heartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                // User is logged in, navigate to favorites page
                window.location.href = 'favorites.html';
            } else {
                // Not logged in, redirect to login with a return URL
                window.location.href = 'login.html?returnTo=favorites.html';
            }
        });
    }
    
    // Function to toggle favorite status (global function available to other scripts)
    window.toggleFavorite = function(watchId, heartElement) {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');
        
        if (!user || !token) {
            // Not logged in, redirect to login
            window.location.href = `login.html?returnTo=product.html?id=${watchId}`;
            return;
        }
        
        // Check if currently a favorite (based on element class)
        const isFavorite = heartElement.classList.contains('favorited');
        
        if (isFavorite) {
            // Remove from favorites
            removeFromFavorites(watchId, heartElement);
        } else {
            // Add to favorites
            addToFavorites(watchId, heartElement);
        }
    };
    
    // Expose checkIsFavorite to the global scope for other scripts
    window.checkIsFavorite = function(watchId, heartElement) {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');
        
        if (!user || !token) {
            return; // Not logged in, don't check
        }
        
        fetch(`${baseUrl}api/favorites/check/${watchId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Session expired, clear local storage
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    // Don't redirect here to avoid loop - just show as not favorited
                    return { isFavorite: false };
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.isFavorite) {
                heartElement.classList.add('favorited');
                heartElement.setAttribute('title', 'Retirer des favoris');
            } else {
                heartElement.classList.remove('favorited');
                heartElement.setAttribute('title', 'Ajouter aux favoris');
            }
        })
        .catch(error => {
            console.error('Error checking favorite status:', error);
            // Just make it not favorited in case of any error
            heartElement.classList.remove('favorited');
            heartElement.setAttribute('title', 'Ajouter aux favoris');
        });
    };
    
    // Add to favorites
    function addToFavorites(watchId, heartElement) {
        const token = localStorage.getItem('authToken');
        
        fetch(`${baseUrl}api/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ watchId })
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
            if (data && data.message === "Watch added to favorites") {
                // Update the UI
                heartElement.classList.add('favorited');
                heartElement.setAttribute('title', 'Retirer des favoris');
                
                // Show confirmation
                showMessage('success', 'Ajouté aux favoris !');
            } else {
                throw new Error(data.message || 'Échec de l\'ajout aux favoris');
            }
        })
        .catch(error => {
            console.error('Error adding to favorites:', error);
            if (!error.message.includes('Session expirée')) {
                showMessage('error', 'Impossible d\'ajouter aux favoris');
            }
        });
    }
    
    // Remove from favorites
    function removeFromFavorites(watchId, heartElement) {
        const token = localStorage.getItem('authToken');
        
        fetch(`${baseUrl}api/favorites/${watchId}`, {
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
                        window.location.href = `login.html?returnTo=product.html?id=${watchId}`;
                    }, 2000);
                    throw new Error('Session expirée');
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.message === "Watch removed from favorites") {
                // Update the UI
                heartElement.classList.remove('favorited');
                heartElement.setAttribute('title', 'Ajouter aux favoris');
                
                // Show confirmation
                showMessage('success', 'Retiré des favoris');
                
                // If on favorites page, remove the item
                if (window.location.pathname.includes('favorites.html')) {
                    const productCard = heartElement.closest('.product-card');
                    if (productCard) {
                        productCard.remove();
                        
                        // Check if there are no more favorites
                        const remainingCards = document.querySelectorAll('.product-card');
                        if (remainingCards.length === 0) {
                            const favoritesContainer = document.getElementById('favorites-container');
                            if (favoritesContainer) {
                                favoritesContainer.innerHTML = `
                                    <div class="no-favorites">
                                        <p>Vous n'avez pas encore de favoris. Explorez notre catalogue pour en ajouter !</p>
                                        <a href="catalogue.html" class="browse-button">Parcourir les montres</a>
                                    </div>
                                `;
                            }
                        }
                    }
                }
            } else {
                throw new Error(data.message || 'Échec de la suppression des favoris');
            }
        })
        .catch(error => {
            console.error('Error removing from favorites:', error);
            if (!error.message.includes('Session expirée')) {
                showMessage('error', 'Impossible de retirer des favoris');
            }
        });
    }
    
    // Function to load favorites on the favorites page
    window.loadFavorites = function() {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');
        
        if (!user || !token) {
            // Redirect to login if not logged in
            window.location.href = 'login.html?returnTo=favorites.html';
            return;
        }
        
        const favoritesContainer = document.getElementById('favorites-container');
        
        if (!favoritesContainer) {
            return; // Not on the favorites page
        }
        
        // Show loading indicator
        favoritesContainer.innerHTML = '<p class="loading-message">Chargement de vos favoris...</p>';
        
        fetch(`${baseUrl}api/favorites`, {
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
                        window.location.href = 'login.html?returnTo=favorites.html';
                    }, 2000);
                    throw new Error('Session expirée');
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.favorites && data.favorites.length > 0) {
                displayFavorites(data.favorites);
            } else {
                // No favorites found
                favoritesContainer.innerHTML = `
                    <div class="no-favorites">
                        <p>Vous n'avez pas encore de favoris. Explorez notre catalogue pour en ajouter !</p>
                        <a href="catalogue.html" class="browse-button">Parcourir les montres</a>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading favorites:', error);
            if (!error.message.includes('Session expirée')) {
                favoritesContainer.innerHTML = '<p class="error-message">Impossible de charger vos favoris. Veuillez réessayer plus tard.</p>';
            }
        });
    };
    
    // Display favorites on the favorites page
    function displayFavorites(favorites) {
        const favoritesContainer = document.getElementById('favorites-container');
        if (!favoritesContainer) return;
        
        let html = '';
        
        favorites.forEach(watch => {
            // Calculate price after reduction
            const displayPrice = watch.reduction > 0 
                ? watch.prix * (1 - watch.reduction/100) 
                : watch.prix;
            
            // Format image path
            const imagePath = getFullImagePath(watch.image1);
            
            html += `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${imagePath}" alt="${watch.nom}" onclick="window.location.href='product.html?id=${watch.montre_id}'">
                        ${watch.reduction > 0 ? `<div class="product-tag">-${watch.reduction}%</div>` : ''}
                        <div class="favorite-btn favorited" onclick="toggleFavorite(${watch.montre_id}, this)" title="Retirer des favoris">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="product-info" onclick="window.location.href='product.html?id=${watch.montre_id}'">
                        <h3 class="product-name">${watch.nom}</h3>
                        <div class="product-price">
                            ${watch.reduction > 0 
                                ? `<span class="original-price">${watch.prix} ${watch.devise}</span>
                                   <span class="discount-price">${displayPrice.toFixed(2)} ${watch.devise}</span>`
                                : `<span class="discount-price">${watch.prix} ${watch.devise}</span>`
                            }
                        </div>
                    </div>
                </div>
            `;
        });
        
        favoritesContainer.innerHTML = html;
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
    
    // If we're on the favorites page, load favorites
    if (window.location.pathname.includes('favorites.html')) {
        loadFavorites();
    }
});