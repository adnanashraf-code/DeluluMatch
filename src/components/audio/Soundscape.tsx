'use client';

import { useEffect, useState } from 'react';
import { useSound } from './AudioProvider';

export default function Soundscape() {
  const { play } = useSound();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Attempt immediate autoplay on system load/mount
  useEffect(() => {
    try {
      play('AMBIENCE');
    } catch (e) {
      console.warn("[DeluluMatch Soundscape] Immediate autoplay blocked, waiting for user gesture:", e);
    }
  }, [play]);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        play('AMBIENCE');
        setHasInteracted(true);
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted, play]);

  return null; // Invisible component
}
