/**
 * Main script - initializes all components
 */

document.addEventListener('DOMContentLoaded', () => {
    // Tab navigation elements
    const keyTestTab = $('#keyTestTab');
    const typingTestTab = $('#typingTestTab');
    const settingsTab = $('#settingsTab');
    
    const keyTestSection = $('#keyTestSection');
    const typingTestSection = $('#typingTestSection');
    const settingsSection = $('#settingsSection');
    
    // Initialize components
    const keyboardTest = new KeyboardTest();
    const typingTest = new TypingTest();
    const settings = new Settings(keyboardTest, typingTest);
    
    // Tab switching functionality
    keyTestTab.addEventListener('click', () => {
      // Update tab styles
      keyTestTab.classList.add('border-primary-500', 'text-primary-400');
      keyTestTab.classList.remove('border-gray-700', 'text-gray-400');
      
      typingTestTab.classList.remove('border-primary-500', 'text-primary-400');
      typingTestTab.classList.add('border-gray-700', 'text-gray-400');
      
      settingsTab.classList.remove('border-primary-500', 'text-primary-400');
      settingsTab.classList.add('border-gray-700', 'text-gray-400');
      
      // Show/hide sections
      keyTestSection.classList.remove('hidden');
      typingTestSection.classList.add('hidden');
      settingsSection.classList.add('hidden');
      
      // Save active tab to local storage
      saveToLocalStorage('activeTab', 'keyTest');
    });
    
    typingTestTab.addEventListener('click', () => {
      // Update tab styles
      typingTestTab.classList.add('border-primary-500', 'text-primary-400');
      typingTestTab.classList.remove('border-gray-700', 'text-gray-400');
      
      keyTestTab.classList.remove('border-primary-500', 'text-primary-400');
      keyTestTab.classList.add('border-gray-700', 'text-gray-400');
      
      settingsTab.classList.remove('border-primary-500', 'text-primary-400');
      settingsTab.classList.add('border-gray-700', 'text-gray-400');
      
      // Show/hide sections
      typingTestSection.classList.remove('hidden');
      keyTestSection.classList.add('hidden');
      settingsSection.classList.add('hidden');
      
      // Update typing history display
      typingTest.updateHistoryDisplay();
      
      // Save active tab to local storage
      saveToLocalStorage('activeTab', 'typingTest');
    });
    
    settingsTab.addEventListener('click', () => {
      // Update tab styles
      settingsTab.classList.add('border-primary-500', 'text-primary-400');
      settingsTab.classList.remove('border-gray-700', 'text-gray-400');
      
      keyTestTab.classList.remove('border-primary-500', 'text-primary-400');
      keyTestTab.classList.add('border-gray-700', 'text-gray-400');
      
      typingTestTab.classList.remove('border-primary-500', 'text-primary-400');
      typingTestTab.classList.add('border-gray-700', 'text-gray-400');
      
      // Show/hide sections
      settingsSection.classList.remove('hidden');
      keyTestSection.classList.add('hidden');
      typingTestSection.classList.add('hidden');
      
      // Save active tab to local storage
      saveToLocalStorage('activeTab', 'settings');
    });
    
    // Load active tab from local storage
    const activeTab = getFromLocalStorage('activeTab', 'keyTest');
    if (activeTab === 'keyTest') {
      keyTestTab.click();
    } else if (activeTab === 'typingTest') {
      typingTestTab.click();
    } else if (activeTab === 'settings') {
      settingsTab.click();
    }
    
    // Responsive design adjustments
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      
      // Adjust keyboard container
      const keyboardContainer = document.querySelector('.keyboard-container');
      if (keyboardContainer) {
        if (isMobile) {
          keyboardContainer.classList.add('overflow-x-auto');
        } else {
          keyboardContainer.classList.remove('overflow-x-auto');
        }
      }
      
      // Other responsive adjustments can be added here
    };
    
    // Initial call and event listener for resize
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 200));
    
    // Preload sounds
    const preloadSounds = () => {
      const sounds = [
        $('#keyPressSound'),
        $('#keyBackspaceSound'),
        $('#keyEnterSound')
      ];
      
      sounds.forEach(sound => {
        sound.load();
      });
    };
    
    preloadSounds();
    
    // Show a welcome message for first-time visitors
    const isFirstVisit = !getFromLocalStorage('hasVisitedBefore', false);
    if (isFirstVisit) {
      // Set the flag so this message doesn't show again
      saveToLocalStorage('hasVisitedBefore', true);
      
      // Create welcome message
      const welcomeMessage = document.createElement('div');
      welcomeMessage.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50';
      welcomeMessage.innerHTML = `
        <div class="bg-dark-700 p-6 rounded-lg max-w-md mx-4">
          <h2 class="text-2xl font-bold mb-4">Welcome to Keyboard Tester!</h2>
          <p class="mb-4">This application helps you test your keyboard and improve your typing speed.</p>
          <ul class="list-disc list-inside mb-4 text-gray-300">
            <li>Test individual keys on the Keyboard tab</li>
            <li>Measure your typing speed on the Typing Test tab</li>
            <li>Customize the app in the Settings tab</li>
          </ul>
          <button id="welcomeCloseBtn" class="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition-colors w-full">
            Get Started
          </button>
        </div>
      `;
      
      document.body.appendChild(welcomeMessage);
      
      // Add close event
      $('#welcomeCloseBtn').addEventListener('click', () => {
        welcomeMessage.remove();
      });
    }
  });