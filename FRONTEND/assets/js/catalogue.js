document.addEventListener('DOMContentLoaded', function() {
    const url = "http://localhost:3000/";
    const backendUrl = "http://localhost:3000"; // Défini au niveau global
    const productsContainer = document.getElementById('products-container');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const colorFiltersContainer = document.getElementById('color-filters');
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    const promoFilter = document.getElementById('promo-filter');
    const sortSelect = document.getElementById('sort-select');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const searchInput = document.getElementById('search-input');
    
    let allWatches = [];
    let categories = [];
    let colors = [];
    let currentFilters = {
        categories: [],
        colors: [],
        maxPrice: 50000,
        promo: false,
        search: '',
        sort: 'name-asc'
    };
    
    // Vérifier si des filtres sont passés dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    const filterFromUrl = urlParams.get('filter');
    
    // Mettre à jour l'affichage du prix
    priceFilter.addEventListener('input', function() {
        priceValue.textContent = this.value + ' €';
        currentFilters.maxPrice = parseInt(this.value);
    });
    
    // Appliquer les filtres
    applyFiltersBtn.addEventListener('click', function() {
        // Récupérer les catégories cochées
        currentFilters.categories = [];
        document.querySelectorAll('#category-filters input:checked').forEach(checkbox => {
            currentFilters.categories.push(parseInt(checkbox.value));
        });
        
        // Récupérer les couleurs sélectionnées
        currentFilters.colors = [];
        document.querySelectorAll('#color-filters input:checked').forEach(checkbox => {
            currentFilters.colors.push(parseInt(checkbox.value));
        });
        
        currentFilters.promo = promoFilter.checked;
        currentFilters.maxPrice = parseInt(priceFilter.value);
        console.log(currentFilters);
        filterAndDisplayWatches();
    });
    
    // Recherche
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            currentFilters.search = this.value.trim().toLowerCase();
            filterAndDisplayWatches();
        }
    });
    
    // Tri
    sortSelect.addEventListener('change', function() {
        currentFilters.sort = this.value;
        filterAndDisplayWatches();
    });
    
    // Chargement initial des données
    fetchAllData();
    
    // Fonction pour récupérer toutes les données nécessaires
    function fetchAllData() {
        // Récupérer toutes les montres
        fetch(`${url}api/watches`)
        .then(response => response.json())
        .then(data => {
            if (data.watches) {
                allWatches = data.watches;
                
                // Récupérer les catégories
                return fetch(`${url}api/categories`);
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.categories) {
                categories = data.categories;
                displayCategoryFilters();
                
                // Appliquer les filtres de l'URL après avoir chargé les catégories
                if (categoryFromUrl) {
                    applyUrlCategoryFilter(categoryFromUrl);
                }
                
                if (filterFromUrl === 'promo') {
                    promoFilter.checked = true;
                    currentFilters.promo = true;
                }
                
                // Si des filtres URL sont appliqués, filtrer immédiatement
                if (categoryFromUrl || filterFromUrl) {
                    filterAndDisplayWatches();
                } else {
                    // Sinon, afficher normalement
                    filterAndDisplayWatches();
                }
                
                // Récupérer les couleurs
                return fetch(`${url}api/colors`);
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.colors) {
                colors = data.colors;
                displayColorFilters();
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données:', error);
            productsContainer.innerHTML = `
                <div class="no-products">
                    <p>Une erreur est survenue lors du chargement des produits.</p>
                </div>
            `;
        });
    }
    
    // Fonction pour appliquer le filtre de catégorie depuis l'URL
    function applyUrlCategoryFilter(categoryName) {
        // Correspondance entre noms dans l'URL et IDs de catégories
        const categoryMap = {
            'luxury': 4,    // ID pour Luxe
            'sport': 3,     // ID pour Sport
            'diving': 1,    // ID pour Plongée
            'dress': 2,     // ID pour Costume
            'new': 5        // ID pour Nouveautés
        };
        
        // Si la catégorie existe dans notre mapping
        if (categoryMap[categoryName]) {
            const categoryId = categoryMap[categoryName];
            
            // Trouver la checkbox correspondante et la cocher
            const checkbox = document.querySelector(`#category-filters input[value="${categoryId}"]`);
            if (checkbox) {
                checkbox.checked = true;
                currentFilters.categories.push(categoryId);
            }
        }
    }
    
    // Afficher les catégories dans les filtres
    function displayCategoryFilters() {
        let html = '';
        
        categories.forEach(category => {
            html += `
                <label class="checkbox-container">
                    <input type="checkbox" value="${category.categories_id}">
                    <span class="checkmark"></span>
                    ${category.name || category.nom}
                </label>
            `;
        });
        
        categoryFiltersContainer.innerHTML = html;
    }
    
    // Afficher les couleurs dans les filtres
    function displayColorFilters() {
        let html = '';
        
        colors.forEach(color => {
            const colorName = color.name || color.couleur_nom;
            const colorCode = color.hex_code || color.code || '#CCCCCC';
            
            html += `
                <label class="color-filter-container">
                    <input type="checkbox" value="${color.color_id}">
                    <span class="color-swatch" style="background-color: ${colorCode}"></span>
                    <span class="color-name">${colorName}</span>
                </label>
            `;
        });
        
        colorFiltersContainer.innerHTML = html;
    }
    
    // Filtrer et afficher les montres
    async function filterAndDisplayWatches() {
        // Afficher un message de chargement
        productsContainer.innerHTML = '<p class="loading-message">Chargement des produits...</p>';
        
        try {
            // Construire l'URL de l'API avec les paramètres de filtre
            const url = "http://localhost:3000/api/filter-watches";
            const params = new URLSearchParams();
            
            // Ajouter les catégories sélectionnées
            if (currentFilters.categories.length > 0) {
                params.append('categories', currentFilters.categories.join(','));
            }
            
            // Ajouter les couleurs sélectionnées
            if (currentFilters.colors.length > 0) {
                params.append('colors', currentFilters.colors.join(','));
            }

            // Ajouter les filtres de prix
            if (currentFilters.maxPrice) {
                params.append('priceMax', currentFilters.maxPrice);
            }
            
            if (currentFilters.minPrice) {
                params.append('priceMin', currentFilters.minPrice);
            }
            
            // Ajouter le filtre de promotion
            if (currentFilters.promo) {
                params.append('hasDiscount', 'true');
            }
            
            // Construire l'URL complète
            const apiUrl = `${url}?${params.toString()}`;
            
            // Appeler l'API
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            let filteredWatches = data.watches;
            
            // Le filtre de recherche est géré côté client car plus flexible
            if (currentFilters.search) {
                const searchTerm = currentFilters.search.toLowerCase();
                filteredWatches = filteredWatches.filter(watch => 
                    watch.nom.toLowerCase().includes(searchTerm) || 
                    watch.marque.toLowerCase().includes(searchTerm)
                );
            }
            
            // Tri également géré côté client
            filteredWatches = sortWatches(filteredWatches, currentFilters.sort);
            // Afficher les montres
            displayWatches(filteredWatches);
            
        } catch (error) {
            console.error('Erreur lors du filtrage des montres:', error);
            productsContainer.innerHTML = `<p class="error-message">Erreur lors du chargement des produits: ${error.message}</p>`;
        }
    }
    
    // Trier les montres
    function sortWatches(watches, sortMethod) {
        switch (sortMethod) {
            case 'name-asc':
                return watches.sort((a, b) => a.nom.localeCompare(b.nom));
            case 'name-desc':
                return watches.sort((a, b) => b.nom.localeCompare(a.nom));
            case 'price-asc':
                return watches.sort((a, b) => {
                    const priceA = a.reduction > 0 ? a.prix * (1 - a.reduction/100) : a.prix;
                    const priceB = b.reduction > 0 ? b.prix * (1 - b.reduction/100) : b.prix;
                    return priceA - priceB;
                });
            case 'price-desc':
                return watches.sort((a, b) => {
                    const priceA = a.reduction > 0 ? a.prix * (1 - a.reduction/100) : a.prix;
                    const priceB = b.reduction > 0 ? b.prix * (1 - b.reduction/100) : b.prix;
                    return priceB - priceA;
                });
            default:
                return watches;
        }
    }
    
    // Fonction pour obtenir le chemin complet des images
    function getFullImagePath(imagePath) {
        if (!imagePath) return '../assets/img/watch-placeholder.jpg'; // Image par défaut
        if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
            return imagePath;
        }
        if (imagePath.startsWith('/')) {
            return backendUrl + imagePath;
        }
        return backendUrl + '/' + imagePath;
    }
    
    // Afficher les montres
    function displayWatches(watches) {
        if (watches.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-products">
                    <p>Aucun produit ne correspond à vos critères.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        watches.forEach(watch => {
            // Calculer le prix après réduction
            const displayPrice = watch.reduction > 0 
                ? watch.prix * (1 - watch.reduction/100) 
                : watch.prix;
            
            // Formatter le chemin de l'image
            const imagePath = getFullImagePath(watch.image1);
            
            html += `
                <div class="product-card">
                    <div class="product-image" onclick="window.location.href='product.html?id=${watch.montre_id}'">
                        <img src="${imagePath}" alt="${watch.nom}" class="main-img">
                        ${watch.image2 ? `<img src="${getFullImagePath(watch.image2)}" alt="${watch.nom}" class="hover-img">` : ''}
                        ${watch.reduction > 0 ? `<div class="product-tag">-${watch.reduction}%</div>` : ''}
                    </div>
                    <div class="favorite-btn" onclick="event.stopPropagation(); toggleFavorite(${watch.montre_id}, this)" title="Ajouter aux favoris" data-product-id="${watch.montre_id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
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
        
        productsContainer.innerHTML = html;
        
        // Check favorites status for all products on the page
        checkAllFavorites();
    }
    
    // Function to check favorites status for all products
    function checkAllFavorites() {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');
        
        if (!user || !token) {
            return; // Not logged in, don't check
        }
        
        // Get all favorite buttons
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        
        favoriteButtons.forEach(button => {
            const watchId = button.getAttribute('data-product-id');
            if (watchId) {
                checkIsFavorite(watchId, button);
            }
        });
    }
    
    // Function to check if a product is in favorites
    function checkIsFavorite(watchId, heartElement) {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');
        
        if (!user || !token) {
            return; // Not logged in, don't check
        }
        
        fetch(`${url}api/favorites/check/${watchId}`, {
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
    }
});

// Global function to toggle favorite
function toggleFavorite(watchId, heartElement) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authToken');
    const url = "http://localhost:3000/";
    
    if (!user || !token) {
        // Not logged in, redirect to login
        window.location.href = `login.html?returnTo=catalogue.html`;
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
}

// Add to favorites
function addToFavorites(watchId, heartElement) {
    const token = localStorage.getItem('authToken');
    const url = "http://localhost:3000/";
    
    fetch(`${url}api/favorites`, {
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
                    window.location.href = `login.html?returnTo=catalogue.html`;
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
    const url = "http://localhost:3000/";
    
    fetch(`${url}api/favorites/${watchId}`, {
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
                    window.location.href = `login.html?returnTo=catalogue.html`;
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

// Function to show message
function showMessage(type, message) {
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
}