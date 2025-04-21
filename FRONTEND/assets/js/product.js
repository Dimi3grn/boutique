document.addEventListener('DOMContentLoaded', function() {
    const url = "http://localhost:3000/";
    const backendUrl = "http://localhost:3000";
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 1; // Default to first product if no ID provided
    
    // Fetch watch data
    fetch(`${url}api/watches/${productId}`)
    .then(response => response.json())
    .then(data => {
        if (data.message === "Watch found") {
            displayWatchDetails(data.watch);
            
            // Check if this watch is in user's favorites
            const favoriteBtn = document.querySelector('.favorite-btn');
            if (favoriteBtn && typeof window.checkIsFavorite === 'function') {
                window.checkIsFavorite(productId, favoriteBtn);
            }
            
            // Fetch categories
            return fetch(`${url}api/watches/${productId}/categories`);
        } else {
            throw new Error("Watch not found");
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.categories) {
            displayCategories(data.categories);
        }
        
        // Fetch colors
        return fetch(`${url}api/watches/${productId}/colors`);
    })
    .then(response => response.json())
    .then(data => {
        if (data.colors) {
            displayColors(data.colors);
        }
        
        // Fetch materials
        return fetch(`${url}api/watches/${productId}/materials`);
    })
    .then(response => response.json())
    .then(data => {
        if (data.materials) {
            displayMaterials(data.materials);
        }
    })
    .catch(error => {
        console.error('Error loading product:', error);
        document.querySelector('#product-container').innerHTML = `
            <div class="error-message">
                <h2>Produit non trouvé</h2>
                <p>Désolé, nous n'avons pas pu trouver le produit que vous recherchez.</p>
                <a href="catalogue.html">Parcourir notre collection</a>
            </div>
        `;
    });

    // Function to display watch details
    function displayWatchDetails(watch) {
        const container = document.querySelector('#product-container');
        
        // Function to get full image path
        const getFullImagePath = (imagePath) => {
            if (!imagePath) return '../assets/img/watch-placeholder.jpg';
            if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
                return imagePath;
            }
            if (imagePath.startsWith('/')) {
                return backendUrl + imagePath;
            }
            return backendUrl + '/' + imagePath;
        };
        
        const image1Full = getFullImagePath(watch.image1);
        const image2Full = getFullImagePath(watch.image2);
        
        // Create HTML structure for product details
        const productHTML = `
            <div class="product-images">
                <div class="main-image">
                    <img id="main-product-image" src="${image1Full}" alt="${watch.nom}">
                </div>
                <div class="thumbnail-images" id="thumbnail-container">
                    ${image1Full ? `<div class="thumbnail active"><img src="${image1Full}" alt="Thumbnail 1" onclick="changeMainImage('${image1Full}', this)"></div>` : ''}
                    ${image2Full ? `<div class="thumbnail"><img src="${image2Full}" alt="Thumbnail 2" onclick="changeMainImage('${image2Full}', this)"></div>` : ''}
                </div>
            </div>

            <div class="product-details">
                <div class="product-header">
                    <h1>${watch.nom}</h1>
                    <div class="favorite-btn" onclick="toggleFavorite(${watch.montre_id}, this)" title="Add to favorites">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                </div>
                <h2>${watch.marque}</h2>
                <div class="product-price">
                    ${watch.reduction > 0 
                        ? `<span><s>${watch.prix} ${watch.devise}</s> ${(watch.prix * (1 - watch.reduction/100)).toFixed(2)} ${watch.devise}</span>
                           <span class="reduction">-${watch.reduction}%</span>`
                        : `<span>${watch.prix} ${watch.devise}</span>`
                    }
                </div>
                
                <div class="product-description">
                    <p>${watch.description}</p>
                </div>

                <div class="product-attributes">
                    <div class="categories">
                        <h3>Catégories:</h3>
                        <ul id="categories-list"></ul>
                    </div>
                    
                    <div class="colors">
                        <h3>Couleurs disponibles:</h3>
                        <div id="colors-list" class="color-options"></div>
                    </div>
                    
                    <div class="materials">
                        <h3>Matériaux:</h3>
                        <ul id="materials-list"></ul>
                    </div>
                </div>

                <div class="product-actions">
                    <div class="quantity-selector">
                        <button onclick="decreaseQuantity()">-</button>
                        <input type="number" id="quantity" value="1" min="1" max="${watch.stock || 10}">
                        <button onclick="increaseQuantity()">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${watch.montre_id})">Ajouter au panier</button>
                </div>
            </div>
        `;
        
        container.innerHTML = productHTML;
    }

    // Function to display categories
    function displayCategories(categories) {
        const categoriesList = document.getElementById('categories-list');
        if (!categoriesList) return;
        
        categoriesList.innerHTML = ''; // Clear any existing content
        
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category.name || category.nom;
            categoriesList.appendChild(li);
        });
    }

    // Function to display colors
    function displayColors(colors) {
        const colorsList = document.getElementById('colors-list');
        if (!colorsList) return;
        
        colorsList.innerHTML = ''; // Clear any existing content
        
        // Check if colors is valid
        if (!Array.isArray(colors) || colors.length === 0) {
            const colorsSection = document.querySelector('.colors');
            if (colorsSection) {
                colorsSection.style.display = 'none';
            }
            return;
        }
        
        colors.forEach((color, index) => {
            // Get properties with different possible names
            const colorCode = color.hex_code || color.code || '#CCCCCC';
            const colorName = color.name || color.nom || 'Couleur';
            const colorId = color.color_id || color.id || index;
            
            const colorOption = document.createElement('div');
            colorOption.className = `color-option ${index === 0 ? 'active' : ''}`;
            colorOption.style.backgroundColor = colorCode;
            colorOption.setAttribute('title', colorName);
            colorOption.setAttribute('data-color-id', colorId);
            
            colorOption.addEventListener('click', function() {
                document.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                colorOption.classList.add('active');
            });
            
            colorsList.appendChild(colorOption);
        });
    }

    // Function to display materials
    function displayMaterials(materials) {
        const materialsList = document.getElementById('materials-list');
        if (!materialsList) return;
        
        materialsList.innerHTML = ''; // Clear any existing content
        
        if (!Array.isArray(materials) || materials.length === 0) {
            const materialsSection = document.querySelector('.materials');
            if (materialsSection) {
                materialsSection.style.display = 'none';
            }
            return;
        }
        
        materials.forEach(material => {
            const li = document.createElement('li');
            li.textContent = material.name || material.nom;
            materialsList.appendChild(li);
        });
    }
});

// Global helper functions
function changeMainImage(src, thumbnailElement) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = src;
    }
    
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    
    if (thumbnailElement && thumbnailElement.parentElement) {
        thumbnailElement.parentElement.classList.add('active');
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;
    
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;
    
    const currentValue = parseInt(quantityInput.value);
    const maxValue = parseInt(quantityInput.getAttribute('max') || 10);
    if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
    }
}

function addToCart(productId) {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;
    
    const quantity = parseInt(quantityInput.value);
    const colorElement = document.querySelector('.color-option.active');
    const colorId = colorElement ? colorElement.getAttribute('data-color-id') : null;
    
    const cartItem = {
        productId,
        quantity,
        colorId
    };
    
    console.log('Adding to cart:', cartItem);
    showMessage('success', 'Produit ajouté au panier !');
}

// Message toast function (if not already defined by favorites.js)
function showMessage(type, message) {
    let messageElement = document.querySelector('.message-toast');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'message-toast';
        document.body.appendChild(messageElement);
    }
    
    messageElement.textContent = message;
    messageElement.className = `message-toast ${type}`;
    messageElement.classList.add('visible');
    
    setTimeout(() => {
        messageElement.classList.remove('visible');
    }, 3000);
}