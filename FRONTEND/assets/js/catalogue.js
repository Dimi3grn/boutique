document.addEventListener('DOMContentLoaded', function() {
    const url = "http://localhost:3000/";
    const backendUrl = "http://localhost:3000";
    const productsContainer = document.getElementById('products-container');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const colorFiltersContainer = document.getElementById('color-filters'); // Nouvel élément pour les filtres de couleurs
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    const promoFilter = document.getElementById('promo-filter');
    const sortSelect = document.getElementById('sort-select');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const searchInput = document.getElementById('search-input');
    
    let allWatches = [];
    let categories = [];
    let colors = []; // Nouvelle variable pour stocker les couleurs
    let currentFilters = {
        categories: [],
        colors: [], // Ajout de la propriété colors
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
        
        // Récupérer les couleurs cochées
        currentFilters.colors = [];
        document.querySelectorAll('#color-filters input:checked').forEach(checkbox => {
            currentFilters.colors.push(parseInt(checkbox.value));
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
        .then(response => response.json())
        .then(data => {
            if (data.watches) {
                allWatches = data.watches;
                filterAndDisplayWatches();
            }
            
            // Récupérer les catégories
            return fetch(`${url}api/categories`);
        })
        .then(response => response.json())
        .then(data => {
            if (data.categories) {
                categories = data.categories;
                displayCategoryFilters();
            }
            
            // Récupérer les couleurs
            return fetch(`${url}api/colors`);
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
            const colorCode = color.hex_code || color.code || "#CCCCCC";
            const colorName = color.name || color.nom || "Couleur";
            
            html += `
                <label class="color-filter-container">
                    <input type="checkbox" value="${color.color_id || color.id}">
                    <span class="color-swatch" style="background-color: ${colorCode};" title="${colorName}"></span>
                    <span class="color-name">${colorName}</span>
                </label>
            `;
        });
        
        colorFiltersContainer.innerHTML = html;
    }
    
    // Filtrer et afficher les montres
    function filterAndDisplayWatches() {
        // Construction des paramètres pour l'API
        const params = new URLSearchParams();
        
        if (currentFilters.categories.length > 0) {
            params.append('categories', currentFilters.categories.join(','));
        }
        
        if (currentFilters.colors.length > 0) {
            params.append('colors', currentFilters.colors.join(','));
        }
        
        params.append('maxPrice', currentFilters.maxPrice);
        
        if (currentFilters.promo) {
            params.append('promo', 'true');
        }
        
        if (currentFilters.search) {
            params.append('search', currentFilters.search);
        }
        
        params.append('sort', currentFilters.sort);
        
        // Afficher un message de chargement
        productsContainer.innerHTML = '<p class="loading-message">Chargement des produits...</p>';
        
        // Appel à l'API pour récupérer les produits filtrés
        fetch(`${url}api/watches/filter?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            if (data.watches) {
                displayWatches(data.watches);
            } else {
                productsContainer.innerHTML = `
                    <div class="no-products">
                        <p>Aucun produit ne correspond à vos critères.</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Erreur lors du filtrage des produits:', error);
            productsContainer.innerHTML = `
                <div class="no-products">
                    <p>Une erreur est survenue lors du filtrage des produits.</p>
                </div>
            `;
        });
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
            const imageHoverPath = watch.image2 ? getFullImagePath(watch.image2) : imagePath;
            
            html += `
                <div class="product-card" onclick="window.location.href='product.html?id=${watch.montre_id}'">
                    <div class="product-image">
                        <img src="${imagePath}" alt="${watch.nom}" class="main-img">
                        <img src="${imageHoverPath}" alt="${watch.nom}" class="hover-img">
                        ${watch.reduction > 0 ? `<div class="product-tag">-${watch.reduction}%</div>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${watch.nom}</h3>
                        <div class="product-price">
                            ${watch.reduction > 0 
                                ? `<span class="original-price">${watch.prix} ${watch.devise || '€'}</span>
                                   <span class="discount-price">${displayPrice.toFixed(2)} ${watch.devise || '€'}</span>`
                                : `<span class="discount-price">${watch.prix} ${watch.devise || '€'}</span>`
                            }
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsContainer.innerHTML = html;
    }
});