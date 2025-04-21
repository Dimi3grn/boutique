const burgerBtn = document.querySelector(".hamburger-button");
const menu = document.querySelector(".menu");
const sideMenu = document.querySelector(".side-menu");
const menuOverlay = document.querySelector(".menu-overlay");
const userIcon = document.querySelector(".user");

// Animation du bouton hamburger et ouverture du menu
burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('active');
  menu.classList.toggle('active');
  sideMenu.classList.toggle('active');
  menuOverlay.classList.toggle('active');
  
  // Empêche le défilement du contenu quand le menu est ouvert
  if (sideMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Fermer le menu quand on clique sur l'overlay
menuOverlay.addEventListener('click', () => {
  burgerBtn.classList.remove('active');
  menu.classList.remove('active');
  sideMenu.classList.remove('active');
  menuOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

// Fermer le menu quand on clique sur un lien du menu
const menuLinks = document.querySelectorAll('.menu-links a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    burgerBtn.classList.remove('active');
    menu.classList.remove('active');
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Add click handler for the user profile icon
if (userIcon) {
  userIcon.addEventListener('click', () => {
    // Check if user is logged in by looking for stored user data
    const userData = localStorage.getItem('user');
    
    if (userData) {
      // User is logged in, redirect to profile page
      window.location.href = 'profile.html';
    } else {
      // User is not logged in, redirect to login page
      window.location.href = 'login.html';
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit to make sure everything is loaded
  setTimeout(function() {
      const video = document.getElementById('background-video');
      if (video) {
        video.play();
        video.loop = true;
      }
  }, 500); // 500ms delay, adjust as needed

  const header = document.querySelector('header');
  let lastScrollTop = 0;
  
  // Ajoute la position fixe au header
  header.style.position = 'fixed';
  header.style.top = '0';
  header.style.width = '100%';
  header.style.zIndex = '1000';
  header.style.transition = 'transform 0.3s ease-in-out';
  
  // Ajoute un espace pour compenser la hauteur du header en fixed
  const headerHeight = header.offsetHeight;
  document.body.style.paddingTop = headerHeight + 'px';
  
  // Fonction pour gérer le scroll
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Si on défile vers le bas et qu'on a défilé plus que la hauteur du header
    if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
      // Cache le header
      header.style.transform = 'translateY(-100%)';
    } else {
      // Affiche le header
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });

  // Check authentication state and update UI
  updateAuthUI();
});

// Function to update UI based on authentication status
function updateAuthUI() {
  const userData = localStorage.getItem('user');
  const userIcon = document.querySelector('.user img');
  
  if (userData && userIcon) {
    const user = JSON.parse(userData);
    // User is logged in, update UI accordingly
    userIcon.setAttribute('title', `Connected as: ${user.username}`);
    
    // Add visual indicator that user is logged in
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
  } else if (userIcon) {
    // User is not logged in
    userIcon.setAttribute('title', 'Login / Register');
    
    // Remove login indicator if it exists
    const indicator = document.querySelector('.login-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
}

// For the home page only
const featuredButton = document.querySelector("#featured-button");
if (featuredButton) {
  featuredButton.addEventListener('click', () => {
    window.location.href = 'product.html?id=1';
  });
}