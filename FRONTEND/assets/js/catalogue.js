document.addEventListener('DOMContentLoaded', function() {
    const url = "http://localhost:3000/";
    const backendUrl = "http://localhost:3000"; // Défini au niveau global
    const productsContainer = document.getElementById('products-container');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    const promoFilter = document.getElementById('promo-filter');
    const sortSelect = document.getElementById('sort-select');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const searchInput = document.getElementById('search-input');
    
    let allWatches = [];
    let categories = [];
    let currentFilters = {
        categories: [],
        maxPrice: 50000,
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
            currentFilters.colors = [1];
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
                <div class="product-card" onclick="window.location.href='product.html?id=${watch.montre_id}'">
                    <div class="product-image">
                        <img src="${imagePath}" alt="${watch.nom}">
                        ${watch.reduction > 0 ? `<div class="product-tag">-${watch.reduction}%</div>` : ''}
                    </div>
                    <div class="product-info">
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
    }
});