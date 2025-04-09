/**
 * Settings functionality
 */

class Settings {
    constructor(keyboardTest, typingTest) {
      // Reference to test instances
      this.keyboardTest = keyboardTest;
      this.typingTest = typingTest;
      
      // DOM Elements - Theme settings
      this.darkModeBtn = $('#darkModeBtn');
      this.lighterDarkBtn = $('#lighterDarkBtn');
      this.colorButtons = document.querySelectorAll('[data-color]');
      this.fontSizeSlider = $('#fontSizeSlider');
      
      // DOM Elements - Animation settings
      this.animOnBtn = $('#animOnBtn');
      this.animOffBtn = $('#animOffBtn');
      
      // DOM Elements - Test settings
      this.durationButtons = document.querySelectorAll('[data-duration]');
      this.contentTypeButtons = document.querySelectorAll('[data-content]');
      this.soundOnBtn = $('#soundOnBtn');
      this.soundOffBtn = $('#soundOffBtn');
      this.errorsShowBtn = $('#errorsShowBtn');
      this.errorsHideBtn = $('#errorsHideBtn');
      
      // DOM Elements - Reset
      this.resetDataBtn = $('#resetDataBtn');
      
      // State
      this.darkMode = getFromLocalStorage('darkMode', 'dark');
      this.primaryColor = getFromLocalStorage('primaryColor', 'blue');
      this.fontSize = getFromLocalStorage('fontSize', 16);
      this.animationsEnabled = getFromLocalStorage('animationEnabled', true);
      this.soundsEnabled = getFromLocalStorage('soundsEnabled', false);
      this.showErrors = getFromLocalStorage('showErrors', true);
      
      // Load saved settings
      this.loadSettings();
      
      // Bind events
      this.bindEvents();
    }
    
    bindEvents() {
      // Theme buttons
      this.darkModeBtn.addEventListener('click', () => this.setDarkMode('dark'));
      this.lighterDarkBtn.addEventListener('click', () => this.setDarkMode('lighter'));
      
      // Color buttons
      this.colorButtons.forEach(button => {
        button.addEventListener('click', () => {
          const color = button.getAttribute('data-color');
          this.setPrimaryColor(color);
        });
      });
      
      // Font size slider
      this.fontSizeSlider.addEventListener('input', () => {
        this.setFontSize(parseInt(this.fontSizeSlider.value));
      });
      
      // Animation buttons
      this.animOnBtn.addEventListener('click', () => this.setAnimationsEnabled(true));
      this.animOffBtn.addEventListener('click', () => this.setAnimationsEnabled(false));
      
      // Test duration buttons
      this.durationButtons.forEach(button => {
        button.addEventListener('click', () => {
          const duration = parseInt(button.getAttribute('data-duration'));
          this.setTestDuration(duration);
        });
      });
      
      // Content type buttons
      this.contentTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const contentType = button.getAttribute('data-content');
          this.setContentType(contentType);
        });
      });
      
      // Sound buttons
      this.soundOnBtn.addEventListener('click', () => this.setSoundsEnabled(true));
      this.soundOffBtn.addEventListener('click', () => this.setSoundsEnabled(false));
      
      // Error display buttons
      this.errorsShowBtn.addEventListener('click', () => this.setShowErrors(true));
      this.errorsHideBtn.addEventListener('click', () => this.setShowErrors(false));
      
      // Reset button
      this.resetDataBtn.addEventListener('click', this.resetAllData.bind(this));
    }
    
    loadSettings() {
      // Apply dark mode
      this.setDarkMode(this.darkMode, false);
      
      // Apply primary color
      this.setPrimaryColor(this.primaryColor, false);
      
      // Apply font size
      this.setFontSize(this.fontSize, false);
      
      // Apply animations setting
      this.setAnimationsEnabled(this.animationsEnabled, false);
      
      // Apply sounds setting
      this.setSoundsEnabled(this.soundsEnabled, false);
      
      // Apply error display setting
      this.setShowErrors(this.showErrors, false);
      
      // Set font size slider value
      this.fontSizeSlider.value = this.fontSize;
      
      // Highlight the active test duration button
      const testDuration = getFromLocalStorage('testDuration', 60);
      this.durationButtons.forEach(button => {
        const duration = parseInt(button.getAttribute('data-duration'));
        if (duration === testDuration) {
          button.classList.add('border', 'border-primary-500', 'text-primary-400');
          button.classList.remove('text-gray-400');
        }
      });
      
      // Highlight the active content type button
      const contentType = getFromLocalStorage('contentType', 'random');
      this.contentTypeButtons.forEach(button => {
        const type = button.getAttribute('data-content');
        if (type === contentType) {
          button.classList.add('border', 'border-primary-500', 'text-primary-400');
          button.classList.remove('text-gray-400');
        }
      });
    }
    
    setDarkMode(mode, save = true) {
      this.darkMode = mode;
      
      // Update UI buttons
      if (mode === 'dark') {
        this.darkModeBtn.classList.add('border', 'border-primary-500', 'text-primary-400');
        this.darkModeBtn.classList.remove('text-gray-400');
        this.lighterDarkBtn.classList.remove('border', 'border-primary-500', 'text-primary-400');
        this.lighterDarkBtn.classList.add('text-gray-400');
        
        // Apply dark mode
        document.body.classList.remove('bg-dark-700');
        document.body.classList.add('bg-dark-800');
        
        // Change key colors
        document.querySelectorAll('.key').forEach(key => {
          key.classList.remove('bg-dark-500');
          key.classList.add('bg-dark-600');
        });
      } else {
        this.lighterDarkBtn.classList.add('border', 'border-primary-500', 'text-primary-400');
        this.lighterDarkBtn.classList.remove('text-gray-400');
        this.darkModeBtn.classList.remove('border', 'border-primary-500', 'text-primary-400');
        this.darkModeBtn.classList.add('text-gray-400');
        
        // Apply lighter dark mode
        document.body.classList.remove('bg-dark-800');
        document.body.classList.add('bg-dark-700');
        
        // Change key colors
        document.querySelectorAll('.key').forEach(key => {
          key.classList.remove('bg-dark-600');
          key.classList.add('bg-dark-500');
        });
      }
      
      if (save) {
        saveToLocalStorage('darkMode', mode);
      }
    }
    
    setPrimaryColor(color, save = true) {
      this.primaryColor = color;
      
      // Get all buttons with data-color attribute
      this.colorButtons.forEach(button => {
        if (button.getAttribute('data-color') === color) {
          button.classList.add('border-2', 'border-white');
        } else {
          button.classList.remove('border-2', 'border-white');
        }
      });
      
      // Apply color to CSS variables using tailwind colors
      let colorHex;
      switch (color) {
        case 'blue':
          colorHex = '#0073f5'; // primary-500
          break;
        case 'green':
          colorHex = '#10b981'; // green-500
          break;
        case 'purple':
          colorHex = '#8b5cf6'; // purple-500
          break;
        case 'pink':
          colorHex = '#ec4899'; // pink-500
          break;
        case 'yellow':
          colorHex = '#eab308'; // yellow-500
          break;
        case 'red':
          colorHex = '#ef4444'; // red-500
          break;
        default:
          colorHex = '#0073f5'; // primary-500
      }
      
      // Apply color to active elements
      document.documentElement.style.setProperty('--color-primary-500', colorHex);
      
      // Update all text-primary-400 elements with the new color
      document.querySelectorAll('.text-primary-400').forEach(el => {
        el.style.color = colorHex;
      });
      
      // Update all border-primary-500 elements
      document.querySelectorAll('.border-primary-500').forEach(el => {
        el.style.borderColor = colorHex;
      });
      
      // Update all bg-primary-600 elements
      document.querySelectorAll('.bg-primary-600').forEach(el => {
        const darkerColor = this.adjustColor(colorHex, -20); // Darken the color
        el.style.backgroundColor = darkerColor;
      });
      
      if (save) {
        saveToLocalStorage('primaryColor', color);
      }
    }
    
    adjustColor(color, amount) {
      // Helper function to darken/lighten a hex color
      let hex = color;
      if (hex.startsWith('#')) {
        hex = hex.slice(1);
      }
      
      const num = parseInt(hex, 16);
      let r = (num >> 16) + amount;
      let g = ((num >> 8) & 0x00FF) + amount;
      let b = (num & 0x0000FF) + amount;
      
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));
      
      return `#${(g | (r << 8) | (b << 16)).toString(16).padStart(6, '0')}`;
    }
    
    setFontSize(size, save = true) {
      this.fontSize = size;
      
      // Apply font size to the document root
      document.documentElement.style.fontSize = `${size}px`;
      
      if (save) {
        saveToLocalStorage('fontSize', size);
      }
    }
    
    setAnimationsEnabled(enabled, save = true) {
      this.animationsEnabled = enabled;
      
      // Update UI
      if (enabled) {
        this.animOnBtn.classList.add('border', 'border-primary-500', 'text-primary-400');
        this.animOnBtn.classList.remove('text-gray-400');
        this.animOffBtn.classList.remove('border', 'border-primary-500', 'text-primary-400');
        this.animOffBtn.classList.add('text-gray-400');
      } else {
        this.animOffBtn.classList.add('border', 'border-primary-500', 'text-primary-400');
        this.animOffBtn.classList.remove('text-gray-400');
        this.animOnBtn.classList.remove('border', 'border-primary-500', 'text-primary-400');
        this.animOnBtn.classList.add('text-gray-400');
      }
      
      // Update keyboard test
      if (this.keyboardTest) {
        this.keyboardTest.setAnimationEnabled(enabled);
      }
      
      if (save) {
        saveToLocalStorage('animationEnabled', enabled);
      }
    }
    
    setTestDuration(duration, save = true) {
      // Update UI
      this.durationButtons.forEach(button => {
        const buttonDuration = parseInt(button.getAttribute('data-duration'));
        if (buttonDuration === duration) {
          button.classList.add('border', 'border-primary-500', 'text-primary-400');
          button.classList.remove('text-gray-400');
        } else {
          button.classList.remove('border', 'border-primary-500', 'text-primary-400');
          button.classList.add('text-gray-400');
        }
      });
      
      // Update typing test
      if (this.typingTest) {
        this.typingTest.setTestDuration(duration);
      }
      
      if (save) {
        saveToLocalStorage('testDuration', duration);
      }
    }
    
    setContentType(type, save = true) {
      // Update UI
      this.contentTypeButtons.forEach(button => {
        const buttonType = button.getAttribute('data-content');
        if (buttonType === type) {
          button.classList.add('border', 'border-primary-500', 'text-primary-400');
          button.classList.remove('text-gray-400');
        } else {
          button.classList.remove('border', 'border-primary-500', 'text-primary-400');
          button.classList.add('text-gray-400');
        }
      });
      
      // Update typing test
      if (this.typingTest) {
        this.typingTest.setContentType(type);
      }
      
      if (save) {
        saveToLocalStorage('contentType', type);
      }
    }
    
    setSoundsEnabled(enabled, save = true) {
      this.soundsEnabled = enabled;
      
      // Update UI
      if (enabled) {
        this.soundOnBtn.classList.add('border', 'border-primary-500', 'text-primary-400');
        this.soundOnBtn.classList.remove('text-gray-400');
        this.soundOffBtn.classList.remove('border', 'border-primary-500', 'text-primary-400');
        this.soundOffBtn.classList.add('text-gray-400');
      } else {
        this.soundOffBtn.classList.add('border', 'border-primary-500', 'text-primary-400');
        this.soundOffBtn.classList.remove('text-gray-400');
        this.soundOnBtn.classList.remove('border', 'border-primary-500', 'text-primary-400');
        this.soundOnBtn.classList.add('text-gray-400');
      }
      
      if (save) {
        saveToLocalStorage('soundsEnabled', enabled);
      }
    }
    
    setShowErrors(show, save = true) {
      this.showErrors = show;
      
      // Update UI
      if (show) {
        this.errorsShowBtn.classList.add('border', 'border-primary-500', 'text-primary-400');
        this.errorsShowBtn.classList.remove('text-gray-400');
        this.errorsHideBtn.classList.remove('border', 'border-primary-500', 'text-primary-400');
        this.errorsHideBtn.classList.add('text-gray-400');
      } else {
        this.errorsHideBtn.classList.add('border', 'border-primary-500', 'text-primary-400');
        this.errorsHideBtn.classList.remove('text-gray-400');
        this.errorsShowBtn.classList.remove('border', 'border-primary-500', 'text-primary-400');
        this.errorsShowBtn.classList.add('text-gray-400');
      }
      
      // Update typing test
      if (this.typingTest) {
        this.typingTest.setShowErrors(show);
      }
      
      if (save) {
        saveToLocalStorage('showErrors', show);
      }
    }
    
    resetAllData() {
      if (confirm('Are you sure you want to reset all data? This will clear your typing history and statistics.')) {
        // Clear local storage
        localStorage.clear();
        
        // Reset keyboard test
        if (this.keyboardTest) {
          this.keyboardTest.reset();
        }
        
        // Reset typing test
        if (this.typingTest) {
          this.typingTest.clearHistory();
        }
        
        // Reset settings to defaults
        this.darkMode = 'dark';
        this.primaryColor = 'blue';
        this.fontSize = 16;
        this.animationsEnabled = true;
        this.soundsEnabled = false;
        this.showErrors = true;
        
        // Reload settings
        this.loadSettings();
        
        // Show confirmation
        alert('All data has been reset!');
      }
    }
  }