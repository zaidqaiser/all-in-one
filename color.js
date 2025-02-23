// ---- Helper Functions for Color Conversion ----
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }
  
  function hexToHSL(H) {
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length === 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l };
  }
  
  function getHueFromHex(hex) {
    return hexToHSL(hex).h;
  }
  
  // ---- Color Generation ----
  // Generates a random color as HEX based on the selected contrast option and optional base hue.
  function generateRandomColor(contrast, baseHue = null) {
    let h;
    if (baseHue !== null) {
      h = baseHue + (Math.random() * 30 - 15); // ±15 degrees variation
      h = (h + 360) % 360;
    } else {
      h = Math.floor(Math.random() * 360);
    }
    
    let s, l;
    if (contrast === "bright") {
      s = Math.floor(Math.random() * 21 + 80); // 80-100%
      l = Math.floor(Math.random() * 21 + 50); // 50-70%
    } else if (contrast === "muted") {
      s = Math.floor(Math.random() * 21 + 30); // 30-50%
      l = Math.floor(Math.random() * 21 + 40); // 40-60%
    } else if (contrast === "aesthetic") {
      s = Math.floor(Math.random() * 11 + 50); // 50-60%
      l = Math.floor(Math.random() * 16 + 70); // 70-85%
    } else {
      s = Math.floor(Math.random() * 101);
      l = Math.floor(Math.random() * 101);
    }
    return hslToHex(h, s, l);
  }
  
  // ---- Palette Generation ----
  function generatePalette() {
    const contrast = document.querySelector('.category-option.active').getAttribute('data-value');
    const paletteContainer = document.getElementById('palette');
    const numColors = 5;
    
    // If a locked color exists, use its hue as base.
    let baseHue = null;
    const lockedItem = paletteContainer.querySelector('.palette-item.locked');
    if (lockedItem) {
      baseHue = getHueFromHex(lockedItem.getAttribute('data-color'));
    }
    
    if (paletteContainer.children.length === numColors) {
      // Update only unlocked items.
      Array.from(paletteContainer.children).forEach(item => {
        if (!item.classList.contains('locked')) {
          const newColor = generateRandomColor(contrast, baseHue);
          item.style.backgroundColor = newColor;
          item.setAttribute('data-color', newColor);
          item.querySelector('.color-code').textContent = newColor;
        }
      });
    } else {
      // Create new palette items.
      paletteContainer.innerHTML = '';
      for (let i = 0; i < numColors; i++) {
        const color = generateRandomColor(contrast, baseHue);
        const div = document.createElement('div');
        div.className = 'palette-item';
        div.style.backgroundColor = color;
        div.setAttribute('data-color', color);
        
        const codeSpan = document.createElement('span');
        codeSpan.className = 'color-code';
        codeSpan.textContent = color;
        
        const lockIcon = document.createElement('div');
        lockIcon.classList.add('lock-icon', 'unlocked');
        lockIcon.innerHTML = `<svg viewBox="0 0 24 24">
          <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7h-1V7a5 5 0 0 0-10 0v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-8-3a3 3 0 0 1 6 0v3H10V7z"/>
        </svg>`;
        lockIcon.onclick = function(e) {
          e.stopPropagation();
          toggleLock(div, lockIcon);
        };
        
        div.appendChild(codeSpan);
        div.appendChild(lockIcon);
        
        // Clicking the palette item copies its HEX code.
        div.addEventListener('click', () => copyToClipboard(div.getAttribute('data-color')));
        
        paletteContainer.appendChild(div);
      }
    }
  }
  
  function toggleLock(item, lockIcon) {
    if (item.classList.contains('locked')) {
      item.classList.remove('locked');
      lockIcon.classList.remove('locked');
      lockIcon.classList.add('unlocked');
    } else {
      item.classList.add('locked');
      lockIcon.classList.remove('unlocked');
      lockIcon.classList.add('locked');
    }
  }
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied: " + text);
    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  }
  
  // ---- Category Option Selection ----
  function initCategorySelection() {
    const options = document.querySelectorAll('.category-option');
    options.forEach(option => {
      option.addEventListener('click', () => {
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
      });
    });
  }
  
  // ---- Download Palette as PNG ----
  function downloadPalettePNG() {
    const paletteContainer = document.getElementById('palette');
    html2canvas(paletteContainer).then(canvas => {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'color-palette.png';
      link.click();
    });
  }
  
  // ---- Ripple Effect Code ----
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
  
  // ---- Initialization ----
  document.addEventListener('DOMContentLoaded', function() {
    initCategorySelection();
    document.getElementById('generateBtn').addEventListener('click', generatePalette);
    document.getElementById('downloadPaletteBtn').addEventListener('click', downloadPalettePNG);
    generatePalette();
    scheduleRipple();
  });
  