document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = "http://localhost:3000/";
    
    // Authentication state check
    checkAuthState();
    
    // Login form handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            loginUser(email, password);
        });
    }
    
    // Register form handling
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Client-side validation
            if (password !== confirmPassword) {
                showError("Les mots de passe ne correspondent pas.");
                return;
            }
            
            if (password.length < 6) {
                showError("Le mot de passe doit contenir au moins 6 caractères.");
                return;
            }
            
            registerUser(username, email, password);
        });
    }
    
    // Handle logout if present
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logoutUser();
        });
    }
    
    // Function to login user
    async function loginUser(email, password) {
        try {
            const response = await fetch(`${baseUrl}api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store token in localStorage
                localStorage.setItem('authToken', data.token);
                
                // Store user info in localStorage for client-side auth state
                localStorage.setItem('user', JSON.stringify({
                    id: data.user.id,
                    username: data.user.username,
                    email: data.user.email
                }));
                
                // Redirect to home page or dashboard
                const returnTo = getReturnUrl() || 'landing_page.html';
                window.location.href = returnTo;
            } else {
                showError(data.message || "Échec de la connexion. Veuillez vérifier vos informations.");
            }
        } catch (error) {
            console.error('Login error:', error);
            showError("Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.");
        }
    }
    
    // Function to register user
    async function registerUser(username, email, password) {
        try {
            const response = await fetch(`${baseUrl}api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Redirect to login page with success message
                window.location.href = 'login.html?registered=true';
            } else {
                showError(data.message || "Échec de l'inscription. Veuillez réessayer.");
            }
        } catch (error) {
            console.error('Registration error:', error);
            showError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer plus tard.");
        }
    }
    
    // Function to logout user
    function logoutUser() {
        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = 'login.html?logout=true';
    }
    
    // Function to check authentication state
    function checkAuthState() {
        // Check for URL params (for messages)
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('registered') && urlParams.get('registered') === 'true') {
            showSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        }
        
        if (urlParams.has('logout') && urlParams.get('logout') === 'true') {
            showSuccess("Vous avez été déconnecté avec succès.");
        }
        
        // Update UI based on auth state
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');
        
        updateAuthUI(user);
        
        // Only verify with backend if we have a token
        if (token) {
            fetch(`${baseUrl}api/auth/check`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (!data.authenticated && user) {
                    // Session expired, clear local storage
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    updateAuthUI(null);
                } else if (data.authenticated && !user) {
                    // User authenticated but no local storage - update it
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateAuthUI(data.user);
                }
            })
            .catch(error => {
                console.error('Auth check error:', error);
            });
        }
    }
    
    // Function to update UI based on auth state
    function updateAuthUI(user) {
        // Update profile icon or user info in header
        const profileIcon = document.querySelector('.user img');
        if (profileIcon && user) {
            // If authenticated, could change the icon or add a small indicator
            profileIcon.setAttribute('title', `Connecté en tant que: ${user.username}`);
            
            // Add visual indicator
            const userDiv = document.querySelector('.user');
            if (userDiv && !userDiv.querySelector('.login-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'login-indicator';
                indicator.style.width = '8px';
                indicator.style.height = '8px';
                indicator.style.backgroundColor = '#4CAF50';
                indicator.style.borderRadius = '50%';
                indicator.style.position = 'absolute';
                indicator.style.top = '0';
                indicator.style.right = '0';
                userDiv.style.position = 'relative';
                userDiv.appendChild(indicator);
            }
        } else if (profileIcon) {
            // Not logged in
            profileIcon.setAttribute('title', 'Se connecter / S\'inscrire');
            
            // Remove indicator if it exists
            const indicator = document.querySelector('.login-indicator');
            if (indicator) indicator.remove();
        }
    }
    
    // Function to get return URL from query parameter
    function getReturnUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('returnTo');
    }
    
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
        // If success element doesn't exist, create one
        if (!successElement && document.querySelector('.auth-box')) {
            const newSuccessElement = document.createElement('div');
            newSuccessElement.id = 'success-message';
            newSuccessElement.className = 'success-message';
            
            // Insert after h2
            const authBox = document.querySelector('.auth-box');
            const heading = authBox.querySelector('h2');
            if (heading) {
                authBox.insertBefore(newSuccessElement, heading.nextSibling);
            } else {
                authBox.prepend(newSuccessElement);
            }
            
            newSuccessElement.textContent = message;
            newSuccessElement.classList.add('show');
            
            // Hide after 5 seconds
            setTimeout(() => {
                newSuccessElement.classList.remove('show');
            }, 5000);
        } else if (successElement) {
            successElement.textContent = message;
            successElement.classList.add('show');
            
            // Hide after 5 seconds
            setTimeout(() => {
                successElement.classList.remove('show');
            }, 5000);
        }
    }
});