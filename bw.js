let originalFileName = "converted";

const dropzone = document.getElementById('dropzone');
const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const convertBtn = document.getElementById('convertBtn');
const compareContainer = document.getElementById('compareContainer');
const compareHandle = document.getElementById('compareHandle');
const backBtn = document.getElementById('backBtn');

// Slider position (in %)
let sliderPos = 50;

/* 
Initial states:
- dropzone is visible
- previewContainer, convertBtn, compareContainer, downloadBtn, backBtn are hidden
*/

// Handle file input
imageInput.addEventListener('change', function() {
  const file = imageInput.files[0];
  if (file) {
    // Store the original file name (minus extension) for downloads
    originalFileName = file.name.replace(/\.[^/.]+$/, "");
    
    const reader = new FileReader();
    reader.onload = function(e) {
      // Hide the dropzone
      dropzone.style.display = "none";
      
      // Show the preview container with the uploaded image
      previewContainer.style.display = "block";
      previewImage.src = e.target.result;
      
      // Show the Convert button
      convertBtn.style.display = "inline-block";
      
      // Reset the slider if user picks a new file
      resultImage.src = "";
      sliderPos = 50;
      updateClipPath(sliderPos);
      centerHandle(sliderPos);
      compareContainer.style.display = "none";
      downloadBtn.style.display = "none";
      backBtn.style.display = "none";
      
      // Also set the original image (used after conversion)
      originalImage.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
});

// Convert the uploaded image to black & white (grayscale).
function convertToGrayscale() {
  if (!originalImage.src) {
    alert("Please upload an image first.");
    return;
  }
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const img = new Image();
  img.src = originalImage.src;
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);
    
    const processedDataURL = canvas.toDataURL('image/png');
    resultImage.src = processedDataURL;
    
    // Hide the preview container
    previewContainer.style.display = "none";
    // Show the compareContainer
    compareContainer.style.display = "block";
    // Show the download and back buttons
    downloadBtn.style.display = "inline-block";
    backBtn.style.display = "inline-block";
    // Hide the convert button
    convertBtn.style.display = "none";
    
    // Center the slider at 50% again
    sliderPos = 50;
    updateClipPath(sliderPos);
    centerHandle(sliderPos);
    initSlider();
  }
}

convertBtn.addEventListener('click', convertToGrayscale);

// Download the converted image with a suffix "-b&w.png".
downloadBtn.addEventListener('click', function() {
  if (!resultImage.src) {
    alert("No converted image to download.");
    return;
  }
  const link = document.createElement('a');
  link.href = resultImage.src;
  link.download = originalFileName + "-b&w.png";
  link.click();
});

// Back button: reset everything to the initial state
backBtn.addEventListener('click', function() {
  // Clear images
  originalImage.src = "";
  resultImage.src = "";
  previewImage.src = "";
  imageInput.value = null;
  
  // Hide preview, convert, compare, download, and back
  previewContainer.style.display = "none";
  convertBtn.style.display = "none";
  compareContainer.style.display = "none";
  downloadBtn.style.display = "none";
  backBtn.style.display = "none";
  
  // Show the dropzone again
  dropzone.style.display = "block";
});

// Initialize the slider drag events
function initSlider() {
  let isDragging = false;
  
  compareHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
  });
  compareHandle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveSlider(e.pageX);
  });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    moveSlider(e.touches[0].pageX);
  });
  
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('touchend', () => { isDragging = false; });
}

// Move the slider handle and clip the B&W image
function moveSlider(pageX) {
  const rect = compareContainer.getBoundingClientRect();
  let pos = pageX - rect.left; // position within container
  if (pos < 0) pos = 0;
  if (pos > rect.width) pos = rect.width;
  
  // Convert to percentage
  const percentage = (pos / rect.width) * 100;
  sliderPos = percentage;
  updateClipPath(sliderPos);
  centerHandle(sliderPos);
}

function updateClipPath(percentage) {
  // Adjust the clip-path of the B&W image from 0% to 100%
  resultImage.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
}

function centerHandle(percentage) {
  // Move the circular handle to the correct position
  compareHandle.style.left = `${percentage}%`;
  compareHandle.style.transform = `translate(-${percentage}%, -50%)`;
}

// ----- Ripple Effect Code -----
function createRipple() {
  const rippleContainer = document.getElementById('ripple-container');
  const ripple = document.createElement('div');
  ripple.classList.add('ripple');
  
  const size = Math.random() * 100 + 50;
  ripple.style.width = ripple.style.height = size + 'px';
  
  const x = Math.random() * (window.innerWidth - size);
  const y = Math.random() * (window.innerHeight - size);
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  rippleContainer.appendChild(ripple);
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
}

function scheduleRipple() {
  createRipple();
  const delay = Math.random() * 2000 + 1000;
  setTimeout(scheduleRipple, delay);
}

document.addEventListener('DOMContentLoaded', function() {
  scheduleRipple();
  // Slider is ready, but container is hidden until a file is converted.
  initSlider();
});
