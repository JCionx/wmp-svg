import React, { useRef, useState, useEffect, useCallback } from 'react';
import './Slider.css';

/**
 * Slider Component - A custom range slider for volume and seek controls
 * Replacement for WMPlayerSlider custom element
 */
const Slider = ({
  min = 0,
  max = 100,
  value = 0,
  step = 0,
  orientation = 'horizontal',
  disabled = false,
  onChange,
  onEditStart,
  onEditStop,
  className = '',
  title = '',
  ariaLabel = '',
  keyStep = null,
  keyStepCtrl = null,
  keyStepShift = null,
  constantThumb = false,
  circularThumb = false
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const trackFullRef = useRef(null);
  const thumbRef = useRef(null);

  // Sync value prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Apply step rounding
  const applyStep = useCallback((val) => {
    if (step <= 0) return val;
    return Math.round(val / step) * step;
  }, [step]);

  // Calculate value from position
  const getValueFromPosition = useCallback((clientX, clientY) => {
    const rect = sliderRef.current.getBoundingClientRect();
    let ratio;
    
    if (orientation === 'horizontal') {
      ratio = (clientX - rect.left) / rect.width;
    } else {
      ratio = 1 - (clientY - rect.top) / rect.height;
    }
    
    ratio = Math.max(0, Math.min(1, ratio));
    const rawValue = min + ratio * (max - min);
    return applyStep(rawValue);
  }, [orientation, min, max, applyStep]);

  // Update slider position
  const updateValue = useCallback((newValue) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    setCurrentValue(clampedValue);
    
    if (onChange) {
      onChange({ target: { value: clampedValue }, value: clampedValue });
    }
  }, [min, max, onChange]);

  // Drag handlers
  const handleDragStart = useCallback((e) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    if (onEditStart) {
      onEditStart();
    }

    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const newValue = getValueFromPosition(clientX, clientY);
    updateValue(newValue);
  }, [disabled, onEditStart, getValueFromPosition, updateValue]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging || disabled) return;
    
    e.preventDefault();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const newValue = getValueFromPosition(clientX, clientY);
    updateValue(newValue);
  }, [isDragging, disabled, getValueFromPosition, updateValue]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (onEditStop) {
      onEditStop();
    }
  }, [isDragging, onEditStop]);

  // Keyboard handler
  const handleKeyDown = useCallback((e) => {
    if (disabled) return;
    
    let delta = 0;
    const effectiveStep = step || 1;
    const effectiveKeyStep = keyStep !== null ? keyStep : effectiveStep;
    const effectiveKeyStepCtrl = keyStepCtrl !== null ? keyStepCtrl : effectiveStep;
    const effectiveKeyStepShift = keyStepShift !== null ? keyStepShift : effectiveStep;

    let stepSize = effectiveKeyStep;
    if (e.ctrlKey) stepSize = effectiveKeyStepCtrl;
    if (e.shiftKey) stepSize = effectiveKeyStepShift;

    const isHorizontal = orientation === 'horizontal';
    
    if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowUp')) {
      delta = stepSize;
    } else if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowDown')) {
      delta = -stepSize;
    } else if (e.key === 'Home') {
      updateValue(min);
      e.preventDefault();
      return;
    } else if (e.key === 'End') {
      updateValue(max);
      e.preventDefault();
      return;
    }

    if (delta !== 0) {
      e.preventDefault();
      updateValue(currentValue + delta);
    }
  }, [disabled, step, keyStep, keyStepCtrl, keyStepShift, orientation, currentValue, min, max, updateValue]);

  // Attach global drag handlers
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Calculate position percentage
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const classes = [
    'wmp-slider',
    orientation,
    disabled && 'disabled',
    isDragging && 'dragging',
    constantThumb && 'constant-thumb',
    circularThumb && 'circular-thumb',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={sliderRef}
      className={classes}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="slider"
      aria-label={ariaLabel || title}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={currentValue}
      aria-disabled={disabled}
      title={title}
      style={{
        '--value': currentValue,
        '--minimum': min,
        '--maximum': max,
        '--percentage': `${percentage}%`
      }}
    >
      <div className="track-bare"></div>
      <div 
        ref={trackFullRef}
        className="track-full" 
        style={{ 
          [orientation === 'horizontal' ? 'width' : 'height']: `${percentage}%` 
        }}
      ></div>
      <div 
        ref={thumbRef}
        className="thumb"
        style={{
          [orientation === 'horizontal' ? 'left' : 'bottom']: `${percentage}%`
        }}
      ></div>
    </div>
  );
};

export default Slider;
