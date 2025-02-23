// Extract YouTube video ID from URL
function extractVideoID(url) {
    var regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
  }
  
  // Generate and display the thumbnail along with a download button
  function downloadThumbnail() {
    var url = document.getElementById("yt-url").value.trim();
    var videoID = extractVideoID(url);
    var resultDiv = document.getElementById("result");
    
    if (!videoID) {
      resultDiv.innerHTML = "Invalid YouTube URL";
      return;
    }
    
    var thumbURL = "https://img.youtube.com/vi/" + videoID + "/maxresdefault.jpg";
    
    resultDiv.innerHTML = '<img src="' + thumbURL + '" alt="Thumbnail" class="thumbnail"><br>' +
                          '<a href="' + thumbURL + '" download="thumbnail.jpg" class="button-action" style="width:auto; padding:8px 12px;">Download Thumbnail</a>';
  }
  
  // ----- Ripple Effect Code -----
  function createRipple() {
    const rippleContainer = document.getElementById('ripple-container');
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    
    // Random size between 50px and 150px
    const size = Math.random() * 100 + 50;
    ripple.style.width = ripple.style.height = size + 'px';
    
    // Position the ripple at a random location within the viewport
    const x = Math.random() * (window.innerWidth - size);
    const y = Math.random() * (window.innerHeight - size);
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    rippleContainer.appendChild(ripple);
    
    // Remove ripple after animation completes (3 seconds)
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }
  
  function scheduleRipple() {
    createRipple();
    const delay = Math.random() * 2000 + 1000; // Random delay between 1s and 3s
    setTimeout(scheduleRipple, delay);
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    scheduleRipple();
  });
  