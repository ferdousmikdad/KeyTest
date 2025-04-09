/**
 * Utility functions for the keyboard tester application
 */

// DOM helper functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Local storage helpers
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return defaultValue;
  }
};

// Time formatting
const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};

const formatTimeMMSS = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Event handling
const debounce = (func, delay) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};

// Random text generation for typing test
const getRandomText = (difficulty = 'medium', type = 'random') => {
  // Common words by difficulty
  const words = {
    easy: [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she'
    ],
    medium: [
      'about', 'would', 'there', 'their', 'what', 'which', 'when', 'make', 'like', 'time',
      'just', 'know', 'people', 'take', 'year', 'them', 'some', 'want', 'how', 'good',
      'could', 'first', 'very', 'after', 'work', 'new', 'because', 'these', 'two', 'other'
    ],
    hard: [
      'available', 'subsequently', 'international', 'particularly', 'development', 
      'understand', 'opportunity', 'collection', 'experience', 'technology',
      'organization', 'immediately', 'responsibility', 'significantly', 'traditional',
      'comprehensive', 'conversation', 'environmental', 'consideration', 'fundamental'
    ]
  };

  // Code snippets for code type
  const codeSnippets = [
    `function calculateSum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}`,
    `const filterUniqueItems = (array) => {
  return [...new Set(array)];
};`,
    `class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  sayHello() {
    return \`Hello, my name is \${this.name}\`;
  }
}`,
    `const getData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};`
  ];

  // Famous quotes for quotes type
  const quotes = [
    "Life is what happens when you're busy making other plans.",
    "The way to get started is to quit talking and begin doing.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "If life were predictable it would cease to be life, and be without flavor.",
    "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
    "Your time is limited, so don't waste it living someone else's life.",
    "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
    "The future belongs to those who believe in the beauty of their dreams."
  ];

  if (type === 'code') {
    // For code, just return a random snippet
    return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
  } else if (type === 'quotes') {
    // For quotes, return 1-2 random quotes based on difficulty
    const numberOfQuotes = difficulty === 'easy' ? 1 : (difficulty === 'medium' ? 1 : 2);
    let selectedQuotes = [];
    for (let i = 0; i < numberOfQuotes; i++) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      selectedQuotes.push(quotes[randomIndex]);
    }
    return selectedQuotes.join(' ');
  } else {
    // For random text, generate sentences with words of appropriate difficulty
    const selectedWords = words[difficulty];
    const sentenceCount = difficulty === 'easy' ? 3 : (difficulty === 'medium' ? 5 : 7);
    
    let text = '';
    for (let i = 0; i < sentenceCount; i++) {
      // Generate a sentence with 5-12 words based on difficulty
      const wordCount = difficulty === 'easy' ? 5 + Math.floor(Math.random() * 3) : 
                      (difficulty === 'medium' ? 6 + Math.floor(Math.random() * 4) : 
                                               8 + Math.floor(Math.random() * 5));
      
      let sentence = '';
      for (let j = 0; j < wordCount; j++) {
        const word = selectedWords[Math.floor(Math.random() * selectedWords.length)];
        sentence += (j === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
        sentence += (j < wordCount - 1) ? ' ' : '.';
      }
      
      text += sentence + ' ';
    }
    return text.trim();
  }
};

// Play sound based on key
const playKeySound = (key) => {
  const soundsEnabled = getFromLocalStorage('soundsEnabled', false);
  if (!soundsEnabled) return;
  
  let sound;
  if (key === 'Backspace') {
    sound = $('#keyBackspaceSound');
  } else if (key === 'Enter') {
    sound = $('#keyEnterSound');
  } else {
    sound = $('#keyPressSound');
  }
  
  sound.currentTime = 0;
  sound.play().catch(e => console.log('Error playing sound:', e));
};

// Generate a random ID for tracking
const generateUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Calculate WPM based on characters typed
const calculateWPM = (characters, seconds) => {
  // Standard: 5 characters = 1 word
  if (seconds === 0) return 0;
  const words = characters / 5;
  const minutes = seconds / 60;
  return Math.round(words / minutes);
};

// Calculate typing accuracy percentage
const calculateAccuracy = (correctChars, totalChars) => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

// Get a random tip for typing
const getRandomTypingTip = () => {
  const tips = [
    "Focus on accuracy over speed when starting out.",
    "Keep your fingers on the home row (ASDF JKL;) for better efficiency.",
    "Look at the screen, not your keyboard, to improve typing speed.",
    "Practice regularly rather than in long, infrequent sessions.",
    "Use all fingers, including your pinky fingers, for faster typing.",
    "Take short breaks during long typing sessions to avoid fatigue.",
    "Posture matters - sit up straight while typing to reduce strain.",
    "Try typing to music to develop rhythm and consistency.",
    "Use keyboard shortcuts to increase your overall efficiency.",
    "Challenge yourself with progressively harder texts."
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
};