'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useSound } from '@/components/audio/AudioProvider';
import { ShieldAlert, HeartCrack, Siren } from 'lucide-react';

const BOOT_LOGS = [
  'BOOTING DELUSION CORE v4.2.0...',
  'INITIALIZING UNRELIABLE SCANNERS...',
  'SEVERING SELF-RESPECT ENTIRELY...',
  'CALIBRATING RELAPSE PATTERNS...',
  'ATTACHMENT OVERLOAD DETECTED...',
  'ESTABLISHING HELLISH BINDINGS...'
];

export default function TransitionOverlay() {
  const { play } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const logsRef = useRef<HTMLDivElement>(null);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);

  useEffect(() => {
    // Play transition sounds on trigger
    play('DIALUP');

    // Cascade logs
    let index = 0;
    const logInterval = setInterval(() => {
      if (index < BOOT_LOGS.length) {
        setCurrentLogs(prev => [...prev, BOOT_LOGS[index]]);
        index++;
      } else {
        clearInterval(logInterval);
      }
    }, 180);

    // GSAP Page Intro Transition Wipe Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Uncover screen
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          delay: 0.4
        });
      }
    });

    tl.to(containerRef.current, {
      yPercent: 0,
      duration: 0.5,
      ease: 'power3.out'
    });

    // Run infinite glow animation separately so it does not block timeline completion
    const glowTween = gsap.fromTo('.transition-glow', 
      { filter: 'drop-shadow(0 0 0px #FF007F)' },
      { filter: 'drop-shadow(0 0 20px #FF007F)', repeat: -1, yoyo: true, duration: 0.4 }
    );

    return () => {
      clearInterval(logInterval);
      tl.kill();
      glowTween.kill();
    };
  }, [play]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[#0c0410] flex flex-col items-center justify-center p-6 border-b border-[#FF007F]/40"
      style={{ transform: 'translateY(0%)' }}
    >
      {/* Dynamic Background CRT Scanline Matrix */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,127,0.06),rgba(138,43,226,0.02),rgba(255,0,0,0.06))] bg-[length:100%_3px,3px_100%]" />
      
      {/* Glitching Warning Icons */}
      <div className="flex gap-4 items-center mb-6 transition-glow">
        <HeartCrack size={36} className="text-[#FF007F] animate-pulse" />
        <ShieldAlert size={40} className="text-[#8A2BE2] animate-bounce" />
        <Siren size={36} className="text-red-500 animate-pulse" />
      </div>

      <div className="w-full max-w-md bg-black/80 border border-[#FF007F]/30 p-5 rounded font-mono text-[10px] text-pink-200/90 space-y-2 uppercase shadow-[0_0_40px_rgba(255,0,127,0.1)] relative">
        <div className="absolute top-2 right-3 px-1.5 py-0.5 bg-[#FF007F] text-black font-bold text-[8px] rounded animate-flash">
          CRITICAL WIPE
        </div>
        
        <div className="border-b border-[#FF007F]/20 pb-2 mb-3 text-[#FF007F] font-bold tracking-wider flex justify-between">
          <span>SYSTEM TERMINATOR ROUTER</span>
          <span>RCC-OS</span>
        </div>

        {/* Real-time cascading glitched logs */}
        <div ref={logsRef} className="space-y-1.5 min-h-[110px]">
          {currentLogs.map((log, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-[#8A2BE2]">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#FF007F]/20 text-zinc-500 text-[8px] flex justify-between">
          <span>STATUS: ALIVE IN TRANSIT</span>
          <span>STABILITY: FAILED</span>
        </div>
      </div>

      {/* Screen flash glow overlay */}
      <div className="absolute inset-0 bg-[#FF007F]/5 pointer-events-none animate-pulse" />
    </div>
  );
}
