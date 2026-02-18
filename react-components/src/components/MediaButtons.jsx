import React from 'react';
import './MediaButtons.css';

/**
 * PlayPauseButton Component
 */
export const PlayPauseButton = ({ isPlaying, onClick, disabled = false }) => {
  return (
    <button
      className="wmp-button play-pause"
      onClick={onClick}
      disabled={disabled}
      title={isPlaying ? 'Pause' : 'Play'}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  );
};

/**
 * StopButton Component
 */
export const StopButton = ({ onClick, disabled = false }) => {
  return (
    <button
      className="wmp-button basic-button stop"
      onClick={onClick}
      disabled={disabled}
      title="Stop"
      aria-label="Stop"
    >
      Stop
    </button>
  );
};

/**
 * PreviousButton Component - with rewind support on hold
 */
export const PreviousButton = ({ onClick, onRewindStart, onRewindStop, disabled = false }) => {
  const handleMouseDown = (e) => {
    if (onRewindStart && !disabled) {
      onRewindStart(e);
    }
  };

  const handleMouseUp = (e) => {
    if (onRewindStop && !disabled) {
      onRewindStop(e);
    }
  };

  return (
    <button
      className="wmp-button prev-rw"
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      disabled={disabled}
      title="Previous (press and hold to rewind)"
      aria-label="Previous"
    >
      Previous
    </button>
  );
};

/**
 * NextButton Component - with fast-forward support on hold
 */
export const NextButton = ({ onClick, onFastForwardStart, onFastForwardStop, disabled = false }) => {
  const handleMouseDown = (e) => {
    if (onFastForwardStart && !disabled) {
      onFastForwardStart(e);
    }
  };

  const handleMouseUp = (e) => {
    if (onFastForwardStop && !disabled) {
      onFastForwardStop(e);
    }
  };

  return (
    <button
      className="wmp-button next-ff"
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      disabled={disabled}
      title="Next (press and hold to fast-forward)"
      aria-label="Next"
    >
      Next
    </button>
  );
};

/**
 * MuteButton Component
 */
export const MuteButton = ({ isMuted, onClick, disabled = false }) => {
  return (
    <button
      className={`wmp-button basic-button mute ${isMuted ? 'muted' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={isMuted ? 'Unmute' : 'Mute'}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
      aria-pressed={isMuted}
      role="switch"
    >
      {isMuted ? 'Unmute' : 'Mute'}
    </button>
  );
};

/**
 * ShuffleToggle Component
 */
export const ShuffleToggle = ({ isActive, onClick, disabled = false }) => {
  return (
    <button
      className={`wmp-button basic-button shuffle ${isActive ? 'active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title="Shuffle"
      aria-label="Shuffle"
      aria-pressed={isActive}
      role="switch"
    >
      Shuffle
    </button>
  );
};

/**
 * LoopToggle Component
 */
export const LoopToggle = ({ isActive, onClick, disabled = false }) => {
  return (
    <button
      className={`wmp-button basic-button loop ${isActive ? 'active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title="Loop"
      aria-label="Loop"
      aria-pressed={isActive}
      role="switch"
    >
      Loop
    </button>
  );
};

/**
 * FullscreenButton Component
 */
export const FullscreenButton = ({ onClick, disabled = false }) => {
  return (
    <button
      className="wmp-button basic-button fullscreen"
      onClick={onClick}
      disabled={disabled}
      title="View full screen"
      aria-label="View full screen"
    >
      Fullscreen
    </button>
  );
};
