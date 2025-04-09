# Advanced Keyboard Tester

A responsive web application for testing keyboard keys and improving typing speed with a clean, dark theme interface.

![Advanced Keyboard Tester Screenshot](https://via.placeholder.com/800x450/121212/4096ff?text=Advanced+Keyboard+Tester)

## Features

### Keyboard Testing

- Visual keyboard layout with realistic key appearance
- Real-time key highlighting with animation
- Detailed key usage statistics
- Session time tracking
- Sound feedback (optional)

### Typing Speed Test

- Monkeytype-style interface
- Words Per Minute (WPM) calculation
- Accuracy measurement
- Multiple difficulty levels
- Real-time typing feedback
- Mini keyboard visualization
- Test history tracking

### Customization

- Dark theme with lighter option
- Primary color selection
- Font size adjustment
- Animation toggle
- Sound effects toggle
- Error display options

## Technology Stack

- HTML5
- CSS3 with Tailwind CSS
- Vanilla JavaScript

## File Structure

```
advanced-keyboard-tester/
│
├── index.html              # Main HTML file
│
├── js/
│   ├── script.js           # Main app initialization
│   ├── utils.js            # Utility functions
│   ├── keyboardTest.js     # Keyboard testing functionality
│   ├── typingTest.js       # Typing test functionality
│   └── settings.js         # Settings and customization
│
└── README.md               # Project documentation
```

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/advanced-keyboard-tester.git
   ```

2. Navigate to the project directory:

   ```
   cd advanced-keyboard-tester
   ```

3. Open `index.html` in your web browser or serve with a local server:
   ```
   # Using Python's built-in server
   python -m http.server
   ```

## Usage

### Keyboard Test

1. Select the "Key Test" tab
2. Press any key on your keyboard to test
3. View real-time statistics on key usage
4. Use the "Clear" button to reset the display

### Typing Test

1. Select the "Typing Test" tab
2. Choose difficulty level (Easy, Medium, Hard)
3. Click "Start Test" to begin
4. Type the displayed text as quickly and accurately as possible
5. View your WPM, accuracy, and errors at the end of the test

### Settings

1. Select the "Settings" tab
2. Customize appearance (color, theme, font size)
3. Adjust typing test settings (duration, content type)
4. Toggle animations and sounds
5. Reset data if needed

## Customization

The application can be customized via the settings interface or by modifying the Tailwind configuration in the HTML file:

```javascript
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          /* color values */
        },
        secondary: {
          /* color values */
        },
        dark: {
          /* color values */
        },
      },
    },
  },
};
```

## Browser Compatibility

The application works on all modern browsers including:

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Sound effects from [Maykbrito](https://github.com/maykbrito)
- Inspired by [Monkeytype](https://monkeytype.com/) for the typing test interface
