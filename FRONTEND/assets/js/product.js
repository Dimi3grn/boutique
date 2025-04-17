// Get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const url = "http://localhost:3000/";

// Function to fetch and display product details
async function loadProductDetails() {
    if (!productId) {
        document.getElementById('product-container').innerHTML = '<p>Product not found</p>';
        return;
    }
    
    try {
        const response = await fetch(`${url}api/sneakers/${productId}`);
        const data = await response.json();
        
        if (data.message === "Sneaker not found") {
            document.getElementById('product-container').innerHTML = '<p>Product not found</p>';
            return;
        }
        
        const product = data.sneaker;
        
        // Display product details
        const productHTML = `
            <div class="product-images">
                ${product.img_1 ? `<img src="${product.img_1}" alt="${product.name}" class="main-image">` : ''}
                <div class="thumbnail-images">
                    ${product.img_2 ? `<img src="${product.img_2}" alt="${product.name}" class="thumbnail">` : ''}
                    ${product.img_3 ? `<img src="${product.img_3}" alt="${product.name}" class="thumbnail">` : ''}
                </div>
            </div>
            <div class="product-info">
                <h1>${product.name}</h1>
                <p class="price">${product.price}€ ${product.reduction > 0 ? `<span class="discount">-${product.reduction}%</span>` : ''}</p>
                <p class="colors">Colors: ${product.colors}</p>
                <p class="delivery">Delivery in ${product.delivery_time} days ${product.delivery_price === 0 ? '(Free shipping)' : `(${product.delivery_price}€)`}</p>
                <div class="sizes">
                    <p>Available sizes:</p>
                    <div class="size-options">
                        ${product.sizes.split(';').map(size => `<button class="size-button">${size}</button>`).join('')}
                    </div>
                </div>
                <button class="add-to-cart-button" ${!product.available ? 'disabled' : ''}>
                    ${product.available ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        `;
        
        document.getElementById('product-container').innerHTML = productHTML;
        
    } catch (error) {
        console.error('Error fetching product:', error);
        document.getElementById('product-container').innerHTML = '<p>Error loading product details</p>';
    }
}

// Load product details when page loads
document.addEventListener('DOMContentLoaded', loadProductDetails);