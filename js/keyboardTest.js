/**
 * Keyboard Test functionality
 */

class KeyboardTest {
    constructor() {
      // DOM Elements
      this.keyDisplay = $('#keyDisplay');
      this.keyCount = $('#keyCount');
      this.clearBtn = $('#clearBtn');
      this.totalKeysPressed = $('#totalKeysPressed');
      this.mostUsedKey = $('#mostUsedKey');
      this.uniqueKeysPressed = $('#uniqueKeysPressed');
      this.sessionTime = $('#sessionTime');
      
      // State
      this.pressedKeys = [];
      this.keyStats = {};
      this.startTime = new Date();
      this.sessionTimer = null;
      this.animationEnabled = getFromLocalStorage('animationEnabled', true);
      
      // Load saved stats if available
      this.loadStats();
      
      // Bind event handlers
      this.bindEvents();
      
      // Start session timer
      this.startSessionTimer();
    }
    
    bindEvents() {
      // Key press event
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
      document.addEventListener('keyup', this.handleKeyUp.bind(this));
      
      // Clear button
      this.clearBtn.addEventListener('click', this.clearDisplay.bind(this));
    }
    
    handleKeyDown(event) {
      event.preventDefault();
      
      const key = event.key;
      const code = event.code;
      
      // Update key display
      this.addKeyToDisplay(key, code);
      
      // Highlight the corresponding key on the visual keyboard
      this.highlightKey(code);
      
      // Play key sound
      playKeySound(key);
      
      // Update statistics
      this.updateKeyStats(key);
    }
    
    handleKeyUp(event) {
      const code = event.code;
      
      // Remove highlight from the key
      this.removeKeyHighlight(code);
    }
    
    highlightKey(code) {
      // Find the corresponding key element
      const keyElement = document.querySelector(`[data-key="${code}"], [data-key="${code.replace('Key', '').toLowerCase()}"]`);
      
      if (keyElement) {
        keyElement.classList.add('active');
        
        // Apply animation if enabled
        if (this.animationEnabled) {
          keyElement.style.transform = 'scale(0.95)';
        }
      }
    }
    
    removeKeyHighlight(code) {
      // Find the corresponding key element
      const keyElement = document.querySelector(`[data-key="${code}"], [data-key="${code.replace('Key', '').toLowerCase()}"]`);
      
      if (keyElement) {
        keyElement.classList.remove('active');
        
        // Reset transform if animation is enabled
        if (this.animationEnabled) {
          keyElement.style.transform = '';
        }
      }
    }
    
    addKeyToDisplay(key, code) {
      // Clear initial placeholder if present
      if (this.keyDisplay.querySelector('.text-gray-500')) {
        this.keyDisplay.innerHTML = '';
      }
      
      // Create key span
      const keySpan = document.createElement('span');
      keySpan.classList.add('inline-block', 'px-2', 'py-1', 'm-1', 'bg-dark-600', 'rounded', 'text-white');
      
      // Handle special keys
      let displayKey = key;
      if (key === ' ') {
        displayKey = 'Space';
      } else if (key === 'Control') {
        displayKey = 'Ctrl';
      } else if (key === 'Meta') {
        displayKey = 'Win';
      } else if (key.length === 1) {
        // For regular keys, just show the key
        displayKey = key;
      } else {
        // For special keys, use the full name
        displayKey = key;
      }
      
      keySpan.textContent = displayKey;
      this.keyDisplay.appendChild(keySpan);
      
      // Auto scroll to the latest key
      this.keyDisplay.scrollLeft = this.keyDisplay.scrollWidth;
      
      // Update key count
      this.pressedKeys.push(key);
      this.keyCount.textContent = this.pressedKeys.length;
    }
    
    clearDisplay() {
      this.keyDisplay.innerHTML = '<span class="text-gray-500">Press any key to test...</span>';
      this.pressedKeys = [];
      this.keyCount.textContent = '0';
    }
    
    updateKeyStats(key) {
      // Update key statistics
      if (!this.keyStats[key]) {
        this.keyStats[key] = 0;
      }
      this.keyStats[key]++;
      
      // Update UI statistics
      const totalKeys = Object.values(this.keyStats).reduce((total, count) => total + count, 0);
      this.totalKeysPressed.textContent = totalKeys;
      
      // Find most used key
      let mostUsedKeyValue = '';
      let mostUsedCount = 0;
      
      for (const [keyName, count] of Object.entries(this.keyStats)) {
        if (count > mostUsedCount) {
          mostUsedCount = count;
          mostUsedKeyValue = keyName;
        }
      }
      
      // Format special keys for display
      let displayKey = mostUsedKeyValue;
      if (mostUsedKeyValue === ' ') {
        displayKey = 'Space';
      } else if (mostUsedKeyValue === 'Control') {
        displayKey = 'Ctrl';
      } else if (mostUsedKeyValue === 'Meta') {
        displayKey = 'Win';
      }
      
      this.mostUsedKey.textContent = mostUsedKeyValue ? `${displayKey} (${mostUsedCount})` : 'None';
      this.uniqueKeysPressed.textContent = Object.keys(this.keyStats).length;
      
      // Save stats
      this.saveStats();
    }
    
    startSessionTimer() {
      this.sessionTimer = setInterval(() => {
        const now = new Date();
        const sessionDuration = Math.floor((now - this.startTime) / 1000);
        this.sessionTime.textContent = formatTimeMMSS(sessionDuration);
      }, 1000);
    }
    
    saveStats() {
      saveToLocalStorage('keyStats', this.keyStats);
    }
    
    loadStats() {
      const savedStats = getFromLocalStorage('keyStats', {});
      this.keyStats = savedStats;
      
      // Update UI with loaded stats
      if (Object.keys(this.keyStats).length > 0) {
        const totalKeys = Object.values(this.keyStats).reduce((total, count) => total + count, 0);
        this.totalKeysPressed.textContent = totalKeys;
        
        // Find most used key
        let mostUsedKeyValue = '';
        let mostUsedCount = 0;
        
        for (const [keyName, count] of Object.entries(this.keyStats)) {
          if (count > mostUsedCount) {
            mostUsedCount = count;
            mostUsedKeyValue = keyName;
          }
        }
        
        // Format special keys for display
        let displayKey = mostUsedKeyValue;
        if (mostUsedKeyValue === ' ') {
          displayKey = 'Space';
        } else if (mostUsedKeyValue === 'Control') {
          displayKey = 'Ctrl';
        } else if (mostUsedKeyValue === 'Meta') {
          displayKey = 'Win';
        }
        
        this.mostUsedKey.textContent = mostUsedKeyValue ? `${displayKey} (${mostUsedCount})` : 'None';
        this.uniqueKeysPressed.textContent = Object.keys(this.keyStats).length;
      }
    }
    
    setAnimationEnabled(enabled) {
      this.animationEnabled = enabled;
      saveToLocalStorage('animationEnabled', enabled);
    }
    
    reset() {
      this.keyStats = {};
      this.saveStats();
      this.clearDisplay();
      this.totalKeysPressed.textContent = '0';
      this.mostUsedKey.textContent = 'None';
      this.uniqueKeysPressed.textContent = '0';
      this.startTime = new Date();
    }
  }