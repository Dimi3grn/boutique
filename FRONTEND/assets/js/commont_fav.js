document.addEventListener('DOMContentLoaded', function() {
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
});