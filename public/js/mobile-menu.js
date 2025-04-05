// Mobile Menu JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  let overlay;
  
  // Create overlay element if it doesn't exist
  if (!document.querySelector('.overlay')) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
  } else {
    overlay = document.querySelector('.overlay');
  }
  
  // Toggle menu on hamburger icon click
  mobileMenuToggle.addEventListener('click', function() {
    mainNav.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  });
  
  // Close menu on overlay click
  overlay.addEventListener('click', function() {
    mainNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  });
  
  // Close menu on window resize if screen becomes larger
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      mainNav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  });
});
