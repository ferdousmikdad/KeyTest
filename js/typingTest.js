/**
 * Typing Test functionality
 */

class TypingTest {
    constructor() {
      // DOM Elements
      this.difficultySelect = $('#difficultySelect');
      this.startTestBtn = $('#startTestBtn');
      this.retryTestBtn = $('#retryTestBtn');
      this.newTestBtn = $('#newTestBtn');
      this.typingPrompt = $('#typingPrompt');
      this.countdownOverlay = $('#countdownOverlay');
      this.countdownTimer = $('#countdownTimer');
      this.resultOverlay = $('#resultOverlay');
      this.resultWPM = $('#resultWPM');
      this.resultAccuracy = $('#resultAccuracy');
      this.resultCorrect = $('#resultCorrect');
      this.resultErrors = $('#resultErrors');
      this.testTime = $('#testTime');
      this.testWPM = $('#testWPM');
      this.testAccuracy = $('#testAccuracy');
      this.tipContainer = $('#tipContainer');
      this.typingHistory = $('#typingHistory');
      
      // State
      this.originalText = '';
      this.currentCharIndex = 0;
      this.correctCharCount = 0;
      this.errorCount = 0;
      this.timer = null;
      this.testActive = false;
      this.testStartTime = null;
      this.testDuration = getFromLocalStorage('testDuration', 60); // Default 60 seconds
      this.timeElapsed = 0;
      this.contentType = getFromLocalStorage('contentType', 'random');
      this.typingHistory = getFromLocalStorage('typingHistory', []);
      this.showErrors = getFromLocalStorage('showErrors', true);
      
      // Bind events
      this.bindEvents();
      
      // Show a random tip
      this.showRandomTip();
    }
    
    bindEvents() {
      // Start button
      this.startTestBtn.addEventListener('click', this.startTest.bind(this));
      
      // Retry button
      this.retryTestBtn.addEventListener('click', this.resetTest.bind(this));
      
      // New text button
      this.newTestBtn.addEventListener('click', this.generateNewText.bind(this));
      
      // Difficulty select
      this.difficultySelect.addEventListener('change', this.generateNewText.bind(this));
      
      // Keyboard input for typing
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    startTest() {
      if (this.testActive) return;
      
      // Generate new text if needed
      if (this.typingPrompt.textContent.includes('Press the start button')) {
        this.generateNewText();
      }
      
      // Start countdown
      this.startCountdown();
    }
    
    startCountdown() {
      let count = 3;
      this.countdownTimer.textContent = count;
      this.countdownOverlay.classList.remove('hidden');
      
      const countdownInterval = setInterval(() => {
        count--;
        
        if (count <= 0) {
          clearInterval(countdownInterval);
          this.countdownOverlay.classList.add('hidden');
          this.initializeTest();
        } else {
          this.countdownTimer.textContent = count;
        }
      }, 1000);
    }
    
    initializeTest() {
      // Reset test state
      this.currentCharIndex = 0;
      this.correctCharCount = 0;
      this.errorCount = 0;
      this.timeElapsed = 0;
      this.testActive = true;
      this.testStartTime = Date.now();
      
      // Reset test UI
      this.testTime.textContent = '0s';
      this.testWPM.textContent = '0';
      this.testAccuracy.textContent = '100%';
      this.renderText();
      
      // Start timer
      this.timer = setInterval(() => {
        this.timeElapsed = Math.floor((Date.now() - this.testStartTime) / 1000);
        this.testTime.textContent = formatTime(this.timeElapsed);
        
        // Update WPM calculation
        const wpm = calculateWPM(this.currentCharIndex, this.timeElapsed);
        this.testWPM.textContent = wpm;
        
        // Check if time is up
        if (this.timeElapsed >= this.testDuration) {
          this.endTest();
        }
      }, 1000);
    }
    
    generateNewText() {
      const difficulty = this.difficultySelect.value;
      this.originalText = getRandomText(difficulty, this.contentType);
      this.typingPrompt.innerHTML = ''; // Clear current content
      
      // Reset test state
      this.currentCharIndex = 0;
      this.correctCharCount = 0;
      this.errorCount = 0;
      
      // Render the new text
      this.renderText();
      
      // Show a new random tip
      this.showRandomTip();
    }
    
    renderText() {
      this.typingPrompt.innerHTML = '';
      
      for (let i = 0; i < this.originalText.length; i++) {
        const char = this.originalText[i];
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.className = 'char';
        
        if (i === this.currentCharIndex) {
          charSpan.classList.add('current');
        } else if (i < this.currentCharIndex) {
          // For characters already typed
          if (this.showErrors) {
            // We'll set correct/incorrect class based on user input later
          }
        }
        
        this.typingPrompt.appendChild(charSpan);
      }
    }
    
    handleKeyDown(event) {
      // Only process keys if test is active
      if (!this.testActive) return;
      
      // Get the current character to type
      const expectedChar = this.originalText[this.currentCharIndex];
      
      // Handle special keys
      if (event.key === 'Escape') {
        this.endTest();
        return;
      }
      
      // Prevent default behavior for most keys during the test
      if (event.key !== 'F5' && !event.ctrlKey) {
        event.preventDefault();
      }
      
      // Handle backspace
      if (event.key === 'Backspace') {
        // Only allow backspace if not at the beginning
        if (this.currentCharIndex > 0) {
          this.currentCharIndex--;
          this.renderText();
          
          // Play backspace sound
          playKeySound('Backspace');
        }
        return;
      }
      
      // Regular key press
      if (this.currentCharIndex < this.originalText.length) {
        const char = event.key;
        
        // Check if the typed character matches the expected character
        const isCorrect = char === expectedChar;
        
        // Update the character span
        const charSpans = this.typingPrompt.querySelectorAll('.char');
        
        if (isCorrect) {
          this.correctCharCount++;
          if (this.showErrors) {
            charSpans[this.currentCharIndex].classList.add('correct');
          }
        } else {
          this.errorCount++;
          if (this.showErrors) {
            charSpans[this.currentCharIndex].classList.add('incorrect');
          }
        }
        
        // Move to the next character
        this.currentCharIndex++;
        
        // Update accuracy
        const accuracy = calculateAccuracy(this.correctCharCount, this.currentCharIndex);
        this.testAccuracy.textContent = `${accuracy}%`;
        
        // Play key sound
        playKeySound(char);
        
        // Check if we've reached the end of the text
        if (this.currentCharIndex >= this.originalText.length) {
          this.endTest();
        } else {
          // Update current character indicator
          this.renderText();
        }
      }
    }
    
    endTest() {
      // Stop the test
      this.testActive = false;
      clearInterval(this.timer);
      
      // Calculate final results
      const wpm = calculateWPM(this.currentCharIndex, this.timeElapsed);
      const accuracy = calculateAccuracy(this.correctCharCount, this.currentCharIndex);
      
      // Display results
      this.resultWPM.textContent = wpm;
      this.resultAccuracy.textContent = `${accuracy}%`;
      this.resultCorrect.textContent = this.correctCharCount;
      this.resultErrors.textContent = this.errorCount;
      
      // Show result overlay
      this.resultOverlay.classList.remove('hidden');
      
      // Save test result to history
      this.saveTestResult(wpm, accuracy);
    }
    
    saveTestResult(wpm, accuracy) {
      const result = {
        id: generateUniqueId(),
        date: new Date().toISOString(),
        wpm,
        accuracy,
        duration: this.timeElapsed,
        difficulty: this.difficultySelect.value,
        contentType: this.contentType,
        textLength: this.originalText.length,
        correctChars: this.correctCharCount,
        errors: this.errorCount
      };
      
      // Add to history
      this.typingHistory.unshift(result);
      
      // Limit history to 10 items
      if (this.typingHistory.length > 10) {
        this.typingHistory = this.typingHistory.slice(0, 10);
      }
      
      // Save to local storage
      saveToLocalStorage('typingHistory', this.typingHistory);
      
      // Update the history display
      this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
      const historyContainer = $('#typingHistory');
      historyContainer.innerHTML = '';
      
      if (this.typingHistory.length === 0) {
        historyContainer.innerHTML = `
          <div class="text-center text-gray-500 py-6">
            Your typing test history will appear here
          </div>
        `;
        return;
      }
      
      // Create history entries
      this.typingHistory.forEach(entry => {
        const date = new Date(entry.date);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        
        const historyItem = document.createElement('div');
        historyItem.className = 'bg-dark-600 p-3 rounded';
        historyItem.innerHTML = `
          <div class="flex justify-between items-center">
            <div>
              <div class="text-sm text-gray-400">${formattedDate}</div>
              <div class="mt-1 flex items-center">
                <span class="font-medium">${entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}</span>
                <span class="mx-2 text-gray-500">•</span>
                <span>${entry.contentType.charAt(0).toUpperCase() + entry.contentType.slice(1)}</span>
                <span class="mx-2 text-gray-500">•</span>
                <span>${formatTime(entry.duration)}</span>
              </div>
            </div>
            <div class="flex space-x-4">
              <div class="text-center">
                <div class="text-xl font-bold text-primary-400">${entry.wpm}</div>
                <div class="text-xs text-gray-400">WPM</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-primary-400">${entry.accuracy}%</div>
                <div class="text-xs text-gray-400">Accuracy</div>
              </div>
            </div>
          </div>
        `;
        
        historyContainer.appendChild(historyItem);
      });
    }
    
    resetTest() {
      // Hide result overlay
      this.resultOverlay.classList.add('hidden');
      
      // Generate new text and start again
      this.generateNewText();
      this.startCountdown();
    }
    
    showRandomTip() {
      this.tipContainer.textContent = getRandomTypingTip();
    }
    
    setTestDuration(seconds) {
      this.testDuration = seconds;
      saveToLocalStorage('testDuration', seconds);
    }
    
    setContentType(type) {
      this.contentType = type;
      saveToLocalStorage('contentType', type);
      this.generateNewText();
    }
    
    setShowErrors(show) {
      this.showErrors = show;
      saveToLocalStorage('showErrors', show);
      this.renderText();
    }
    
    clearHistory() {
      this.typingHistory = [];
      saveToLocalStorage('typingHistory', []);
      this.updateHistoryDisplay();
    }
  }