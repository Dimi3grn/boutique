const burgerBtn = document.querySelector(".hamburger-button");
    
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('active');
});


document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit to make sure everything is loaded
  setTimeout(function() {
      const video = document.getElementById('background-video');
      video.play();
      video.loop = true;
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
});