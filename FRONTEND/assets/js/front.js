const burgerBtn = document.querySelector(".hamburger-button");
    
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('active');
    });