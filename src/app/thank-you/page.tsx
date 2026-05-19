'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TearingContainer from '@/components/tearing/TearingContainer';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '@/components/audio/AudioProvider';
import { Star, RotateCcw, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import ThreeBreakupEngine from '@/components/cursed-ui/ThreeBreakupEngine';
import ThreeShatterOverlay from '@/components/cursed-ui/ThreeShatterOverlay';

export default function ThankYouPage() {
  const router = useRouter();
  const { play } = useSound();
  const { clearPopups, addPopup, triggerShake, triggerGlitch, emotionalDamage, popups } = useChaosStore();

  const [rating, setRating] = useState<number | null>(null);
  const [showSurveyFeedback, setShowSurveyFeedback] = useState(false);
  const [printFinished, setPrintFinished] = useState(false);

  // Cinematic breakdown timer states
  const [isScreenBroken, setIsScreenBroken] = useState(false);
  const [isScreenBlack, setIsScreenBlack] = useState(false);
  const [breakdownCountdown, setBreakdownCountdown] = useState(10);

  // Clear all popups on mount
  useEffect(() => {
    clearPopups();
  }, [clearPopups]);

  // Restart loopback
  const handleRestartLoop = () => {
    clearPopups();
    play('DIALUP');
    triggerShake(1000);
    triggerGlitch(1200);

    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  // Play printing sounds and atmospheric audio
  useEffect(() => {
    // Atmosphere sound
    play('AMBIENCE');

    // Printing click tick sequence sound
    let ticks = 0;
    const interval = setInterval(() => {
      if (ticks < 12) {
        play('CLICK');
        ticks++;
      } else {
        clearInterval(interval);
        setPrintFinished(true);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [play]);

  // 1. Trigger glass/screen break & sound after 15 seconds
  useEffect(() => {
    const breakTimer = setTimeout(() => {
      setIsScreenBroken(true);
      play('RIP');
      triggerShake(1500);
      triggerGlitch(2000);
    }, 15000);

    return () => clearTimeout(breakTimer);
  }, [play, triggerShake, triggerGlitch]);

  // 2. Countdown timer interval once screen breaks (ends at 0 and triggers blackout)
  useEffect(() => {
    if (!isScreenBroken) return;
    const interval = setInterval(() => {
      setBreakdownCountdown((prev) => {
        if (prev <= 1) {
          setIsScreenBlack(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isScreenBroken]);

  // 3. Once screen goes pitch black, wait exactly 10 seconds and redirect back to Home Page
  useEffect(() => {
    if (!isScreenBlack) return;
    const redirectTimer = setTimeout(() => {
      // Clear session storage but preserve intro-shown status so it never repeats on loopback!
      const hasSeenIntro = sessionStorage.getItem('delulu-intro-shown');
      sessionStorage.clear();
      if (hasSeenIntro) {
        sessionStorage.setItem('delulu-intro-shown', hasSeenIntro);
      }
      window.location.href = '/';
    }, 10000);

    return () => clearTimeout(redirectTimer);
  }, [isScreenBlack]);

  // Dynamic survey responses - purely calm, no errors, glitches, or popups as requested!
  const handleRatingClick = (stars: number) => {
    play('CLICK');
    setRating(stars);
    setShowSurveyFeedback(true);
  };

  return (
    <div className="min-h-screen bg-[#0d0411] text-white flex flex-col font-mono relative overflow-hidden">
      
      {/* 1. TOP HEADER */}
      <header className="p-5 border-b border-[#FF007F]/30 bg-black/75 backdrop-blur-md flex justify-between items-center z-40">
        <span className="text-2xl font-bold font-bebas text-[#FF007F] tracking-widest pl-2">
          DELULUMATCH TERMINATION AGREEMENT & FINAL RECEIPT
        </span>
        <div className="text-[10px] text-pink-500 font-mono tracking-wider border border-[#FF007F]/40 px-3 py-1 rounded bg-black/60 shadow-[0_0_15px_rgba(255,0,127,0.2)] animate-pulse">
          STATUS: COMPLETED TERMINATION & DISREGARDED DIGNITY
        </div>
      </header>

      {/* 2. MAIN CORE LAYOUT */}
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 p-6 lg:p-12 items-start relative z-10">
        
        {/* Left Side Column: Expanded CVS Thermal Receipt Invoice (lg:col-span-5) */}
        <section data-emotional-object="true" className="lg:col-span-5 flex flex-col items-center justify-center relative w-full lg:sticky lg:top-24">
          
          <div className="w-full max-w-md bg-white text-black p-8 md:p-10 rounded shadow-[0_0_80px_rgba(255,255,255,0.15)] border-t-[16px] border-double border-zinc-400 border-b-[16px] relative overflow-hidden select-none scale-102 transition-transform duration-500 hover:scale-105">
            
            {/* Thermal background scanner animation */}
            <div className="absolute top-0 left-0 w-full h-[8px] bg-zinc-200/60 animate-bounce pointer-events-none" />

            <div className="space-y-6 text-sm font-mono text-zinc-950 uppercase tracking-tighter">
              
              <div className="text-center border-b border-dashed border-zinc-400 pb-4 space-y-2">
                <h2 className="text-2xl font-bold font-mono tracking-widest text-black">DELULUMATCH INC.</h2>
                <div className="text-[10px] tracking-wide text-zinc-700">DEPARTMENT OF EMOTIONAL AFFAIRS</div>
                <div className="text-[9px] text-zinc-500 font-bold">TERMINATION TRANSACTION DATE: 2026-05-18</div>
              </div>

              {/* Receipt details */}
              <div className="space-y-3 text-xs leading-relaxed border-b border-dashed border-zinc-400 pb-4">
                <div className="flex justify-between">
                  <span>UNEXPECTED GHOSTING TAX</span>
                  <span className="font-bold">$34.00</span>
                </div>
                <div className="flex justify-between">
                  <span>SITUATIONSHIP RENEWAL INSURANCE</span>
                  <span className="font-bold">$12.50</span>
                </div>
                <div className="flex justify-between">
                  <span>EMOTIONAL DAMAGE ASSISTANCE FEE</span>
                  <span className="font-bold">$89.00</span>
                </div>
                <div className="flex justify-between text-red-600 font-bold">
                  <span>TRAUMA SURCHARGE (EX RELAPSE)</span>
                  <span>$20.00</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>SELF-RESPECT DISCARD DISCOUNT</span>
                  <span>-$15.00</span>
                </div>
              </div>

              {/* Total Balance */}
              <div className="flex justify-between items-baseline text-base font-bold border-b-2 border-double border-zinc-400 pb-4">
                <span>TOTAL DAMAGE COST</span>
                <span className="text-2xl font-bold font-mono">${140.50 + emotionalDamage}.50</span>
              </div>

              {/* CVS Style extra thermal barcodes */}
              <div className="space-y-3 text-center pt-2">
                <div className="text-[9px] text-zinc-500 font-bold">BARCODE 994200174291842</div>
                
                {/* Barcode lines */}
                <div className="h-12 bg-black w-full flex items-center justify-center gap-0.5 px-3">
                  <div className="w-2 h-full bg-white" />
                  <div className="w-1.5 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-1.5 h-full bg-white" />
                  <div className="w-3 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-2 h-full bg-white" />
                  <div className="w-1 h-full bg-white" />
                  <div className="w-3.5 h-full bg-white" />
                </div>

                <div className="text-[10px] font-bold pt-1 text-red-600 tracking-wider">
                  * COMPATIBILITY RATING: INCOMPATIBLE
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* Right Side Column: Absurd Survey Ratings, Stickers & Breakup Image (lg:col-span-7) */}
        <section data-emotional-object="true" className="lg:col-span-7 space-y-10 flex flex-col justify-start w-full">
          
          {/* New Section: Interactive 3D Breakup Heart Shard Animation */}
          <div className="p-6 bg-black/60 border border-[#FF007F]/30 rounded-lg relative overflow-hidden shadow-[0_0_40px_rgba(255,0,127,0.1)]">
            <div className="absolute top-2 right-3 px-1.5 py-0.5 bg-[#FF007F] text-black font-bold text-[8px] rounded uppercase animate-pulse">
              Interactive 3D Cyberspace
            </div>
            
            <h3 className="text-md font-bebas text-pink-300 font-bold tracking-widest uppercase mb-2">
              💔 3D Emotional Breakdown Scene (Click Detonate to Shatter)
            </h3>
            <p className="text-[10px] text-zinc-400 uppercase tracking-tighter mb-4">
              DETONATE THE 3D NEON HEART AND WATCH THE SOULMATES SEPARATE IN REAL-TIME
            </p>

            <ThreeBreakupEngine />
          </div>

          {/* Unified 10-Sticker Y2K Drift Matrix panel */}
          <div className="relative flex flex-nowrap md:flex-wrap gap-4 md:gap-6 justify-center items-center h-64 border border-[#FF007F]/20 bg-black/50 rounded-lg p-6 overflow-x-auto overflow-y-hidden md:overflow-hidden shadow-[inset_0_0_45px_rgba(0,0,0,0.7)] scrollbar-none">
            <div className="absolute top-2 left-3 px-1.5 py-0.5 bg-purple-900 text-purple-200 text-[8px] font-mono rounded">
              Y2K DRIFT MATRIX (10-ELEMENTS)
            </div>
            
            {driftingStickers.map((sticker, idx) => {
              const rotationDirection = idx % 2 === 0 ? 1 : -1;
              const driftY = idx % 2 === 0 ? [0, -6, 0] : [0, 6, 0];
              const driftDuration = 4 + (idx % 3) * 0.8;

              if (sticker.type === 'image') {
                return (
                  <motion.div
                    key={idx}
                    animate={{ 
                      rotate: [rotationDirection * -3, rotationDirection * 3, rotationDirection * -3], 
                      y: driftY 
                    }}
                    transition={{ repeat: Infinity, duration: driftDuration, ease: 'easeInOut', delay: sticker.delay }}
                    className="w-20 h-20 md:w-24 md:h-24 relative z-10 shrink-0 select-none cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-300"
                  >
                    <Image 
                      src={sticker.src || ''} 
                      alt={sticker.alt || ''} 
                      fill 
                      className="object-contain"
                      style={{ filter: `drop-shadow(0 0 12px ${sticker.glow})` }}
                    />
                  </motion.div>
                );
              } else {
                return (
                  <motion.div
                    key={idx}
                    animate={{ 
                      rotate: [rotationDirection * -5, rotationDirection * 5, rotationDirection * -5], 
                      y: driftY 
                    }}
                    transition={{ repeat: Infinity, duration: driftDuration, ease: 'easeInOut', delay: sticker.delay }}
                    className="w-20 h-20 md:w-24 md:h-24 border border-zinc-900 bg-black/85 rounded p-3 flex flex-col items-center justify-center relative z-10 shrink-0 select-none cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-300 font-mono text-[7px]"
                    style={{ color: sticker.color, boxShadow: `inset 0 0 15px rgba(0,0,0,0.6), 0 0 10px ${sticker.color}20` }}
                  >
                    <div style={{ filter: `drop-shadow(0 0 8px ${sticker.color})` }}>
                      {sticker.element}
                    </div>
                    <span className="mt-1.5 opacity-70 tracking-widest font-bold font-mono text-center truncate w-full">
                      {sticker.label}
                    </span>
                  </motion.div>
                );
              }
            })}
          </div>

          {/* Absurd survey rating */}
          <div className="p-6 bg-black/70 border border-zinc-800 rounded-lg space-y-4 relative">
            <h3 className="text-lg font-bebas text-[#FF007F] font-bold tracking-widest uppercase">
              RATE YOUR EMOTIONAL SUFFERING EXPERIENCE
            </h3>
            
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className={`w-12 h-12 border rounded-md flex items-center justify-center transition-all ${
                    rating && rating >= star 
                      ? 'bg-[#FF007F] text-black border-black font-bold scale-105 shadow-[0_0_15px_#FF007F]' 
                      : 'bg-black border-zinc-800 hover:border-[#FF007F]/40'
                  }`}
                >
                  <Star size={20} fill={rating && rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>

            <AnimatePresence>
              {showSurveyFeedback && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-zinc-400 uppercase leading-relaxed font-mono animate-pulse"
                >
                  * Rating successfully processed. Heartbreak calibrator adjusted accordingly.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Loop back restart actions */}
          <div className="flex flex-col items-center pt-2 w-full">
            <button
              onClick={handleRestartLoop}
              className="px-12 py-4 bg-[#FF007F] text-black font-bold uppercase tracking-widest rounded-md border border-black shadow-[5px_5px_0px_#8A2BE2] hover:shadow-[0_0_30px_#FF007F] transition-all duration-300 text-xs w-full flex items-center justify-center gap-2"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <RotateCcw size={14} /> MATCH AGAIN (WORSE IDEA)
            </button>
            <p className="text-[9px] text-zinc-600 mt-4 text-center uppercase tracking-wider">
              * WARNING: SELECTING MATCH AGAIN RETRIGGERS ENTIRE TRAUMA LOOP SEQUENCE FROM PAGE 1.
            </p>
          </div>

        </section>

      </main>

      {/* Footer Branding Ticker */}
      <footer className="p-5 border-t border-zinc-900 text-[10px] font-mono text-zinc-500 flex justify-between items-center bg-black/60 relative z-50">
        <div className="flex gap-4">
          <span>© 2026 DELULUMATCH TERMINATION AGREEMENT</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">SELF-RESPECT PURGED</span>
        </div>
        <div className="flex gap-4 uppercase font-bold text-[#FF007F]">
          <span>COMPLETION: 100% SUFFERING</span>
        </div>
      </footer>

      {/* Cinematic 3D Glass Shatter / Screen Break Overlay (Triggered at 15s) */}
      <AnimatePresence>
        {isScreenBroken && !isScreenBlack && (
          <ThreeShatterOverlay countdown={breakdownCountdown} />
        )}
      </AnimatePresence>

      {/* Cinematic Pitch Black Screen (Triggered at 25s) */}
      <AnimatePresence>
        {isScreenBlack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999999] bg-black pointer-events-auto select-none"
          >
            {/* Pure atmospheric silence and complete black screen */}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}



// 10-STICKER STATIC DATASET
const driftingStickers = [
  { type: 'image', src: '/delulu_crying_heart.png', alt: 'Crying Heart', delay: 0, glow: 'rgba(255,0,127,0.4)' },
  { type: 'image', src: '/toxic_romance_receipt.png', alt: 'Receipt', delay: 0.5, glow: 'rgba(255,0,127,0.4)' },
  { type: 'image', src: '/delulu_ex_calling.png', alt: 'Incoming Call', delay: 1, glow: 'rgba(138,43,226,0.4)' },
  { type: 'image', src: '/broken_heart_shattered.png', alt: 'Shattered Heart', delay: 1.5, glow: 'rgba(255,20,147,0.4)' },
  { type: 'image', src: '/y2k_floppy_disk.png', alt: 'Ex Files Floppy', delay: 2, glow: 'rgba(255,0,127,0.4)' },
  { type: 'image', src: '/y2k_trauma_cd.png', alt: 'Trauma CD', delay: 2.5, glow: 'rgba(138,43,226,0.4)' },
  { type: 'image', src: '/y2k_toxic_couple.png', alt: 'Toxic Couple', delay: 3, glow: 'rgba(255,0,85,0.4)' },
  { 
    type: 'svg', 
    label: 'EX TEXT',
    delay: 3.5, 
    color: '#FFD700',
    element: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )
  },
  { 
    type: 'svg', 
    label: 'DIGNITY KEY',
    delay: 4, 
    color: '#32CD32',
    element: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3M15.5 7.5L19 4" />
      </svg>
    )
  },
  { 
    type: 'svg', 
    label: 'TRMA PAGER',
    delay: 4.5, 
    color: '#00FFFF',
    element: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
        <line x1="6" y1="8" x2="18" y2="8" />
        <line x1="6" y1="12" x2="14" y2="12" />
        <circle cx="18" cy="15" r="1" />
      </svg>
    )
  }
];

