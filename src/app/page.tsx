'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TearingContainer from '@/components/tearing/TearingContainer';
import IntroSequence from '@/components/layout/IntroSequence';
import MovingButton from '@/components/cursed-ui/MovingButton';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '@/components/audio/AudioProvider';
import { Heart, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { play } = useSound();
  const { 
    onlineUsers, 
    heartbreakIndex, 
    addPopup, 
    triggerShake, 
    triggerGlitch, 
    incrementDamage,
    setIsBossFighting
  } = useChaosStore();

  const [scanProgress, setScanProgress] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Play ambient background sound on interaction
  useEffect(() => {
    const startAmbience = () => {
      play('AMBIENCE');
      document.removeEventListener('click', startAmbience);
    };
    document.addEventListener('click', startAmbience);
    return () => document.removeEventListener('click', startAmbience);
  }, [play]);

  // Action: Verify Trauma
  const handleVerifyTrauma = () => {
    if (scanProgress !== null) return;
    play('CLICK');
    setScanProgress(0);
    triggerShake(200);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 99) {
          clearInterval(interval);
          setTimeout(() => {
            play('ERROR');
            triggerGlitch(600);
            triggerShake(500);
            incrementDamage(15);
            addPopup({
              title: '⚠️ CRITICAL ANXIETY OVERFLOW',
              content: 'Trauma scans indicate severe emotional availability deficit. Compatibility metrics corrupted.',
              x: 35,
              y: 40,
              type: 'toxic'
            });
            setScanProgress(null);
          }, 800);
          return 99; // Get stuck at 99%!
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 150);
  };

  // Action: Import Ex Issues
  const handleImportIssues = () => {
    play('CLICK');
    triggerGlitch(200);
    incrementDamage(20);
    
    // Spawn chaos popups
    setTimeout(() => {
      addPopup({
        title: '⚠️ COMPATIBILITY THREAT',
        content: 'Your ex has recently checked your profile. Attachment relapse risk is critical.',
        x: 20,
        y: 25,
        type: 'warning'
      });
    }, 100);

    setTimeout(() => {
      addPopup({
        title: '⚠️ ATTENTION ISSUES INJECTED',
        content: 'Dry texting protocol activated. Prepared to wait 14 hours for a "k" reply.',
        x: 60,
        y: 35,
        type: 'alert'
      });
    }, 300);
  };

  // Transition to marketplace page (with beautiful CRT screen wipe)
  const handleEnterMarketplace = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    play('DIALUP');
    triggerShake(1000);
    triggerGlitch(1200);
    incrementDamage(10);

    setTimeout(() => {
      router.push('/marketplace');
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#080208] text-white">
      <IntroSequence />
      
      {/* Cinematic CRT Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 0.02, 1], opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#FF007F] z-[99999] flex flex-col items-center justify-center font-mono text-black uppercase"
          >
            <div className="animate-pulse space-y-4 text-center p-8 bg-black border-4 border-black text-[#FF007F] rounded shadow-[0_0_50px_rgba(255,0,127,0.5)]">
              <h2 className="text-3xl font-bold tracking-widest font-bebas">CORRUPTING COMPATIBILITY MESH...</h2>
              <div className="w-64 h-4 bg-zinc-900 border border-[#FF007F] p-0.5 mx-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.2 }}
                  className="h-full bg-[#FF007F]"
                />
              </div>
              <p className="text-[10px] text-zinc-400 font-mono tracking-widest">LOADING TOXIC COMPANIONS</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOXIC STICKY NAVBAR */}
      <header className="sticky top-0 w-full p-4 border-b border-[#FF007F]/20 bg-black/60 backdrop-blur-md flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#FF007F] flex items-center justify-center text-black font-bold animate-pulse">
            💔
          </div>
          <span className="text-2xl font-bold font-bebas text-[#FF007F] tracking-wide drop-shadow-[0_0_8px_rgba(255,0,127,0.4)]">
            DELULUMATCH
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono tracking-wider">
          <div className="hidden lg:flex items-center gap-2 text-zinc-400 border border-zinc-800 px-2 py-1 bg-black/40 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#32CD32] animate-ping" />
            ONLINE: <span className="text-white font-bold">{onlineUsers.toLocaleString()}</span> UNAVAILABLE PEOPLE
          </div>
          <div className="flex items-center gap-2 border border-[#FF007F]/30 px-2 py-1 bg-[#FF007F]/5 rounded">
            <Activity size={10} className="text-[#FF007F]" />
            COMPATIBILITY RISK: <span className="text-[#FF007F] font-bold">UNSTABLE ({heartbreakIndex}%)</span>
          </div>
          <button 
            onClick={() => {
              play('CLICK');
              setIsBossFighting(true);
            }}
            className="px-3 py-1 bg-[#FF007F] hover:bg-pink-400 text-black font-extrabold text-[9px] uppercase tracking-wider rounded shadow-[0_0_8px_#FF007F]"
          >
            LOGIN
          </button>
        </div>
      </header>

      {/* 2. MAIN CORE LAYOUT */}
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12 items-center relative">
        
        {/* Left Side Column: Onboarding Interactive Panel */}
        <section data-emotional-object="true" className="lg:col-span-7 space-y-8 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF007F]/10 border border-[#FF007F]/30 text-[#FF007F] text-[10px] font-mono uppercase tracking-[0.25em] rounded self-start animate-flicker">
            <AlertTriangle size={12} />
            Caution: High risk of emotional damage
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas leading-none font-bold text-white tracking-tight">
            FIND YOUR <span className="text-[#FF007F] drop-shadow-[0_0_15px_rgba(255,0,127,0.3)]">EMOTIONALLY</span> <br/>
            <span className="text-[#8A2BE2] drop-shadow-[0_0_15px_rgba(138,43,226,0.3)]">UNAVAILABLE</span> SOULMATE
          </h1>

          <p className="text-sm md:text-base opacity-75 font-mono max-w-xl leading-relaxed text-zinc-300">
            Welcome to the internet's most accurate digital suffering simulator. 
            Stop looking for healthy boundaries—calibrating your toxic attachment style and unresolved ex issues starts now.
          </p>

          {/* Interactive Scan Progress Meter */}
          {scanProgress !== null && (
            <div className="w-full max-w-md p-4 bg-black/80 border border-[#FF007F] rounded space-y-2 font-mono text-xs">
              <div className="flex justify-between font-bold text-[#FF007F]">
                <span>SCANNING ATTACHMENT DEFICITS...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-3 bg-zinc-950 p-0.5 rounded border border-[#FF007F]/30">
                <div 
                  className="h-full bg-[#FF007F] transition-all duration-100" 
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Evasive and Standard Actions Stack */}
          <div className="flex flex-col sm:flex-row gap-6 items-center pt-4">
            {/* Start Matching: The evasive button! */}
            <MovingButton>
              Start Matching
            </MovingButton>

            {/* Standard actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={handleVerifyTrauma}
                className="px-6 py-3 border border-zinc-800 bg-black/40 hover:border-[#FF007F] hover:bg-[#FF007F]/10 text-white font-bold rounded transition-all duration-300 text-xs font-mono uppercase tracking-wider"
              >
                Verify Trauma
              </button>

              <button 
                onClick={handleImportIssues}
                className="px-6 py-3 border border-zinc-800 bg-black/40 hover:border-[#8A2BE2] hover:bg-[#8A2BE2]/10 text-white font-bold rounded transition-all duration-300 text-xs font-mono uppercase tracking-wider"
              >
                Import Ex Issues
              </button>
            </div>
          </div>

          {/* Bypass CTA */}
          <div className="pt-6">
            <button 
              onClick={handleEnterMarketplace}
              className="text-[10px] md:text-xs font-mono text-[#FF007F]/60 hover:text-[#FF007F] underline underline-offset-4 tracking-[0.2em] uppercase transition-colors"
            >
              [ Bypass Verification & Enter Delusion ]
            </button>
          </div>
        </section>

        {/* Right Side Column: Dynamic Profile Tearing Demo Card */}
        <section data-emotional-object="true" className="lg:col-span-5 h-[500px] flex items-center justify-center relative">
          <div className="w-full max-w-sm h-[420px] relative">
            <TearingContainer 
              id="demo-profile" 
              tearType="diagonal"
              onTearComplete={handleEnterMarketplace}
              underlayer={
                <div className="p-6 text-center space-y-4 flex flex-col items-center justify-center h-full">
                  <ShieldAlert size={40} className="text-[#FF007F] animate-pulse" />
                  <h3 className="font-bebas text-2xl text-[#FF007F] tracking-widest font-bold">RED FLAGS DETECTED</h3>
                  <div className="text-[10px] font-mono text-zinc-400 leading-relaxed uppercase bg-black/40 p-3 border border-zinc-800 rounded">
                    "Still follows and checks ex's profile hourly. Replies 'damn thats crazy' to trauma dumping."
                  </div>
                </div>
              }
            >
              {/* Profile Card Contents */}
              <div className="h-full p-6 flex flex-col justify-between font-mono bg-gradient-to-br from-[#120516] to-[#040106] select-none">
                <div className="space-y-4">
                  {/* Top card bar */}
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                    <span className="text-[9px] text-[#FF007F] font-bold uppercase tracking-widest">VERIFIED DELULU</span>
                    <div className="flex gap-1 text-[#FF007F]">
                      <Heart size={10} fill="#FF007F" />
                      <Heart size={10} fill="#FF007F" />
                      <Heart size={10} />
                    </div>
                  </div>

                  {/* Profile Picture Placeholder Box with glitch design */}
                  <div className="w-full h-40 bg-zinc-950/60 border border-zinc-800 rounded relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#FF007F]/5 animate-pulse" />
                    <span className="text-4xl">🫣</span>
                  </div>

                  {/* Name and Basic Traits */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-lg font-bold text-white uppercase">Aarav, 24</h3>
                      <span className="text-[10px] text-[#32CD32] font-bold">98% Match</span>
                    </div>
                    
                    <div className="space-y-1 pt-2">
                      <div className="text-[9px] text-zinc-500 uppercase font-bold">Core Interests:</div>
                      <div className="flex flex-wrap gap-1.5 text-[9px] uppercase">
                        <span className="px-1.5 py-0.5 bg-black border border-[#FF007F]/20 text-[#FF007F] rounded">Ghosting</span>
                        <span className="px-1.5 py-0.5 bg-black border border-[#8A2BE2]/20 text-[#8A2BE2] rounded">Dry Texting</span>
                        <span className="px-1.5 py-0.5 bg-black border border-red-500/20 text-red-500 rounded">Avoidant</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-zinc-600 text-center uppercase tracking-widest border-t border-zinc-900 pt-3">
                  Delulu Compatibility Matrix
                </div>
              </div>
            </TearingContainer>
          </div>
        </section>

      </main>

      {/* 3. DYNAMIC MARQUEE NEWS TICKER */}
      <div className="h-8 bg-[#FF007F] text-black flex items-center overflow-hidden font-mono text-[9px] uppercase tracking-wider font-bold relative z-50">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap flex gap-12"
        >
          <span>⚠️ Your ex just updated their bio to "healing" in Sector 4...</span>
          <span>⚠️ AI predicts crying session at 2:00 AM...</span>
          <span>⚠️ Compatibility is dangerously high—expect severe situationship attachment...</span>
          <span>⚠️ Hot singles 4 meters away have already read and archived your message...</span>
          
          {/* Duplicate to handle seamless loops */}
          <span>⚠️ Your ex just updated their bio to "healing" in Sector 4...</span>
          <span>⚠️ AI predicts crying session at 2:00 AM...</span>
          <span>⚠️ Compatibility is dangerously high—expect severe situationship attachment...</span>
          <span>⚠️ Hot singles 4 meters away have already read and archived your message...</span>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <footer className="p-4 border-t border-zinc-900 text-[9px] font-mono text-zinc-600 flex justify-between items-center bg-black/40 relative z-50">
        <div className="flex gap-4">
          <span>© 2026 DELULUMATCH SIMULATION OS</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">TRAUMA-PASS-v1.2</span>
        </div>
        <div className="flex gap-4 uppercase font-bold text-[#FF007F]">
          <span>TRAUMA LEVEL: CRITICAL</span>
        </div>
      </footer>
    </div>
  );
}
