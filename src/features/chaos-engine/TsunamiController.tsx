'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '@/components/audio/AudioProvider';
import { AlertCircle, Terminal, Heart, AlertOctagon, Sparkles } from 'lucide-react';
import gsap from 'gsap';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function TsunamiController() {
  const { play, speak } = useSound();
  const { 
    tsunamiState, 
    setTsunamiState, 
    isTearing, 
    isBossFighting, 
    triggerShake, 
    triggerGlitch, 
    addPopup,
    clearPopups,
    popups
  } = useChaosStore();

  const [tsunamiTitle, setTsunamiTitle] = useState('tsunami aa gaya bhai teri toh lanka lagne wali hai system ki');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [debris, setDebris] = useState<{ id: number; char: string; x: number; y: number; scale: number; speed: number }[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // Keep track of original style transforms for restoration
  const originalStyles = useRef<{ element: HTMLElement; transform: string; transition: string; opacity: string }[]>([]);

  // Setup mount state for safe SSR/hydration in Next.js
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 1. Tsunami Event Trigger Hook: Automatically launches when active warning popups reach EXACTLY 5!
  useEffect(() => {
    if (popups.length >= 5 && tsunamiState === 'idle' && !isTearing && !isBossFighting) {
      initiateTsunami();
    }
  }, [popups.length, tsunamiState, isTearing, isBossFighting]);

  // 2. Initiate the 6-Stage Cinematic Tsunami Flow
  const initiateTsunami = async () => {
    // ==========================================
    // STAGE 1: EMOTIONAL WARNING (ONLY SPEAKS THE CUSTOM HINDI LINE)
    // ==========================================
    setTsunamiState('warning');
    setTsunamiTitle('tsunami aa gaya bhai teri toh lanka lagne wali hai system ki');
    
    // Visual alerts only - shake and glitch (No alarm bee-bee sound)
    triggerShake(5000);
    triggerGlitch(2500);

    // Wait 400ms for error popup to appear completely before speaking
    await sleep(400);

    // Speak the tsunami statement
    const hasHindi = typeof window !== 'undefined' && window.speechSynthesis &&
      window.speechSynthesis.getVoices().some(v => v.lang.startsWith('hi'));

    const tsunamiWarningText = hasHindi 
      ? 'सुनामी आ गया भाई! तेरी तो लंका लगने वाली है सिस्टम की!'
      : 'Tsunami aa gaya bhai, teri toh lanka lagne wali hai system ki!';

    // Wait for the custom speaking voice alert to finish
    await new Promise<void>((resolve) => {
      speak(tsunamiWarningText, () => resolve());
    });

    // Small delay after speaking ends, before the tsunami hits!
    await sleep(800);

    // ==========================================
    // STAGE 2: TSUNAMI ARRIVAL (2 Seconds)
    // ==========================================
    setTsunamiState('arrival');
    play('DIALUP');
    triggerShake(2000);

    await sleep(2000);

    // ==========================================
    // STAGE 3: DELULUMATCH COLLAPSE (1 Second)
    // ==========================================
    setTsunamiState('collapse');
    play('RIP');
    triggerShake(1000);

    // Select all elements tagged with data-emotional-object="true" globally
    const targetElements = document.querySelectorAll('[data-emotional-object="true"]');
    originalStyles.current = [];

    targetElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      // Save baseline styles
      originalStyles.current.push({
        element: htmlEl,
        transform: htmlEl.style.transform || '',
        transition: htmlEl.style.transition || '',
        opacity: htmlEl.style.opacity || '1'
      });

      // Apply physical horizontal leftward sweep (Surging from Right pushes left!)
      const randomX = -Math.random() * 500 - 350;  // Push violently leftwards (-350px to -850px)
      const randomY = (Math.random() - 0.5) * 150; // Gentle height floating drift
      const randomRot = -Math.random() * 45;       // Staggered counter-clockwise spin
      
      gsap.to(htmlEl, {
        x: randomX,
        y: randomY,
        rotation: randomRot,
        opacity: 0.15,
        duration: 1.4,
        ease: 'power2.out'
      });
    });

    await sleep(1000);

    // ==========================================
    // STAGE 4: UNDERWATER CHAOS STATE (3 Seconds)
    // ==========================================
    setTsunamiState('underwater');
    // Dissolve/Clear the 5 warning popups behind the liquid wall
    clearPopups();
    play('AMBIENCE'); // Starts/filters our beautiful romantic looping track!

    // Spawn floating romantic cyber-debris particles
    const debrisChars = ['💔', '🤡', '💬', '🫠', '🥀', '🩹', '💀', '👀', '📱', '🔒'];
    const newDebris = Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      char: debrisChars[i % debrisChars.length],
      x: Math.random() * 100, // percentage x coordinate
      y: 100,                 // start at bottom
      scale: Math.random() * 0.8 + 0.8,
      speed: Math.random() * 2.5 + 1.5
    }));
    setDebris(newDebris);

    await sleep(3000);

    // ==========================================
    // STAGE 5: EMOTIONAL VOID STATE (3.5 Seconds)
    // ==========================================
    setTsunamiState('void');
    setDebris([]);
    play('ERROR');

    // Glitch out target elements to complete void state
    originalStyles.current.forEach(({ element }) => {
      gsap.to(element, { opacity: 0, duration: 0.4 });
    });

    // Typewriter log simulation
    const logs = [
      '>> [SYS-RCC] RELATIONSHIP DATA CRITICAL FAULT...',
      '>> [SYS-RCC] PURGING ACTIVE SITUATIONSHIPS (5/5)...',
      '>> [SYS-RCC] PURGING EX STORY NOTIFICATIONS...',
      '>> [SYS-RCC] DRY TEXTING CACHE COMPLETED...',
      '>> [SYS-RCC] SYSTEM STABILITY: RESTORED 100%'
    ];

    setTerminalLogs([]);
    for (let i = 0; i < logs.length; i++) {
      await sleep(600);
      setTerminalLogs(prev => [...prev, logs[i]]);
      play('CLICK');
    }

    await sleep(1500);

    // ==========================================
    // STAGE 6: CINEMATIC RECONSTRUCTION (2.5 Seconds)
    // ==========================================
    setTsunamiState('reconstruction');
    setTerminalLogs([]);
    play('DIALUP');

    // Staggered reconstruction back to exact baseline
    originalStyles.current.forEach(({ element, transform, opacity }, index) => {
      gsap.to(element, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 1.8,
        delay: (index % 12) * 0.05,
        ease: 'elastic.out(1, 0.75)',
        onComplete: () => {
          // Restore exact base styling settings
          element.style.transform = transform;
          element.style.opacity = opacity;
        }
      });
    });

    await sleep(2500);

    // ==========================================
    // RESET TO IDLE (Completely Clean Screen!)
    // ==========================================
    setTsunamiState('idle');
    play('CLICK');
    addPopup({
      title: '🟢 STABILIZED',
      content: 'Emotional tsunami successfully handled. System matches restored. Carrying on.',
      x: 35,
      y: 40,
      type: 'alert'
    });
  };

  if (!mounted || tsunamiState === 'idle') return null;

  return createPortal(
    <AnimatePresence>
      {/* ⚠️ STAGE 1: WARNING NOTIFICATIONS OVERLAY */}
      {tsunamiState === 'warning' && (
        <div className="fixed inset-0 z-[999999999] pointer-events-none flex flex-col justify-center items-center bg-red-950/20 backdrop-blur-[1px] uppercase font-mono select-none">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="p-8 bg-black/90 border border-red-500 rounded-lg max-w-lg text-center space-y-5 shadow-[0_0_50px_rgba(239,68,68,0.4)] pointer-events-auto"
          >
            <AlertOctagon size={48} className="text-red-500 mx-auto animate-bounce" />
            
            {/* System and Emotional lines above the error! */}
            <div className="space-y-2 border-b border-zinc-900 pb-3 text-left">
              <div className="text-red-400 text-[10px] tracking-wider font-bold">
                ⚠️ EMOTIONAL INSTABILITY LEVELS CRITICAL
              </div>
              <div className="text-red-400 text-[10px] tracking-wider font-bold">
                ⚠️ SYSTEM DETECTED 5 ACTIVE PROBLEMS
              </div>
              <div className="text-red-400 text-[10px] tracking-wider font-bold">
                ⚠️ TOXICITY OVERFLOW IMMINENT - RE-CALIBRATING HEART CORES
              </div>
            </div>

            {/* Error Title */}
            <h3 className="text-red-500 text-2xl font-bold tracking-widest animate-pulse font-bebas uppercase max-w-md mx-auto leading-tight">
              {tsunamiTitle}
            </h3>
            
            <div className="text-[10px] text-zinc-600 animate-pulse pt-2 border-t border-zinc-900 text-center uppercase">
              5 SEVERE FLAWS TRIGGERED TSUNAMI...
            </div>
          </motion.div>
        </div>
      )}

      {/* 🌊 STAGE 2: HIGH-FIDELITY DYNAMIC TEXT OVERLAY FOR THREE.JS ENGINE */}
      {(tsunamiState === 'arrival' || tsunamiState === 'collapse') && (
        <div className="fixed inset-0 z-[999999999] pointer-events-none flex items-center justify-center select-none font-mono">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-6xl md:text-9xl font-bebas text-white tracking-[0.25em] font-bold uppercase drop-shadow-[0_0_30px_#FF007F] animate-pulse">
              LOVE TSUNAMI
            </h1>
            <p className="text-xs text-cyan-300 uppercase tracking-[0.3em] animate-flicker">
              ⚠️ REAL-TIME GPU FLUID CRASH SEQUENCE IN PROGRESS ⚠️
            </p>
          </motion.div>
        </div>
      )}

      {/* 🤿 STAGE 4: UNDERWATER GLOW STATE */}
      {tsunamiState === 'underwater' && (
        <div className="fixed inset-0 z-[999999999] bg-[#0c0316]/85 backdrop-blur-[6px] pointer-events-none flex items-center justify-center select-none font-mono">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FF007F]/20 via-transparent to-[#00FFFF]/20 pointer-events-none" />
          
          {/* Floating cyber debris particles */}
          {debris.map((deb) => (
            <motion.div
              key={deb.id}
              initial={{ x: `${deb.x}vw`, y: '110vh', rotate: 0 }}
              animate={{ y: '-20vh', rotate: 360 }}
              transition={{ repeat: Infinity, duration: deb.speed * 3, ease: 'linear' }}
              className="absolute text-3xl shrink-0 filter drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]"
              style={{ scale: deb.scale }}
            >
              {deb.char}
            </motion.div>
          ))}

          <div className="text-center space-y-3 z-10">
            <h2 className="text-[#00FFFF] text-2xl font-bold font-bebas tracking-[0.2em] animate-pulse">
              [ SUBJECT UNDERWATER - DISASTER STATE ]
            </h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
              Drowning in attachment overflow... low pass audio filter online
            </p>
          </div>
        </div>
      )}

      {/* 🌌 STAGE 5: EMOTIONAL VOID OS TERMINAL REBOOT */}
      {tsunamiState === 'void' && (
        <div className="fixed inset-0 z-[999999999] bg-black pointer-events-none flex flex-col justify-center items-center select-none font-mono text-zinc-400 p-6">
          <div className="w-full max-w-lg border border-zinc-800 p-6 bg-zinc-950/80 rounded relative shadow-[0_0_40px_rgba(255,0,127,0.1)]">
            <div className="absolute top-2 left-3 flex gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
              <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
            </div>
            
            <div className="absolute top-2 right-3 text-[8px] text-zinc-600 uppercase font-bold tracking-widest">
              EMOTIONAL OS v1.2
            </div>

            <div className="mt-4 space-y-2 text-xs uppercase leading-relaxed text-left text-pink-500/90 font-mono">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Terminal size={12} className="shrink-0 text-zinc-600" />
                  <span>{log}</span>
                </div>
              ))}
              
              <div className="flex gap-2 items-center">
                <span className="w-2 h-4 bg-zinc-400 animate-pulse inline-block" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 STAGE 6: RECONSTRUCTION ACTIVE OVERLAY */}
      {tsunamiState === 'reconstruction' && (
        <div className="fixed inset-0 z-[999999999] bg-black/60 pointer-events-none flex items-center justify-center select-none font-mono text-white">
          <div className="text-center space-y-4">
            <div className="relative inline-block w-16 h-16 border-2 border-dashed border-[#FF007F] border-t-transparent rounded-full animate-spin" />
            <h3 className="text-lg font-bebas text-pink-300 font-bold tracking-widest uppercase">
              Reconstructing structural layout fragments...
            </h3>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest animate-pulse">
              restoring profile cards & custom keypads to baseline
            </p>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
