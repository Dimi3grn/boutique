document.addEventListener('DOMContentLoaded', function() {
    const url = "http://localhost:3000/";
    const backendUrl = "http://localhost:3000";
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
    let colors = []; // Pour stocker les couleurs
    let currentFilters = {
        categories: [],
        colors: [], // Ajout du tableau pour les couleurs sélectionnées
        maxPrice: 5000,
        promo: false,
        search: '',
        sort: 'name-asc'
    };
    
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
        document.querySelectorAll('#color-filters .color-swatch.selected').forEach(swatch => {
            currentFilters.colors.push(parseInt(swatch.dataset.colorId));
        });
        
        currentFilters.promo = promoFilter.checked;
        currentFilters.maxPrice = parseInt(priceFilter.value);
        
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
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.watches) {
                allWatches = data.watches;
                filterAndDisplayWatchesLocally();
            }
            
            // Récupérer les catégories
            return fetch(`${url}api/categories`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.categories) {
                categories = data.categories;
                displayCategoryFilters();
            }
            
            // Récupérer les couleurs
            return fetch(`${url}api/colors`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
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
                    <p>Une erreur est survenue lors du chargement des produits: ${error.message}</p>
                </div>
            `;
        });
    }
    
    // Afficher les catégories dans les filtres
    function displayCategoryFilters() {
        if (!categoryFiltersContainer) return;
        
        let html = '';
        
        categories.forEach(category => {
            const categoryId = category.categories_id;
            const categoryName = category.name || category.nom || 'Catégorie sans nom';
            
            html += `
                <label class="checkbox-container">
                    <input type="checkbox" value="${categoryId}">
                    <span class="checkmark"></span>
                    ${categoryName}
                </label>
            `;
        });
        
        categoryFiltersContainer.innerHTML = html;
    }
    
    // Afficher les couleurs dans les filtres
    function displayColorFilters() {
        if (!colorFiltersContainer) return;
        
        let html = '';
        
        colors.forEach(color => {
            const colorId = color.color_id;
            const colorName = color.name || color.nom || 'Couleur';
            const colorCode = color.hex_code || color.code || '#CCCCCC';
            
            html += `
                <div class="color-filter-container">
                    <div class="color-swatch" 
                        data-color-id="${colorId}" 
                        style="background-color: ${colorCode};"
                        onclick="toggleColorFilter(this)">
                    </div>
                    <span class="color-name">${colorName}</span>
                </div>
            `;
        });
        
        colorFiltersContainer.innerHTML = html;
    }
    
    // Fonction pour activer/désactiver un filtre de couleur
    window.toggleColorFilter = function(element) {
        element.classList.toggle('selected');
    };
    
    // Filtrer et afficher les montres (filtrage côté client)
    function filterAndDisplayWatchesLocally() {
        // Afficher un message de chargement
        productsContainer.innerHTML = '<p class="loading-message">Chargement des produits...</p>';
        
        // Filtrer les montres
        let filteredWatches = [...allWatches];
        
        // Filtre par prix
        filteredWatches = filteredWatches.filter(watch => 
            parseFloat(watch.prix) <= currentFilters.maxPrice
        );
        
        // Filtre par promotion
        if (currentFilters.promo) {
            filteredWatches = filteredWatches.filter(watch => 
                parseFloat(watch.reduction) > 0
            );
        }
        
        // Filtre par recherche
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            filteredWatches = filteredWatches.filter(watch => 
                (watch.nom && watch.nom.toLowerCase().includes(searchTerm)) || 
                (watch.marque && watch.marque.toLowerCase().includes(searchTerm))
            );
        }
        
        // Tri
        switch (currentFilters.sort) {
            case 'name-asc':
                filteredWatches.sort((a, b) => (a.nom || '').localeCompare(b.nom || ''));
                break;
            case 'name-desc':
                filteredWatches.sort((a, b) => (b.nom || '').localeCompare(a.nom || ''));
                break;
            case 'price-asc':
                filteredWatches.sort((a, b) => parseFloat(a.prix) - parseFloat(b.prix));
                break;
            case 'price-desc':
                filteredWatches.sort((a, b) => parseFloat(b.prix) - parseFloat(a.prix));
                break;
        }
        
        // Afficher les montres
        displayWatches(filteredWatches);
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
            const reduction = parseFloat(watch.reduction) || 0;
            const prix = parseFloat(watch.prix) || 0;
            const displayPrice = reduction > 0 ? prix * (1 - reduction/100) : prix;
            const devise = watch.devise || '€';
            
            // Formatter le chemin de l'image
            const imagePath = getFullImagePath(watch.image1);
            const imageHoverPath = watch.image2 ? getFullImagePath(watch.image2) : imagePath;
            
            html += `
                <div class="product-card" onclick="window.location.href='product.html?id=${watch.montre_id}'">
                    <div class="product-image">
                        <img src="${imagePath}" alt="${watch.nom || 'Montre'}" class="main-img">
                        <img src="${imageHoverPath}" alt="${watch.nom || 'Montre'}" class="hover-img">
                        ${reduction > 0 ? `<div class="product-tag">-${reduction}%</div>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${watch.nom || 'Montre sans nom'}</h3>
                        <div class="product-price">
                            ${reduction > 0 
                                ? `<span class="original-price">${prix.toFixed(2)} ${devise}</span>
                                   <span class="discount-price">${displayPrice.toFixed(2)} ${devise}</span>`
                                : `<span class="discount-price">${prix.toFixed(2)} ${devise}</span>`
                            }
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsContainer.innerHTML = html;
    }
    
    // Au lieu de fetch, utiliser directement la fonction de filtrage local
    function filterAndDisplayWatches() {
        filterAndDisplayWatchesLocally();
    }
});