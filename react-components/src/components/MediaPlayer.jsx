import React, { useRef, useState, useEffect, useCallback } from 'react';
import Slider from './Slider';
import {
  PlayPauseButton,
  StopButton,
  PreviousButton,
  NextButton,
  MuteButton,
  ShuffleToggle,
  LoopToggle,
  FullscreenButton
} from './MediaButtons';
import TimeDisplay from './TimeDisplay';
import { usePlaylist } from '../hooks/usePlaylist';
import './MediaPlayer.css';

/**
 * MediaPlayer Component - Complete media player with WMP-style controls
 * Replacement for WMPlayerElement custom element
 */
const MediaPlayer = ({
  src = '',
  autoplay = false,
  poster = '',
  theme = 'dark',
  overlayControls = 'video-only',
  className = '',
  style = {},
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onDurationChange,
  onVolumeChange
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Fast playback state
  const [fastPlaybackType, setFastPlaybackType] = useState(0); // -1 = rewind, 0 = none, 1 = fast-forward
  const fastPlaybackTimeoutRef = useRef(null);
  const fastRewindIntervalRef = useRef(null);
  const wasPausedBeforeFastPlayback = useRef(false);
  
  // Playlist hook
  const playlist = usePlaylist();
  
  // Constants
  const FAST_FORWARD_DELAY = 1000; // ms to hold before fast-forward starts
  const FAST_FORWARD_SPEED = 5;
  const FAST_REWIND_SPEED = 5;
  const FAST_REWIND_INTERVAL = 1000; // ms between rewind steps
  const PREVIOUS_BUTTON_TIME_THRESHOLD = 3; // seconds
  
  // Initialize playlist if src is provided
  useEffect(() => {
    if (src && playlist.empty) {
      playlist.add({ src, poster });
    }
  }, [src, poster]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Load current playlist item
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playlist.currentItem) return;
    
    const item = playlist.currentItem;
    video.src = item.src || '';
    video.poster = item.poster || poster;
    video.currentTime = 0;
    
    if (!isStopped && !isPlaying) {
      // Auto-play next item if we were playing
      handlePlay();
    }
  }, [playlist.currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onTimeUpdate) onTimeUpdate({ currentTime: video.currentTime });
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
      if (onDurationChange) onDurationChange({ duration: video.duration });
    };
    
    const handleEnded = () => {
      const hasNext = playlist.toNext();
      if (!hasNext) {
        setIsPlaying(false);
        setIsStopped(true);
      }
      if (onEnded) onEnded();
    };
    
    const handleVolumeChange = () => {
      setVolume(video.volume * 100);
      setIsMuted(video.muted);
      if (onVolumeChange) onVolumeChange({ volume: video.volume, muted: video.muted });
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('volumechange', handleVolumeChange);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [playlist, onTimeUpdate, onDurationChange, onEnded, onVolumeChange]);
  
  // Play handler
  const handlePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.play().then(() => {
      setIsPlaying(true);
      setIsStopped(false);
      if (onPlay) onPlay();
    }).catch(err => {
      console.error('Play failed:', err);
    });
  }, [onPlay]);
  
  // Pause handler
  const handlePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.pause();
    setIsPlaying(false);
    if (onPause) onPause();
  }, [onPause]);
  
  // Toggle play/pause
  const handlePlayPause = useCallback(() => {
    if (isStopped) {
      handlePlay();
    } else if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, isStopped, handlePlay, handlePause]);
  
  // Stop handler
  const handleStop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setIsStopped(true);
    setCurrentTime(0);
  }, []);
  
  // Previous handler
  const handlePrevious = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.currentTime > PREVIOUS_BUTTON_TIME_THRESHOLD) {
      // Jump to start of current item
      video.currentTime = 0;
    } else {
      // Go to previous item
      playlist.toPrev();
    }
  }, [playlist, PREVIOUS_BUTTON_TIME_THRESHOLD]);
  
  // Next handler
  const handleNext = useCallback(() => {
    playlist.toNext();
  }, [playlist]);
  
  // Fast-forward start
  const handleFastForwardStart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    fastPlaybackTimeoutRef.current = setTimeout(() => {
      wasPausedBeforeFastPlayback.current = video.paused;
      if (video.paused) {
        video.play();
      }
      video.playbackRate = FAST_FORWARD_SPEED;
      setFastPlaybackType(1);
      setPlaybackRate(FAST_FORWARD_SPEED);
    }, FAST_FORWARD_DELAY);
  }, [FAST_FORWARD_DELAY, FAST_FORWARD_SPEED]);
  
  // Fast-forward stop
  const handleFastForwardStop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (fastPlaybackTimeoutRef.current) {
      clearTimeout(fastPlaybackTimeoutRef.current);
      fastPlaybackTimeoutRef.current = null;
    }
    
    if (fastPlaybackType === 1) {
      video.playbackRate = 1;
      if (wasPausedBeforeFastPlayback.current) {
        video.pause();
      }
      setFastPlaybackType(0);
      setPlaybackRate(1);
    }
  }, [fastPlaybackType]);
  
  // Rewind start
  const handleRewindStart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    fastPlaybackTimeoutRef.current = setTimeout(() => {
      wasPausedBeforeFastPlayback.current = video.paused;
      video.pause();
      setFastPlaybackType(-1);
      
      fastRewindIntervalRef.current = setInterval(() => {
        if (video.currentTime > 0) {
          video.currentTime = Math.max(0, video.currentTime - FAST_REWIND_SPEED);
        } else {
          handleRewindStop();
        }
      }, FAST_REWIND_INTERVAL);
    }, FAST_FORWARD_DELAY);
  }, [FAST_FORWARD_DELAY, FAST_REWIND_SPEED, FAST_REWIND_INTERVAL]);
  
  // Rewind stop
  const handleRewindStop = useCallback(() => {
    if (fastPlaybackTimeoutRef.current) {
      clearTimeout(fastPlaybackTimeoutRef.current);
      fastPlaybackTimeoutRef.current = null;
    }
    
    if (fastRewindIntervalRef.current) {
      clearInterval(fastRewindIntervalRef.current);
      fastRewindIntervalRef.current = null;
    }
    
    if (fastPlaybackType === -1) {
      const video = videoRef.current;
      if (!wasPausedBeforeFastPlayback.current && video) {
        video.play();
      }
      setFastPlaybackType(0);
    }
  }, [fastPlaybackType]);
  
  // Seek handler
  const handleSeek = useCallback((e) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = e.value;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);
  
  // Volume change handler
  const handleVolumeChange = useCallback((e) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = e.value / 100;
    video.volume = newVolume;
    setVolume(e.value);
  }, []);
  
  // Mute toggle handler
  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);
  
  // Fullscreen handler
  const handleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen().catch(err => {
        console.error('Fullscreen failed:', err);
      });
    }
  }, []);
  
  // Shuffle toggle
  const handleShuffleToggle = useCallback(() => {
    playlist.toggleShuffle();
  }, [playlist]);
  
  // Loop toggle
  const handleLoopToggle = useCallback(() => {
    playlist.toggleLoop();
  }, [playlist]);
  
  // Autoplay
  useEffect(() => {
    if (autoplay && !isPlaying) {
      handlePlay();
    }
  }, [autoplay]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const containerClasses = [
    'wmp-player',
    `theme-${theme}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      <div className="main">
        <div className="content">
          <video ref={videoRef} poster={poster}></video>
        </div>
        
        <Slider
          className="seek"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          disabled={isStopped || !duration}
          title="Seek"
          ariaLabel="Seek"
        />
        
        <div className="gutter-left">
          <TimeDisplay currentTime={currentTime} duration={duration} />
        </div>
        
        <div className="controls">
          <div className="left">
            <ShuffleToggle isActive={playlist.shuffle} onClick={handleShuffleToggle} />
            <LoopToggle isActive={playlist.loop} onClick={handleLoopToggle} />
            <hr />
            <StopButton onClick={handleStop} disabled={isStopped} />
            <PreviousButton
              onClick={handlePrevious}
              onRewindStart={handleRewindStart}
              onRewindStop={handleRewindStop}
              disabled={isStopped}
            />
          </div>
          
          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={handlePlayPause}
            disabled={false}
          />
          
          <div className="right">
            <NextButton
              onClick={handleNext}
              onFastForwardStart={handleFastForwardStart}
              onFastForwardStop={handleFastForwardStop}
              disabled={isStopped}
            />
            <MuteButton isMuted={isMuted} onClick={handleMuteToggle} />
            <Slider
              className="volume constant-thumb circular-thumb"
              min={0}
              max={100}
              value={volume}
              onChange={handleVolumeChange}
              title="Volume"
              ariaLabel="Volume"
            />
          </div>
        </div>
        
        <div className="gutter-right">
          <div className="rearrangeables">
            <FullscreenButton onClick={handleFullscreen} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
