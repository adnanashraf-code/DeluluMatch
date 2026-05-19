'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '@/components/audio/AudioProvider';

const MELTDOWN_EMOJIS = ['💔', '🤡', '💀', '😭', '👻', '🥀', '🫠', '🔥', '⚠️', '❌', '🩹', '💢'];
const GLITCH_CHARS = '!@#$%^&*ERROR_FATAL_CRASH';

interface RainDrop {
  id: number;
  x: number;
  char: string;
  speed: number;
  size: number;
  opacity: number;
  delay: number;
}

export default function EmotionalMeltdown() {
  const { play } = useSound();
  const { popups, triggerShake, triggerGlitch, clearPopups } = useChaosStore();
  const [isActive, setIsActive] = useState(false);
  const [stage, setStage] = useState(0); // 0=idle, 1=warning, 2=rain, 3=overload, 4=reset
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const [glitchText, setGlitchText] = useState('');
  const hasTriggeredRef = useRef(false);
  const intervalRef = useRef<any>(null);

  // Trigger when 5 popups accumulate
  useEffect(() => {
    if (popups.length >= 5 && !hasTriggeredRef.current && !isActive) {
      hasTriggeredRef.current = true;
      startMeltdown();
    }
  }, [popups.length, isActive]);

  const generateRainDrops = useCallback(() => {
    const drops: RainDrop[] = [];
    for (let i = 0; i < 60; i++) {
      drops.push({
        id: i,
        x: Math.random() * 100,
        char: MELTDOWN_EMOJIS[Math.floor(Math.random() * MELTDOWN_EMOJIS.length)],
        speed: 2 + Math.random() * 6,
        size: 12 + Math.random() * 20,
        opacity: 0.3 + Math.random() * 0.7,
        delay: Math.random() * 3,
      });
    }
    return drops;
  }, []);

  const startMeltdown = async () => {
    setIsActive(true);

    // STAGE 1: WARNING FLASH (2s)
    setStage(1);
    play('SYSTEM_ALARM');
    triggerShake(2000);
    triggerGlitch(1500);

    // Glitch text scramble
    intervalRef.current = setInterval(() => {
      const len = 20 + Math.floor(Math.random() * 30);
      let text = '';
      for (let i = 0; i < len; i++) {
        text += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }
      setGlitchText(text);
    }, 80);

    await new Promise(r => setTimeout(r, 2000));

    // STAGE 2: EMOJI RAIN (4s)
    setStage(2);
    setRainDrops(generateRainDrops());
    triggerShake(4000);

    await new Promise(r => setTimeout(r, 4000));

    // STAGE 3: OVERLOAD SCREEN (2s)
    setStage(3);
    play('ERROR');
    triggerGlitch(2000);

    await new Promise(r => setTimeout(r, 2000));

    // STAGE 4: RESET
    setStage(4);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    await new Promise(r => setTimeout(r, 800));
    
    clearPopups();
    setIsActive(false);
    setStage(0);
    setRainDrops([]);
    setGlitchText('');
    hasTriggeredRef.current = false;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {/* STAGE 1: RED WARNING FLASH */}
      {stage === 1 && (
        <motion.div
          key="meltdown-warning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999999] pointer-events-none"
        >
          {/* Pulsing red overlay */}
          <div className="absolute inset-0 bg-red-900/30 animate-pulse" />
          
          {/* Warning bar top */}
          <motion.div 
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            className="absolute top-0 left-0 right-0 h-12 bg-red-600 flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(255,0,0,0.6)]"
          >
            <span className="text-white font-mono text-xs tracking-[0.3em] uppercase font-bold animate-pulse">
              ⚠️ EMOTIONAL INSTABILITY CRITICAL — MELTDOWN IMMINENT ⚠️
            </span>
          </motion.div>

          {/* Warning bar bottom */}
          <motion.div 
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            className="absolute bottom-0 left-0 right-0 h-12 bg-red-600 flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(255,0,0,0.6)]"
          >
            <span className="text-white font-mono text-xs tracking-[0.3em] uppercase font-bold animate-pulse">
              🚨 HEARTBREAK INDEX EXCEEDED MAXIMUM THRESHOLD 🚨
            </span>
          </motion.div>

          {/* Center glitch text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-mono text-red-500/40 text-[8px] max-w-lg text-center break-all leading-relaxed select-none">
              {glitchText}
            </div>
          </div>
        </motion.div>
      )}

      {/* STAGE 2: EMOJI MATRIX RAIN */}
      {stage === 2 && (
        <motion.div
          key="meltdown-rain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999999] pointer-events-none overflow-hidden"
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Falling emojis */}
          {rainDrops.map((drop) => (
            <motion.div
              key={drop.id}
              initial={{ y: -50, opacity: 0 }}
              animate={{ 
                y: window?.innerHeight + 100 || 1000, 
                opacity: [0, drop.opacity, drop.opacity, 0] 
              }}
              transition={{ 
                duration: drop.speed, 
                delay: drop.delay, 
                ease: 'linear',
                repeat: 1,
              }}
              className="absolute select-none"
              style={{ 
                left: `${drop.x}%`, 
                fontSize: `${drop.size}px`,
                filter: `drop-shadow(0 0 8px rgba(255,0,127,0.5))`,
                zIndex: 9999,
              }}
            >
              {drop.char}
            </motion.div>
          ))}

          {/* Side scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,127,0.03)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] animate-pulse" />
          
          {/* Center message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="bg-black/80 border-2 border-[#FF007F] px-8 py-4 rounded-lg shadow-[0_0_60px_rgba(255,0,127,0.4)]"
            >
              <div className="text-[#FF007F] font-bebas text-3xl tracking-[0.2em] uppercase text-center">
                💔 EMOTIONAL MELTDOWN IN PROGRESS 💔
              </div>
              <div className="text-zinc-400 font-mono text-[10px] text-center mt-2 uppercase tracking-widest">
                Heartbreak particles saturating viewport...
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* STAGE 3: OVERLOAD FLASH */}
      {stage === 3 && (
        <motion.div
          key="meltdown-overload"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999999] pointer-events-auto select-none flex items-center justify-center bg-black/50"
        >
          <motion.div
            animate={{ 
              backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(255,0,127,0.2)', 'rgba(0,0,0,0.8)', 'rgba(255,0,0,0.3)'],
            }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="absolute inset-0"
          />
          
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
            className="text-center z-10"
          >
            <div className="text-red-500 font-bebas text-5xl md:text-7xl tracking-[0.3em] uppercase font-bold" 
                 style={{ textShadow: '0 0 30px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.4)' }}>
              SYSTEM OVERLOAD
            </div>
            <div className="text-white font-mono text-sm mt-4 tracking-widest uppercase animate-pulse">
              RESETTING EMOTIONAL CORE...
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* STAGE 4: FADE TO BLACK RESET */}
      {stage === 4 && (
        <motion.div
          key="meltdown-reset"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[999999999] bg-black pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}
