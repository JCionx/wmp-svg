# WMP SVG React Components

React components recreating the Windows Media Player 11/12 UI using SVG graphics. This package provides a complete media player with WMP-style controls, ready to use in React applications.

## Features

- ✅ Complete media player with WMP-style UI
- ✅ Custom slider components for seek and volume control
- ✅ Playlist management with shuffle and loop modes
- ✅ Fast-forward and rewind (hold Next/Previous buttons)
- ✅ Keyboard navigation support
- ✅ Fullscreen mode
- ✅ ARIA accessibility attributes
- ✅ Responsive design
- ✅ Customizable theme support

## Installation

```bash
npm install wmp-svg-react
```

Or with yarn:

```bash
yarn add wmp-svg-react
```

## Quick Start

```jsx
import React from 'react';
import { MediaPlayer } from 'wmp-svg-react';

function App() {
  return (
    <MediaPlayer
      src="path/to/video.mp4"
      poster="path/to/poster.jpg"
      theme="dark"
      autoplay={false}
      onPlay={() => console.log('Playing')}
      onPause={() => console.log('Paused')}
      onEnded={() => console.log('Ended')}
    />
  );
}

export default App;
```

## Components

### MediaPlayer

The main media player component with all controls integrated.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | `''` | Source URL for the media |
| `autoplay` | boolean | `false` | Auto-play media on load |
| `poster` | string | `''` | Poster image URL |
| `theme` | string | `'dark'` | Player theme |
| `overlayControls` | string | `'video-only'` | Control overlay mode |
| `className` | string | `''` | Additional CSS classes |
| `style` | object | `{}` | Inline styles |
| `onPlay` | function | - | Callback when playback starts |
| `onPause` | function | - | Callback when playback pauses |
| `onEnded` | function | - | Callback when playback ends |
| `onTimeUpdate` | function | - | Callback on time update |
| `onDurationChange` | function | - | Callback on duration change |
| `onVolumeChange` | function | - | Callback on volume change |

**Example:**

```jsx
<MediaPlayer
  src="video.mp4"
  poster="poster.jpg"
  theme="dark"
  onPlay={() => console.log('Started playing')}
  onPause={() => console.log('Paused')}
/>
```

### Slider

A custom range slider component used for seek and volume controls.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` | number | `0` | Minimum value |
| `max` | number | `100` | Maximum value |
| `value` | number | `0` | Current value |
| `step` | number | `0` | Step size (0 = no stepping) |
| `orientation` | string | `'horizontal'` | Slider orientation |
| `disabled` | boolean | `false` | Disable the slider |
| `onChange` | function | - | Value change callback |
| `onEditStart` | function | - | Drag start callback |
| `onEditStop` | function | - | Drag end callback |
| `className` | string | `''` | Additional CSS classes |
| `title` | string | `''` | Tooltip text |
| `ariaLabel` | string | `''` | ARIA label |
| `keyStep` | number | `null` | Arrow key step size |
| `keyStepCtrl` | number | `null` | Ctrl+Arrow step size |
| `keyStepShift` | number | `null` | Shift+Arrow step size |
| `constantThumb` | boolean | `false` | Always show thumb |
| `circularThumb` | boolean | `false` | Circular thumb shape |

**Example:**

```jsx
<Slider
  min={0}
  max={100}
  value={volume}
  onChange={(e) => setVolume(e.value)}
  ariaLabel="Volume"
/>
```

### Button Components

Individual button components for custom player layouts.

#### PlayPauseButton

```jsx
<PlayPauseButton
  isPlaying={true}
  onClick={handlePlayPause}
  disabled={false}
/>
```

#### StopButton

```jsx
<StopButton
  onClick={handleStop}
  disabled={false}
/>
```

#### PreviousButton

Includes rewind functionality when held down.

```jsx
<PreviousButton
  onClick={handlePrevious}
  onRewindStart={handleRewindStart}
  onRewindStop={handleRewindStop}
  disabled={false}
/>
```

#### NextButton

Includes fast-forward functionality when held down.

```jsx
<NextButton
  onClick={handleNext}
  onFastForwardStart={handleFFStart}
  onFastForwardStop={handleFFStop}
  disabled={false}
/>
```

#### MuteButton

```jsx
<MuteButton
  isMuted={isMuted}
  onClick={handleMuteToggle}
  disabled={false}
/>
```

#### ShuffleToggle

```jsx
<ShuffleToggle
  isActive={shuffle}
  onClick={handleShuffleToggle}
  disabled={false}
/>
```

#### LoopToggle

```jsx
<LoopToggle
  isActive={loop}
  onClick={handleLoopToggle}
  disabled={false}
/>
```

#### FullscreenButton

```jsx
<FullscreenButton
  onClick={handleFullscreen}
  disabled={false}
/>
```

### TimeDisplay

Displays current time and duration.

```jsx
<TimeDisplay
  currentTime={45}
  duration={180}
  showDuration={true}
/>
```

## Hooks

### usePlaylist

A hook for managing media playlists with shuffle and loop support.

**Returns:**

| Property/Method | Type | Description |
|----------------|------|-------------|
| `items` | array | Playlist items |
| `currentIndex` | number | Current item index |
| `currentItem` | object | Current playlist item |
| `loop` | boolean | Loop mode state |
| `shuffle` | boolean | Shuffle mode state |
| `length` | number | Playlist length |
| `empty` | boolean | Is playlist empty |
| `add(item)` | function | Add item to playlist |
| `clear()` | function | Clear playlist |
| `insertAt(index, item)` | function | Insert item at index |
| `remove(index)` | function | Remove item |
| `moveItemTo(from, to)` | function | Move item |
| `replace(items)` | function | Replace all items |
| `item(index)` | function | Get item at index |
| `toNext()` | function | Navigate to next |
| `toPrev()` | function | Navigate to previous |
| `markAsPlayed()` | function | Mark as played (shuffle) |
| `indexOf(item)` | function | Find item index |
| `toArray()` | function | Convert to array |
| `toggleLoop()` | function | Toggle loop mode |
| `toggleShuffle()` | function | Toggle shuffle mode |
| `setCurrentIndex(index)` | function | Set current index |

**Example:**

```jsx
import { usePlaylist } from 'wmp-svg-react';

function MyPlayer() {
  const playlist = usePlaylist();
  
  useEffect(() => {
    playlist.add({ src: 'video1.mp4' });
    playlist.add({ src: 'video2.mp4' });
    playlist.add({ src: 'video3.mp4' });
  }, []);
  
  return (
    <div>
      <button onClick={playlist.toNext}>Next</button>
      <button onClick={playlist.toPrev}>Previous</button>
      <button onClick={playlist.toggleShuffle}>
        Shuffle: {playlist.shuffle ? 'On' : 'Off'}
      </button>
      <button onClick={playlist.toggleLoop}>
        Loop: {playlist.loop ? 'On' : 'Off'}
      </button>
    </div>
  );
}
```

## Keyboard Navigation

The player supports keyboard navigation:

- **Space**: Play/Pause
- **Arrow Keys**: Navigate slider (with Ctrl/Shift for different step sizes)
- **Home**: Jump to minimum
- **End**: Jump to maximum

## Development

To run the demo locally:

```bash
npm install
npm run dev
```

To build the library:

```bash
npm run build
```

## License

MIT

## Credits

Based on the original WMP SVG graphics project by JCionx, recreating the glassy buttons and theming of Windows Media Player 11 and 12 using SVG graphics.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Related

- Original WMP SVG project: [JCionx/wmp-svg](https://github.com/JCionx/wmp-svg)
