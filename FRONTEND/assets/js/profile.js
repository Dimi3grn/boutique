document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = "http://localhost:3000/";
    
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Update profile information
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-email').textContent = user.email;
    
    // Fetch latest user data from server
    fetch(`${baseUrl}api/auth/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Important for cookies
    })
    .then(response => {
        if (!response.ok) {
            // If unauthorized, redirect to login
            if (response.status === 401) {
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                return null;
            }
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.user) {
            // Update profile with latest data
            document.getElementById('profile-username').textContent = data.user.username;
            document.getElementById('profile-email').textContent = data.user.email;
            
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
        }
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
        showError("Impossible de charger les données du profil. Veuillez réessayer plus tard.");
    });
    
    // Function to show error message
    function showError(message) {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            
            // Hide after 5 seconds
            setTimeout(() => {
                errorElement.classList.remove('show');
            }, 5000);
        }
    }
    
    // Function to show success message
    function showSuccess(message) {
        const successElement = document.getElementById('success-message');
        if (successElement) {
            successElement.textContent = message;
            successElement.classList.add('show');
            
            // Hide after 5 seconds
            setTimeout(() => {
                successElement.classList.remove('show');
            }, 5000);
        }
    }
});