// ----- Ripple Effect Code -----
function createRipple() {
    const rippleContainer = document.getElementById('ripple-container');
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    
    // Random size between 50px and 150px
    const size = Math.random() * 100 + 50;
    ripple.style.width = ripple.style.height = size + 'px';
    
    // Position the ripple at a random location in the viewport
    const x = Math.random() * (window.innerWidth - size);
    const y = Math.random() * (window.innerHeight - size);
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    rippleContainer.appendChild(ripple);
    
    // Remove the ripple element after animation completes (3 seconds)
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }
  
  function scheduleRipple() {
    createRipple();
    const delay = Math.random() * 2000 + 1000; // Random delay between 1s and 3s
    setTimeout(scheduleRipple, delay);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    scheduleRipple();
  });
  