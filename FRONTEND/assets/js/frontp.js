const burgerBtn = document.querySelector(".hamburger-button");
const menu = document.querySelector(".menu");
const sideMenu = document.querySelector(".side-menu");
const menuOverlay = document.querySelector(".menu-overlay");

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

document.addEventListener('DOMContentLoaded', function() {
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
});