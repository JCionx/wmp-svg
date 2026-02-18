import { useState, useCallback, useEffect } from 'react';

/**
 * usePlaylist Hook - Manages media playlist with shuffle and loop
 * Replacement for WMPlaylist class
 */
export const usePlaylist = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [shuffleIndices, setShuffleIndices] = useState([]);
  const [playedIndices, setPlayedIndices] = useState(new Set());

  // Generate shuffle indices
  const generateShuffleIndices = useCallback((length, currentIdx) => {
    const indices = Array.from({ length }, (_, i) => i);
    // Remove current index from shuffle
    const filteredIndices = indices.filter(i => i !== currentIdx);
    
    // Fisher-Yates shuffle
    for (let i = filteredIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredIndices[i], filteredIndices[j]] = [filteredIndices[j], filteredIndices[i]];
    }
    
    return filteredIndices;
  }, []);

  // Add item to playlist
  const add = useCallback((item) => {
    setItems(prev => [...prev, item]);
  }, []);

  // Clear playlist
  const clear = useCallback(() => {
    setItems([]);
    setCurrentIndex(0);
    setShuffleIndices([]);
    setPlayedIndices(new Set());
  }, []);

  // Insert item at specific position
  const insertAt = useCallback((index, item) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems.splice(index, 0, item);
      return newItems;
    });
  }, []);

  // Remove item
  const remove = useCallback((index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    if (index === currentIndex && currentIndex >= items.length - 1) {
      setCurrentIndex(Math.max(0, items.length - 2));
    }
  }, [currentIndex, items.length]);

  // Move item to new position
  const moveItemTo = useCallback((fromIndex, toIndex) => {
    setItems(prev => {
      const newItems = [...prev];
      const [item] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, item);
      return newItems;
    });
  }, []);

  // Replace all items
  const replace = useCallback((newItems) => {
    setItems(newItems);
    setCurrentIndex(0);
    setShuffleIndices([]);
    setPlayedIndices(new Set());
  }, []);

  // Get item at index
  const item = useCallback((index) => {
    return items[index] || null;
  }, [items]);

  // Get current item
  const currentItem = items[currentIndex] || null;

  // Navigate to next item
  const toNext = useCallback(() => {
    if (items.length === 0) return false;

    if (shuffle) {
      // Shuffle mode
      if (shuffleIndices.length === 0) {
        setShuffleIndices(generateShuffleIndices(items.length, currentIndex));
      }
      
      const availableIndices = shuffleIndices.filter(idx => !playedIndices.has(idx));
      
      if (availableIndices.length > 0) {
        const nextIndex = availableIndices[0];
        setCurrentIndex(nextIndex);
        setPlayedIndices(prev => new Set([...prev, nextIndex]));
        setShuffleIndices(prev => prev.slice(1));
        return true;
      } else if (loop) {
        // Reset shuffle and start over
        setPlayedIndices(new Set());
        const newShuffleIndices = generateShuffleIndices(items.length, currentIndex);
        setShuffleIndices(newShuffleIndices);
        const nextIndex = newShuffleIndices[0];
        setCurrentIndex(nextIndex);
        setPlayedIndices(new Set([nextIndex]));
        return true;
      }
      return false;
    } else {
      // Normal mode
      const nextIndex = currentIndex + 1;
      if (nextIndex < items.length) {
        setCurrentIndex(nextIndex);
        return true;
      } else if (loop) {
        setCurrentIndex(0);
        return true;
      }
      return false;
    }
  }, [items.length, shuffle, shuffleIndices, playedIndices, currentIndex, loop, generateShuffleIndices]);

  // Navigate to previous item
  const toPrev = useCallback(() => {
    if (items.length === 0) return false;

    if (shuffle) {
      // In shuffle mode, go to previous in history if available
      // For simplicity, just go to a random unplayed track or wrap
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      setCurrentIndex(prevIndex);
      return true;
    } else {
      // Normal mode
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        setCurrentIndex(prevIndex);
        return true;
      } else if (loop) {
        setCurrentIndex(items.length - 1);
        return true;
      }
      return false;
    }
  }, [items.length, shuffle, currentIndex, loop]);

  // Mark current item as played (for shuffle)
  const markAsPlayed = useCallback(() => {
    setPlayedIndices(prev => new Set([...prev, currentIndex]));
  }, [currentIndex]);

  // Get index of item
  const indexOf = useCallback((searchItem) => {
    return items.findIndex(item => item === searchItem);
  }, [items]);

  // Convert to array
  const toArray = useCallback(() => {
    return [...items];
  }, [items]);

  // Toggle loop
  const toggleLoop = useCallback(() => {
    setLoop(prev => !prev);
  }, []);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      const newShuffle = !prev;
      if (newShuffle) {
        // Generate new shuffle indices when enabling
        setShuffleIndices(generateShuffleIndices(items.length, currentIndex));
        setPlayedIndices(new Set([currentIndex]));
      } else {
        // Clear shuffle state when disabling
        setShuffleIndices([]);
        setPlayedIndices(new Set());
      }
      return newShuffle;
    });
  }, [items.length, currentIndex, generateShuffleIndices]);

  // Update shuffle indices when playlist changes
  useEffect(() => {
    if (shuffle && items.length > 0) {
      setShuffleIndices(generateShuffleIndices(items.length, currentIndex));
    }
  }, [items.length, shuffle, currentIndex, generateShuffleIndices]);

  return {
    // State
    items,
    currentIndex,
    currentItem,
    loop,
    shuffle,
    length: items.length,
    size: items.length,
    empty: items.length === 0,
    
    // Methods
    add,
    clear,
    insertAt,
    remove,
    moveItemTo,
    replace,
    item,
    toNext,
    toPrev,
    markAsPlayed,
    indexOf,
    toArray,
    setLoop,
    setShuffle,
    toggleLoop,
    toggleShuffle,
    setCurrentIndex
  };
};

export default usePlaylist;
