import React from 'react';
import ReactDOM from 'react-dom/client';
import MediaPlayer from '../components/MediaPlayer';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Windows Media Player SVG React Components</h1>
        <p>A React recreation of the Windows Media Player 11/12 UI using SVG graphics</p>
      </header>
      
      <main className="app-main">
        <section className="demo-section">
          <h2>Media Player Demo</h2>
          <div className="player-container">
            <MediaPlayer
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
              theme="dark"
              autoplay={false}
              onPlay={() => console.log('Playing')}
              onPause={() => console.log('Paused')}
              onEnded={() => console.log('Ended')}
            />
          </div>
        </section>
        
        <section className="info-section">
          <h2>Features</h2>
          <ul>
            <li>✅ Complete media player with WMP-style UI</li>
            <li>✅ Custom slider components for seek and volume</li>
            <li>✅ Playlist management with shuffle and loop</li>
            <li>✅ Fast-forward and rewind (hold Next/Previous buttons)</li>
            <li>✅ Keyboard navigation support</li>
            <li>✅ Fullscreen mode</li>
            <li>✅ ARIA accessibility attributes</li>
            <li>✅ Responsive design</li>
          </ul>
        </section>
        
        <section className="usage-section">
          <h2>Usage</h2>
          <pre><code>{`import { MediaPlayer } from 'wmp-svg-react';

function MyApp() {
  return (
    <MediaPlayer
      src="path/to/video.mp4"
      poster="path/to/poster.jpg"
      theme="dark"
      autoplay={false}
      onPlay={() => console.log('Playing')}
      onPause={() => console.log('Paused')}
    />
  );
}`}</code></pre>
        </section>
        
        <section className="components-section">
          <h2>Available Components</h2>
          <div className="component-list">
            <div className="component-card">
              <h3>MediaPlayer</h3>
              <p>Complete media player with all controls</p>
            </div>
            <div className="component-card">
              <h3>Slider</h3>
              <p>Custom range slider for seek/volume</p>
            </div>
            <div className="component-card">
              <h3>PlayPauseButton</h3>
              <p>Toggle playback state</p>
            </div>
            <div className="component-card">
              <h3>StopButton</h3>
              <p>Stop playback</p>
            </div>
            <div className="component-card">
              <h3>PreviousButton</h3>
              <p>Previous track (hold to rewind)</p>
            </div>
            <div className="component-card">
              <h3>NextButton</h3>
              <p>Next track (hold to fast-forward)</p>
            </div>
            <div className="component-card">
              <h3>ShuffleToggle</h3>
              <p>Enable/disable shuffle mode</p>
            </div>
            <div className="component-card">
              <h3>LoopToggle</h3>
              <p>Enable/disable loop mode</p>
            </div>
            <div className="component-card">
              <h3>MuteButton</h3>
              <p>Toggle mute state</p>
            </div>
            <div className="component-card">
              <h3>FullscreenButton</h3>
              <p>Toggle fullscreen mode</p>
            </div>
            <div className="component-card">
              <h3>TimeDisplay</h3>
              <p>Show current time and duration</p>
            </div>
            <div className="component-card">
              <h3>usePlaylist Hook</h3>
              <p>Manage media playlist</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="app-footer">
        <p>© 2024 WMP SVG React Components - MIT License</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
