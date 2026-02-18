import React, { useRef, useState, useEffect, useCallback } from 'react';
import Slider from './Slider';
import {
  PlayPauseButton,
  StopButton,
  PreviousButton,
  NextButton,
  MuteButton,
  ShuffleToggle,
  LoopToggle
} from './MediaButtons';
import TimeDisplay from './TimeDisplay';
import { usePlaylist } from '../hooks/usePlaylist';
import './AudioPlayer.css';

/**
 * AudioPlayer Component - Audio player with WMP-style controls
 * Shows album cover and track title from metadata
 */
const AudioPlayer = ({
  src = '',
  autoplay = false,
  albumCover = '',
  theme = 'dark',
  className = '',
  style = {},
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onDurationChange,
  onVolumeChange,
  onMetadataLoad
}) => {
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Audio metadata
  const [trackTitle, setTrackTitle] = useState('');
  const [currentAlbumCover, setCurrentAlbumCover] = useState(albumCover);
  
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
      playlist.add({ src, albumCover });
    }
  }, [src, albumCover]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Load current playlist item
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playlist.currentItem) return;
    
    const item = playlist.currentItem;
    audio.src = item.src || '';
    audio.currentTime = 0;
    setCurrentAlbumCover(item.albumCover || albumCover);
    
    if (!isStopped && !isPlaying) {
      // Auto-play next item if we were playing
      handlePlay();
    }
  }, [playlist.currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Extract metadata from audio file
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleLoadedMetadata = async () => {
      // Try to extract title from MediaMetadata API
      let title = '';
      
      if ('mediaSession' in navigator) {
        // Check if the audio has metadata
        try {
          // For now, we'll use a basic approach - extract from filename or use default
          const filename = audio.src.split('/').pop().split('?')[0];
          title = decodeURIComponent(filename).replace(/\.[^/.]+$/, '');
        } catch (err) {
          console.error('Error extracting metadata:', err);
        }
      }
      
      setTrackTitle(title || 'Unknown Track');
      
      if (onMetadataLoad) {
        onMetadataLoad({ title });
      }
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onMetadataLoad]);
  
  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (onTimeUpdate) onTimeUpdate({ currentTime: audio.currentTime });
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
      if (onDurationChange) onDurationChange({ duration: audio.duration });
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
      setVolume(audio.volume * 100);
      setIsMuted(audio.muted);
      if (onVolumeChange) onVolumeChange({ volume: audio.volume, muted: audio.muted });
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('volumechange', handleVolumeChange);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [playlist, onTimeUpdate, onDurationChange, onEnded, onVolumeChange]);
  
  // Play handler
  const handlePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.play().then(() => {
      setIsPlaying(true);
      setIsStopped(false);
      if (onPlay) onPlay();
    }).catch(err => {
      console.error('Play failed:', err);
    });
  }, [onPlay]);
  
  // Pause handler
  const handlePause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.pause();
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
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setIsStopped(true);
    setCurrentTime(0);
  }, []);
  
  // Previous handler
  const handlePrevious = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (audio.currentTime > PREVIOUS_BUTTON_TIME_THRESHOLD) {
      // Jump to start of current item
      audio.currentTime = 0;
    } else {
      // Go to previous item
      playlist.toPrev();
    }
  }, [playlist]);
  
  // Next handler
  const handleNext = useCallback(() => {
    playlist.toNext();
  }, [playlist]);
  
  // Fast-forward start
  const handleFastForwardStart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    fastPlaybackTimeoutRef.current = setTimeout(() => {
      wasPausedBeforeFastPlayback.current = audio.paused;
      if (audio.paused) {
        audio.play();
      }
      audio.playbackRate = FAST_FORWARD_SPEED;
      setFastPlaybackType(1);
      setPlaybackRate(FAST_FORWARD_SPEED);
    }, FAST_FORWARD_DELAY);
  }, []);
  
  // Fast-forward stop
  const handleFastForwardStop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (fastPlaybackTimeoutRef.current) {
      clearTimeout(fastPlaybackTimeoutRef.current);
      fastPlaybackTimeoutRef.current = null;
    }
    
    if (fastPlaybackType === 1) {
      audio.playbackRate = 1;
      if (wasPausedBeforeFastPlayback.current) {
        audio.pause();
      }
      setFastPlaybackType(0);
      setPlaybackRate(1);
    }
  }, [fastPlaybackType]);
  
  // Rewind start
  const handleRewindStart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    fastPlaybackTimeoutRef.current = setTimeout(() => {
      wasPausedBeforeFastPlayback.current = audio.paused;
      audio.pause();
      setFastPlaybackType(-1);
      
      fastRewindIntervalRef.current = setInterval(() => {
        if (audio.currentTime > 0) {
          audio.currentTime = Math.max(0, audio.currentTime - FAST_REWIND_SPEED);
        } else {
          handleRewindStop();
        }
      }, FAST_REWIND_INTERVAL);
    }, FAST_FORWARD_DELAY);
  }, []);
  
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
      const audio = audioRef.current;
      if (!wasPausedBeforeFastPlayback.current && audio) {
        audio.play();
      }
      setFastPlaybackType(0);
    }
  }, [fastPlaybackType]);
  
  // Seek handler
  const handleSeek = useCallback((e) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = e.value;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);
  
  // Volume change handler
  const handleVolumeChange = useCallback((e) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = e.value / 100;
    audio.volume = newVolume;
    setVolume(e.value);
  }, []);
  
  // Mute toggle handler
  const handleMuteToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
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
    'wmp-audio-player',
    `theme-${theme}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      <div className="main">
        <div className="content">
          <audio ref={audioRef}></audio>
          {currentAlbumCover && (
            <img 
              src={currentAlbumCover} 
              alt="Album Cover" 
              className="album-cover"
            />
          )}
          {trackTitle && (
            <div className="track-info">
              <div className="track-title">{trackTitle}</div>
            </div>
          )}
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
            {/* Audio player doesn't need fullscreen button */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
