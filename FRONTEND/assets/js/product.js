document.addEventListener('DOMContentLoaded', function() {
    const url = "http://localhost:3000/";
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 6; // Default to 6 (Day-Date) if no ID provided
    
    // Fetch watch data
    fetch(`${url}api/watches/${productId}`)
    .then(response => response.json())
    .then(data => {
        if (data.message === "Watch found") {
            displayWatchDetails(data.watch);
            
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
});

function displayWatchDetails(watch) {
    const container = document.querySelector('#product-container');
    
    // Create HTML structure for product details
    const productHTML = `
        <div class="product-images">
            <div class="main-image">
                <img id="main-product-image" src="${watch.image1}" alt="${watch.nom}">
            </div>
            <div class="thumbnail-images" id="thumbnail-container">
                ${watch.image1 ? `<div class="thumbnail active"><img src="${watch.image1}" alt="Thumbnail 1" onclick="changeMainImage('${watch.image1}', this)"></div>` : ''}
                ${watch.image2 ? `<div class="thumbnail"><img src="${watch.image2}" alt="Thumbnail 2" onclick="changeMainImage('${watch.image2}', this)"></div>` : ''}
            </div>
        </div>

        <div class="product-details">
            <h1>${watch.nom}</h1>
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
                    <input type="number" id="quantity" value="1" min="1" max="${watch.stock}">
                    <button onclick="increaseQuantity()">+</button>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${watch.montre_id})">Ajouter au panier</button>
            </div>
        </div>
    `;
    
    container.innerHTML = productHTML;
}

function displayCategories(categories) {
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;
    
    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category.name || category.nom;
        categoriesList.appendChild(li);
    });
}

function displayColors(colors) {
    const colorsList = document.getElementById('colors-list');
    if (!colorsList) return;
    
    // Ajout de console.log pour déboguer
    console.log("Colors data received:", colors);
    
    // Vérifiez si colors est un tableau et s'il contient des éléments
    if (!Array.isArray(colors) || colors.length === 0) {
        console.log("No colors to display or invalid format");
        document.querySelector('.colors').style.display = 'none';
        return;
    }
    
    colors.forEach((color, index) => {
        // Récupérer les noms de propriétés dynamiquement
        const colorCode = color.hex_code || color.code || color.couleur_code;
        const colorName = color.name || color.nom || color.couleur_nom;
        const colorId = color.color_id || color.id || color.couleur_id;
        
        if (!colorCode) {
            console.log("Missing color code for:", color);
            return;
        }
        
        const colorOption = document.createElement('div');
        colorOption.className = `color-option ${index === 0 ? 'active' : ''}`;
        colorOption.style.backgroundColor = colorCode;
        colorOption.setAttribute('title', colorName || 'Color');
        colorOption.setAttribute('data-color-id', colorId || index);
        
        colorOption.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            colorOption.classList.add('active');
        });
        
        colorsList.appendChild(colorOption);
    });
}

function displayMaterials(materials) {
    const materialsList = document.getElementById('materials-list');
    if (!materialsList) return;
    
    materials.forEach(material => {
        const li = document.createElement('li');
        li.textContent = material.name;
        materialsList.appendChild(li);
    });
}

// Helper functions
function changeMainImage(src, thumbnailElement) {
    document.getElementById('main-product-image').src = src;
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnailElement.parentElement.classList.add('active');
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    const maxValue = parseInt(quantityInput.getAttribute('max'));
    if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
    }
}

function addToCart(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const colorElement = document.querySelector('.color-option.active');
    const colorId = colorElement ? colorElement.getAttribute('data-color-id') : null;
    
    const cartItem = {
        productId,
        quantity,
        colorId
    };
    
    console.log('Adding to cart:', cartItem);
    alert('Product added to cart!');
    
    // Here you would typically send this data to your server or store in localStorage
}   