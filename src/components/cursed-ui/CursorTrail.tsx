'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';
import { useChaosStore } from '@/store/useChaosStore';

const TOXIC_EMOJIS = ['🤡', '💔', '🌹', '🫠', '📱', '🔥', '🍷'];

export default function CursorTrail() {
  const [isMounted, setIsMounted] = useState(false);
  const { heartbreakIndex, isShaking } = useChaosStore();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shiverX = useMotionValue(0);
  const shiverY = useMotionValue(0);

  // Smooth springs for the main cursor
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // GSAP Cursor personality shiver / anxiety jitter loop
  useEffect(() => {
    if (!isMounted) return;

    let ctx = gsap.context(() => {
      // Jitter trigger speed and amplitude scales based on heartbreak anxiety index
      const jitterScale = heartbreakIndex > 70 ? 4 : (heartbreakIndex > 40 ? 2.5 : 0.5);
      
      const jitterLoop = gsap.to({}, {
        duration: 0.05,
        repeat: -1,
        onRepeat: () => {
          if (heartbreakIndex > 20 || isShaking) {
            shiverX.set((Math.random() - 0.5) * jitterScale);
            shiverY.set((Math.random() - 0.5) * jitterScale);
          } else {
            shiverX.set(0);
            shiverY.set(0);
          }
        }
      });
    });

    return () => ctx.revert();
  }, [isMounted, heartbreakIndex, isShaking, shiverX, shiverY]);

  if (!isMounted) return null;

  return (
    <>
      {/* Main Corrupted Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[999999] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: shiverX,
          translateY: shiverY,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="text-2xl rotate-12 drop-shadow-[0_0_8px_#FF007F]">🫣</div>
      </motion.div>

      {/* Trailing Delulu Emojis */}
      {TOXIC_EMOJIS.map((emoji, index) => (
        <TrailingEmoji 
          key={index} 
          emoji={emoji} 
          mouseX={mouseX} 
          mouseY={mouseY} 
          delay={index * 0.04} 
        />
      ))}
    </>
  );
}

function TrailingEmoji({ 
  emoji, 
  mouseX, 
  mouseY, 
  delay 
}: { 
  emoji: string; 
  mouseX: any; 
  mouseY: any; 
  delay: number 
}) {
  const x = useSpring(mouseX, { damping: 22 + delay * 110, stiffness: 120 - delay * 25 });
  const y = useSpring(mouseY, { damping: 22 + delay * 110, stiffness: 120 - delay * 25 });

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999998] opacity-40 text-sm select-none"
      style={{
        x,
        y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {emoji}
    </motion.div>
  );
}
