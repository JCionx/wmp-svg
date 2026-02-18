# React Components Project Structure

This directory contains React components that recreate the Windows Media Player 11/12 UI.

## 📁 Directory Structure

```
react-components/
├── src/
│   ├── components/          # All React components
│   │   ├── MediaPlayer.jsx  # Main player component
│   │   ├── MediaPlayer.css
│   │   ├── Slider.jsx       # Custom range slider
│   │   ├── Slider.css
│   │   ├── MediaButtons.jsx # All button components
│   │   ├── MediaButtons.css
│   │   ├── TimeDisplay.jsx  # Time display component
│   │   └── TimeDisplay.css
│   ├── hooks/              # Custom React hooks
│   │   └── usePlaylist.js  # Playlist management hook
│   ├── demo/               # Demo application
│   │   ├── App.jsx
│   │   └── App.css
│   └── index.js            # Main export file
├── public/                 # Static assets
├── dist/                   # Build output
├── index.html              # Demo entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Installation

```bash
cd react-components
npm install
```

### Development

Run the demo application:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building

Build the library for production:

```bash
npm run build
```

This creates:
- `dist/index.js` - CommonJS bundle
- `dist/index.esm.js` - ES module bundle
- `dist/style.css` - Combined styles

## 📦 Component Overview

### MediaPlayer
The complete media player with all controls integrated. Wraps a video element and provides WMP-style UI.

**Key Features:**
- Playlist management
- Play/pause/stop controls
- Seek and volume sliders
- Shuffle and loop modes
- Fast-forward/rewind on button hold
- Fullscreen support
- ARIA accessibility

### Slider
Custom range slider for seek and volume controls.

**Key Features:**
- Drag, touch, and keyboard support
- Customizable step sizes
- ARIA accessibility
- Horizontal/vertical orientation

### MediaButtons
Collection of button components:
- PlayPauseButton
- StopButton
- PreviousButton (with rewind)
- NextButton (with fast-forward)
- MuteButton
- ShuffleToggle
- LoopToggle
- FullscreenButton

### TimeDisplay
Formatted time display for current time and duration.

### usePlaylist Hook
Manages media playlists with shuffle and loop functionality.

## 🎨 Styling

All components use CSS modules for styling. The styles are inspired by the Windows Media Player 11/12 design:

- Glassy button effects
- Gradient backgrounds
- Smooth transitions and hover states
- Responsive design

## 🧪 Testing the Components

The demo application (`src/demo/App.jsx`) provides a complete example of using the MediaPlayer component. You can:

1. Play/pause media
2. Toggle shuffle and loop modes
3. Seek through the media
4. Adjust volume
5. Enter fullscreen mode
6. Test keyboard navigation

## 🔧 Customization

### Theme Customization

The MediaPlayer accepts a `theme` prop. Currently supports:
- `"dark"` - Dark theme (default)

You can extend the CSS to add more themes.

### Layout Customization

Override CSS classes to customize the layout:

```jsx
<MediaPlayer
  className="my-custom-player"
  style={{ maxWidth: '800px' }}
  // ...
/>
```

## 📝 Usage Example

```jsx
import React from 'react';
import { MediaPlayer } from 'wmp-svg-react';

function MyApp() {
  const handlePlay = () => {
    console.log('Playback started');
  };

  const handlePause = () => {
    console.log('Playback paused');
  };

  return (
    <div>
      <h1>My Video Player</h1>
      <MediaPlayer
        src="path/to/video.mp4"
        poster="path/to/poster.jpg"
        theme="dark"
        autoplay={false}
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </div>
  );
}

export default MyApp;
```

## 🤝 Comparison with Original

### Original (Custom Elements)
- `<wm-player>` custom element
- `<wm-slider>` custom element
- WMPlaylist class
- Plain JavaScript
- Shadow DOM

### React Version
- React components
- Hooks for state management
- JSX syntax
- Virtual DOM
- CSS modules

Both implementations provide the same functionality with similar APIs.

## 📚 API Documentation

See [README.md](./README.md) for complete API documentation including:
- Component props
- Hook returns
- Event callbacks
- Keyboard shortcuts

## 🐛 Known Issues

- SVG sprites from the original project are not yet integrated (using CSS-based graphics)
- Some advanced theming features are pending
- MediaSession API support is planned

## 🔮 Future Enhancements

- [ ] Integrate original SVG sprites
- [ ] Add more themes (light, library, now-playing)
- [ ] MediaSession API integration
- [ ] Subtitle/caption support
- [ ] Advanced playlist UI
- [ ] Visualization effects

## 📄 License

MIT - Same as the original wmp-svg project
