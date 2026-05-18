'use client';

import { useEffect, useState, useRef } from 'react';
import { useChaosStore } from '@/store/useChaosStore';

export default function ChaosOptimizationGuard() {
  const { isFpsLow, setIsFpsLow, popups, clearPopups } = useChaosStore();
  const [fps, setFps] = useState(60);
  const [showHUD, setShowHUD] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const frameTimes = useRef<number[]>([]);
  const lastFrameTime = useRef<number>(0);
  const lowFpsCount = useRef<number>(0);
  const highFpsCount = useRef<number>(0);
  const isMobileRef = useRef<boolean>(false);

  useEffect(() => {
    // 1. Mobile Detection Guard
    const checkMobile = () => {
      const mobileView = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobileView);
      isMobileRef.current = mobileView;
      if (mobileView) {
        setIsFpsLow(true); // Always engage low-performance overrides on mobile for absolute visual responsiveness
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 2. Real-Time FPS Profiler Loop
    let rafId: number;
    const profileLoop = (timestamp: number) => {
      if (lastFrameTime.current !== 0) {
        const delta = timestamp - lastFrameTime.current;
        const currentFps = 1000 / delta;

        // Keep a rolling buffer of last 60 frames
        frameTimes.current.push(currentFps);
        if (frameTimes.current.length > 60) {
          frameTimes.current.shift();
        }

        // Calculate average FPS
        const sum = frameTimes.current.reduce((a, b) => a + b, 0);
        const avgFps = Math.round(sum / frameTimes.current.length);
        setFps(avgFps);

        const currentIsFpsLow = useChaosStore.getState().isFpsLow;

        // Frame Budget Guard (FPS < 45)
        if (avgFps < 45) {
          lowFpsCount.current += 1;
          highFpsCount.current = 0;
          
          // Trigger safeguards if low FPS sustained for ~3 seconds (180 frames)
          if (lowFpsCount.current > 180 && !currentIsFpsLow) {
            setIsFpsLow(true);
            lowFpsCount.current = 0;
          }
        } else {
          highFpsCount.current += 1;
          lowFpsCount.current = 0;

          // Re-engage full premium quality if FPS rises back above 52 for 3 seconds
          if (highFpsCount.current > 180 && currentIsFpsLow && !isMobileRef.current) {
            setIsFpsLow(false);
            highFpsCount.current = 0;
          }
        }
      }

      lastFrameTime.current = timestamp;
      rafId = requestAnimationFrame(profileLoop);
    };

    rafId = requestAnimationFrame(profileLoop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', checkMobile);
    };
  }, [setIsFpsLow]);

  // 3. Dynamic Styles Optimization Override
  useEffect(() => {
    if (isFpsLow) {
      document.body.classList.add('disable-chaos-blur');
    } else {
      document.body.classList.remove('disable-chaos-blur');
    }
  }, [isFpsLow]);

  // 4. Popup Ceiling Guard (limit maximum popups dynamically when performance degraded)
  useEffect(() => {
    const popupCeiling = isFpsLow ? 3 : 8;
    if (popups.length > popupCeiling) {
      // Discard older excess popups to conserve memory
      useChaosStore.setState({
        popups: popups.slice(popups.length - popupCeiling)
      });
    }
  }, [popups, isFpsLow]);

  return (
    <>
      {/* Dynamic Blur Override Styling */}
      <style>{`
        body.disable-chaos-blur,
        body.disable-chaos-blur * {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
      `}</style>

      {/* Floating Retro Diagnostic HUD Toggle */}
      <div className="fixed bottom-2 left-2 z-[9999] font-mono text-[9px] select-none flex items-center gap-1.5 bg-black/80 border border-zinc-800 p-1 px-2 rounded text-zinc-500 hover:text-white hover:border-[#FF007F] transition-all cursor-pointer"
        onClick={() => setShowHUD(!showHUD)}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isFpsLow ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
        <span>PERF: {fps} FPS</span>
        {isFpsLow && <span className="text-[#FF007F] text-[8px] uppercase tracking-widest">[OVERRIDE ACTIVE]</span>}
      </div>

      {/* Full diagnostic modal when clicked */}
      {showHUD && (
        <div className="fixed bottom-8 left-2 z-[9999] w-72 bg-black border border-zinc-800 p-3 rounded font-mono text-[9px] text-zinc-400 space-y-2 shadow-2xl select-none">
          <div className="flex justify-between border-b border-zinc-800 pb-1 text-[#FF007F] font-bold">
            <span>EMOTIONAL STABILITY DECK</span>
            <span className="cursor-pointer text-white" onClick={() => setShowHUD(false)}>[X]</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>REAL-TIME FRAMES:</span>
              <span className={fps < 45 ? 'text-red-500 font-bold' : 'text-green-400'}>{fps} FPS</span>
            </div>
            <div className="flex justify-between">
              <span>CPU RENDER MODE:</span>
              <span>{isMobile ? 'MOBILE LOW-LATENCY' : 'DESKTOP 3D COMPUTE'}</span>
            </div>
            <div className="flex justify-between">
              <span>HARDWARE ACCELERATION:</span>
              <span className="text-green-400">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>ACTIVE POPUPS / CEILING:</span>
              <span>{popups.length} / {isFpsLow ? '3' : '8'}</span>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-1 text-[8px] uppercase text-zinc-500 leading-normal">
            {isFpsLow ? (
              <span className="text-red-400">
                ⚠️ SAFEGUARDS ACTIVE:<br />
                - TSUNAMI PARTICLES SLICED BY 60%<br />
                - BACKDROP FILTER BLURS DISMISSED<br />
                - COMPATIBILITY POPUP THRESHOLD CAP: 3
              </span>
            ) : (
              <span className="text-zinc-600">
                🟢 PERFORMANCE WITHIN BUDGET.<br />
                - TSUNAMI PARTICLES COUNT: 1200<br />
                - HIGH-FIDELITY SHADERS LOADED
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
