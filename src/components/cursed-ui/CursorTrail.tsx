'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '../audio/AudioProvider';
import gsap from 'gsap';

export default function CursorTrail() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { play } = useSound();
  
  const { 
    cursorScale, 
    incrementCursorScale, 
    heartbreakIndex, 
    isShaking 
  } = useChaosStore();

  // Mouse coordinate refs for the high-performance RAF lerp loop
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  // Ghost trail arrays for trailing duplication glitches
  const [ghosts, setGhosts] = useState<{ x: number; y: number }[]>([]);
  const [touchRipples, setTouchRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const cursorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);

    const checkMobile = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouch || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;

      // ⚠️ Button Panic & Dodging Mechanics (Emergent Frustration)
      if (cursorScale > 1.3) {
        const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
        if (hoveredElement) {
          const button = hoveredElement.closest('button, a, input[type="submit"]') as HTMLElement;
          if (button) {
            // Panic vibration shiver based on cursor weight
            const amplitude = (cursorScale - 1) * 12;
            const shiverX = (Math.random() - 0.5) * amplitude;
            const shiverY = (Math.random() - 0.5) * amplitude;
            
            button.style.transition = 'transform 0.05s ease-out';
            button.style.transform = `translate3d(${shiverX}px, ${shiverY}px, 0)`;

            // Extreme dodging when cursor is giant!
            if (cursorScale > 1.8 && Math.random() > 0.6) {
              const rect = button.getBoundingClientRect();
              const btnCenterX = rect.left + rect.width / 2;
              const btnCenterY = rect.top + rect.height / 2;
              
              // Vector away from cursor
              const dirX = btnCenterX - e.clientX;
              const dirY = btnCenterY - e.clientY;
              const distance = Math.max(1, Math.sqrt(dirX * dirX + dirY * dirY));
              
              // Push button 25px away from giant cursor
              const pushX = (dirX / distance) * 28;
              const pushY = (dirY / distance) * 28;
              
              button.style.transform = `translate3d(${pushX}px, ${pushY}px, 0)`;
              
              // Trigger slight glitch sound
              if (Math.random() > 0.95) play('ERROR');
            }
          }
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      incrementCursorScale();
      
      // Play a heavy unstable hum that increases pitch with cursor size!
      play('CLICK');
      if (cursorScale > 1.8 && Math.random() > 0.5) {
        play('ERROR');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Mobile touch ripples handler
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const newRipple = {
          id: Math.random(),
          x: touch.clientX,
          y: touch.clientY
        };
        setTouchRipples((prev) => [...prev, newRipple].slice(-5));
        
        // Touch lag simulation: occasionally lag the touch interaction
        if (Math.random() > 0.75) {
          play('ERROR');
        }
      }
    };
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [cursorScale, incrementCursorScale, play]);

  // High-performance RequestAnimationFrame Loop for custom drag physics & trails
  useEffect(() => {
    if (!isMounted || isMobile) return;

    const animateCursor = () => {
      // 1. Calculate dynamic drag factor based on cursorScale!
      // Base t is 0.15 (snappy), drops down to 0.02 (absurdly heavy & laggy!)
      const dragFactor = Math.max(0.018, 0.15 - (cursorScale - 1) * 0.05);

      currentX.current += (targetX.current - currentX.current) * dragFactor;
      currentY.current += (targetY.current - currentY.current) * dragFactor;

      // Add a tiny random anxiety jitter based on heartbreakIndex
      const jitterScale = heartbreakIndex > 70 ? 5 : (heartbreakIndex > 40 ? 2.5 : 0);
      const jitterX = (Math.random() - 0.5) * jitterScale;
      const jitterY = (Math.random() - 0.5) * jitterScale;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX.current + jitterX}px, ${currentY.current + jitterY}px, 0) scale(${cursorScale})`;
      }

      // 2. Generate trailing duplicates if the scale is large (Annoying / Absurd stages)
      if (cursorScale > 1.4 && Math.random() > 0.7) {
        setGhosts((prev) => {
          const newGhost = { x: currentX.current, y: currentY.current };
          return [...prev, newGhost].slice(-Math.floor(cursorScale * 3));
        });
      } else if (cursorScale <= 1.4) {
        setGhosts([]);
      }

      requestRef.current = requestAnimationFrame(animateCursor);
    };

    requestRef.current = requestAnimationFrame(animateCursor);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isMounted, isMobile, cursorScale, heartbreakIndex]);

  if (!isMounted) return null;

  // Mobile rendering: touch ripples to simulate unstable input lags
  if (isMobile) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[999999]">
        {touchRipples.map((rip) => (
          <motion.div
            key={rip.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-8 h-8 rounded-full border border-pink-500 bg-pink-500/10 shadow-[0_0_15px_#FF007F]"
            style={{ left: rip.x - 16, top: rip.y - 16 }}
          />
        ))}
      </div>
    );
  }

  // Stage classes based on cursor size
  const getStageTitle = () => {
    if (cursorScale < 1.3) return 'Stage 1: Stable';
    if (cursorScale < 1.7) return 'Stage 2: Anxious';
    if (cursorScale < 2.2) return 'Stage 3: Corrupted';
    return 'Stage 4: ABSURD DELUSION';
  };

  const glowColor = cursorScale > 2.0 
    ? 'rgba(255, 0, 127, 0.6)' 
    : (cursorScale > 1.4 ? 'rgba(138, 43, 226, 0.4)' : 'rgba(0, 255, 255, 0.2)');

  return (
    <>
      {/* 1. Main Custom Rage Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[999999] select-none origin-center mix-blend-screen"
        style={{
          marginLeft: '-16px',
          marginTop: '-16px',
          filter: `drop-shadow(0 0 ${8 * cursorScale}px ${glowColor})`,
          transition: 'transform 0.05s ease-out'
        }}
      >
        {/* Cursor Graphic: Glitchy emoji or toxic pointer */}
        <div className="relative w-full h-full flex items-center justify-center">
          <span className="text-2xl select-none rotate-12">
            {cursorScale > 2.2 ? '🫠' : (cursorScale > 1.6 ? '💔' : (cursorScale > 1.2 ? '🤡' : '🫣'))}
          </span>

          {/* Instability metrics floating next to the cursor */}
          {cursorScale > 1.3 && (
            <div className="absolute left-8 top-0 whitespace-nowrap bg-black/90 border border-pink-500/30 rounded px-1 text-[7px] text-pink-400 font-mono tracking-tighter uppercase scale-75">
              <span>{getStageTitle()}</span>
              <br />
              <span>Instability: {Math.floor((cursorScale - 1) * 100)}%</span>
            </div>
          )}

          {/* Glitch energy particles expanding around cursor */}
          {cursorScale > 1.8 && (
            <div className="absolute inset-[-10px] border border-cyan-500/20 rounded-full animate-ping pointer-events-none" />
          )}
        </div>
      </div>

      {/* 2. Trailing duplicate ghosts (Glitched duplicates at annoying/absurd scale) */}
      {ghosts.map((ghost, idx) => (
        <div
          key={idx}
          className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[999998] opacity-25 select-none mix-blend-color-dodge"
          style={{
            transform: `translate3d(${ghost.x}px, ${ghost.y}px, 0) scale(${cursorScale * 0.85})`,
            marginLeft: '-16px',
            marginTop: '-16px',
          }}
        >
          <span className="text-xl rotate-12 opacity-60">
            {idx % 2 === 0 ? '💔' : '🤡'}
          </span>
        </div>
      ))}
    </>
  );
}
