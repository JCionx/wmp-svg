import React from 'react';
import './TimeDisplay.css';

/**
 * TimeDisplay Component - Shows current time and duration
 */
const TimeDisplay = ({ currentTime = 0, duration = 0, showDuration = true }) => {
  const formatTime = (seconds) => {
    if (!isFinite(seconds)) return '--:--';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <time className="wmp-time-display current-time" aria-label="Current time">
      <span className="current">{formatTime(currentTime)}</span>
      {showDuration && duration > 0 && (
        <>
          <span className="separator"> / </span>
          <span className="duration">{formatTime(duration)}</span>
        </>
      )}
    </time>
  );
};

export default TimeDisplay;
