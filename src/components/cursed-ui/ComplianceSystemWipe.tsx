'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '@/components/audio/AudioProvider';

export default function ComplianceSystemWipe() {
  const { play } = useSound();
  const { popups, triggerShake, triggerGlitch, clearPopups } = useChaosStore();
  
  const [isActive, setIsActive] = useState(false);
  const [stage, setStage] = useState(0); // 0=idle, 1=scan, 2=redaction, 3=wipe, 4=reset
  const [mounted, setMounted] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Setup mount state for safe SSR/hydration in Next.js
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Trigger when popups reach 5
  useEffect(() => {
    if (popups.length >= 5 && !hasTriggeredRef.current && !isActive) {
      hasTriggeredRef.current = true;
      runComplianceWipe();
    }
  }, [popups.length, isActive]);

  const runComplianceWipe = async () => {
    setIsActive(true);

    // STAGE 1: SCAN & ALARM (2s)
    setStage(1);
    play('SYSTEM_ALARM');
    triggerShake(2000);
    triggerGlitch(1500);
    await new Promise(r => setTimeout(r, 2000));

    // STAGE 2: REDACTION & CLASSIFIED PURGE (3s)
    setStage(2);
    play('ERROR');
    triggerShake(3000);
    triggerGlitch(2000);
    await new Promise(r => setTimeout(r, 3000));

    // STAGE 3: SYSTEM WIPE OVERLAY (2s)
    setStage(3);
    play('DIALUP');
    triggerGlitch(2000);
    await new Promise(r => setTimeout(r, 2000));

    // STAGE 4: RESET
    setStage(4);
    await new Promise(r => setTimeout(r, 800));

    clearPopups();
    setIsActive(false);
    setStage(0);
    hasTriggeredRef.current = false;
  };

  if (!mounted || !isActive) return null;

  return createPortal(
    <AnimatePresence>
      {/* STAGE 1: HIGH INTENSITY NEON SCANNER WIPE */}
      {stage === 1 && (
        <motion.div
          key="compliance-scan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999999] pointer-events-none select-none bg-red-950/20"
        >
          {/* Laser beam */}
          <motion.div
            initial={{ translateY: '-10%' }}
            animate={{ translateY: '110%' }}
            transition={{ repeat: Infinity, duration: 1.0, ease: 'linear' }}
            className="absolute inset-x-0 h-4 bg-red-500 shadow-[0_0_35px_#FF0000,0_0_10px_#FF0000]"
          />
          
          {/* Scanning warnings */}
          <div className="absolute inset-x-0 top-6 flex justify-center">
            <div className="px-6 py-2 bg-red-600 border-2 border-white text-white font-mono text-xs font-bold uppercase tracking-[0.25em] animate-pulse shadow-[0_0_20px_#FF0000]">
              🚨 CRITICAL ATTACHMENT DETECTED — COMPLIANCE BREACH 🚨
            </div>
          </div>
        </motion.div>
      )}

      {/* STAGE 2: CLASSIFIED REDACTION OVERLAY */}
      {stage === 2 && (
        <motion.div
          key="compliance-redaction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999999] pointer-events-auto select-none overflow-hidden"
        >
          {/* Giant classified overlay message */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="border-4 border-dashed border-red-500 bg-black/90 p-8 rounded-lg max-w-xl text-center shadow-[0_0_80px_rgba(255,0,0,0.5)]">
              <h2 className="text-red-500 font-bebas text-4xl md:text-6xl tracking-[0.2em] uppercase font-black animate-pulse">
                [ DIGNITY REDACTED ]
              </h2>
              <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest mt-4 leading-relaxed">
                Self-respect credentials revoked by order of Relationship Regulation Ministry. Purging situaçõeship history.
              </p>
            </div>
          </div>

          {/* Random classification black boxes blockades */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute top-1/4 left-10 w-80 h-10 bg-black border border-red-500 origin-left flex items-center pl-3 font-mono text-[8px] text-red-500 uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(0,0,0,0.8)]"
          >
            ██████ RELATIONSHIP RECORD CLASSIFIED
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute bottom-1/3 right-12 w-96 h-12 bg-black border border-red-500 origin-right flex items-center pl-3 font-mono text-[8px] text-red-500 uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(0,0,0,0.8)]"
          >
            ██████ ATTACHMENT LOGS REDACTED
          </motion.div>

          {/* Target HUD on vectors */}
          <div className="absolute top-12 left-12 w-32 h-32 border-2 border-red-500/30 rounded-full flex items-center justify-center animate-spin">
            <div className="w-4 h-4 bg-red-600 rounded-full animate-ping" />
          </div>
        </motion.div>
      )}

      {/* STAGE 3: SYSTEM WIPE MASSIVE OVERLAY */}
      {stage === 3 && (
        <motion.div
          key="compliance-wipe"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999999999] pointer-events-auto bg-black flex flex-col items-center justify-center p-6"
        >
          {/* Scanline CRT style background */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
          
          <motion.div
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="w-full max-w-lg bg-zinc-950 border-2 border-red-600 p-8 rounded font-mono text-center space-y-6 shadow-[0_0_60px_rgba(255,0,0,0.4)]"
          >
            <div className="inline-block px-3 py-1 bg-red-950 border border-red-500 text-red-500 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
              ⚠️ SYSTEM COMPROMISE WIPE ⚠️
            </div>
            
            <h2 className="text-red-500 font-bebas text-5xl md:text-7xl font-extrabold tracking-widest uppercase"
                style={{ textShadow: '0 0 20px rgba(255,0,0,0.8)' }}>
              SYSTEM OVERLAY
            </h2>

            <p className="text-zinc-400 text-xs uppercase tracking-wider leading-relaxed">
              Purging all dignity assets. Wiping active emotional attachments from sector memory.
            </p>

            <div className="pt-4 border-t border-zinc-900 text-red-500 font-bold uppercase tracking-[0.2em] text-xs animate-pulse">
              RESETTING EMOTIONAL CORE...
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* STAGE 4: FADE TO RESET */}
      {stage === 4 && (
        <motion.div
          key="compliance-reset"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999999999] bg-black pointer-events-none"
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
