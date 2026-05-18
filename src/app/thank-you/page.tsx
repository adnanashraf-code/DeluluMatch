'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TearingContainer from '@/components/tearing/TearingContainer';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '@/components/audio/AudioProvider';
import { Star, RotateCcw, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

export default function ThankYouPage() {
  const router = useRouter();
  const { play } = useSound();
  const { clearPopups, addPopup, triggerShake, triggerGlitch, emotionalDamage } = useChaosStore();

  const [rating, setRating] = useState<number | null>(null);
  const [showSurveyFeedback, setShowSurveyFeedback] = useState(false);
  const [printFinished, setPrintFinished] = useState(false);

  // Restart loopback
  const handleRestartLoop = () => {
    play('DIALUP');
    triggerShake(1000);
    triggerGlitch(1200);
    clearPopups();

    setTimeout(() => {
      router.push('/');
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

  // Dynamic survey responses
  const handleRatingClick = (stars: number) => {
    play('CLICK');
    setRating(stars);
    setShowSurveyFeedback(true);

    if (stars === 4 || stars === 5) {
      triggerShake(300);
      triggerGlitch(400);
      setTimeout(() => {
        addPopup({
          title: '⚠️ COMPLIANCE VERIFICATION INCIDENT',
          content: 'You rated 4+ stars. DeluluMatch guidelines dictate absolute dissatisfaction with relational suffering. Ratings have been adjusted to 1 star.',
          x: 40,
          y: 40,
          type: 'toxic'
        });
        setRating(1);
      }, 400);
    } else {
      setTimeout(() => {
        addPopup({
          title: '✨ SELF-RESPECT MILESTONE DETECTED',
          content: 'Rating matches emotional damage limits. Standard therapy coupon code generated: DELULU100.',
          x: 35,
          y: 45,
          type: 'therapy'
        });
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0411] text-white flex flex-col font-mono relative overflow-hidden">
      
      {/* 1. TOP HEADER */}
      <header className="p-4 border-b border-[#FF007F]/20 bg-black/60 backdrop-blur-md flex justify-between items-center z-40">
        <span className="text-xl font-bold font-bebas text-[#FF007F] tracking-widest pl-2">
          DELULUMATCH FINAL RECEIPT
        </span>
        <div className="text-[10px] text-zinc-500 font-mono tracking-wider border border-zinc-800 px-2 py-0.5 rounded bg-black/40">
          STATUS: COMPLETED TERMINATION
        </div>
      </header>

      {/* 2. MAIN CORE LAYOUT */}
      <main className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12 items-center relative">
        
        {/* Left Side Column: CVS Thermal Receipt Invoice (lg:col-span-6) */}
        <section className="lg:col-span-6 flex flex-col items-center justify-center relative">
          
          <div className="w-full max-w-sm bg-white text-black p-6 rounded shadow-[0_0_50px_rgba(255,255,255,0.1)] border-t-[12px] border-double border-zinc-400 border-b-[12px] relative overflow-hidden select-none">
            
            {/* Thermal background scanner animation */}
            <div className="absolute top-0 left-0 w-full h-[6px] bg-zinc-200/50 animate-bounce pointer-events-none" />

            <div className="space-y-4 text-xs font-mono text-zinc-950 uppercase tracking-tighter">
              
              <div className="text-center border-b border-dashed border-zinc-400 pb-3 space-y-1">
                <h2 className="text-xl font-bold font-mono tracking-widest">DELULUMATCH INC.</h2>
                <div className="text-[9px]">DEPARTMENT OF EMOTIONAL AFFAIRS</div>
                <div className="text-[8px] text-zinc-500">TERMINATION TRANSACTION DATE: 2026-05-18</div>
              </div>

              {/* Receipt details */}
              <div className="space-y-2 text-[10px] leading-relaxed border-b border-dashed border-zinc-400 pb-3">
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
              <div className="flex justify-between items-baseline text-sm font-bold border-b-2 border-double border-zinc-400 pb-3">
                <span>TOTAL DAMAGE COST</span>
                <span className="text-lg font-bold">${140.50 + emotionalDamage}.50</span>
              </div>

              {/* CVS Style extra thermal barcodes */}
              <div className="space-y-2 text-center pt-2">
                <div className="text-[8px] text-zinc-500">BARCODE 994200174291842</div>
                
                {/* Barcode lines */}
                <div className="h-10 bg-black w-full flex items-center justify-center gap-0.5 px-2">
                  <div className="w-1.5 h-full bg-white" />
                  <div className="w-1.5 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-1 h-full bg-white" />
                  <div className="w-2 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-1.5 h-full bg-white" />
                  <div className="w-1 h-full bg-white" />
                  <div className="w-2.5 h-full bg-white" />
                </div>

                <div className="text-[9px] font-bold pt-1 text-red-600">
                  * COMPATIBILITY RATING: INCOMPATIBLE
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* Right Side Column: Absurd Survey Ratings & Asset Image Drifting (lg:col-span-6) */}
        <section className="lg:col-span-6 space-y-8 flex flex-col justify-center">
          
          {/* Drifting sticker panel */}
          <div className="relative flex flex-wrap gap-4 justify-center items-center h-48 border border-zinc-900 bg-black/40 rounded-lg p-4 overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
            
            <motion.div 
              animate={{ rotate: [-2, 2, -2], y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="w-24 h-24 relative z-10"
            >
              <Image 
                src="/delulu_crying_heart.png" 
                alt="Crying heart sticker" 
                fill 
                className="object-contain filter drop-shadow-[0_0_10px_rgba(255,0,127,0.3)]"
              />
            </motion.div>

            <motion.div 
              animate={{ rotate: [3, -3, 3], y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="w-24 h-24 relative z-10"
            >
              <Image 
                src="/toxic_romance_receipt.png" 
                alt="Receipt sticker" 
                fill 
                className="object-contain filter drop-shadow-[0_0_10px_rgba(255,0,127,0.3)]"
              />
            </motion.div>

            <motion.div 
              animate={{ rotate: [-4, 4, -4], y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="w-24 h-24 relative z-10"
            >
              <Image 
                src="/delulu_ex_calling.png" 
                alt="Incoming call sticker" 
                fill 
                className="object-contain filter drop-shadow-[0_0_10px_rgba(138,43,226,0.3)]"
              />
            </motion.div>

            <div className="absolute inset-0 bg-[#FF007F]/5 pointer-events-none animate-pulse" />
          </div>

          {/* Absurd survey rating */}
          <div className="p-6 bg-black/60 border border-zinc-800 rounded-lg space-y-4 relative">
            <h3 className="text-lg font-bebas text-[#FF007F] font-bold tracking-widest uppercase">
              RATE YOUR EMOTIONAL SUFFERING EXPERIENCE
            </h3>
            
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className={`w-10 h-10 border rounded flex items-center justify-center transition-colors ${
                    rating && rating >= star 
                      ? 'bg-[#FF007F] text-black border-black font-bold' 
                      : 'bg-black border-zinc-850 hover:border-[#FF007F]/40'
                  }`}
                >
                  <Star size={16} fill={rating && rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>

            <AnimatePresence>
              {showSurveyFeedback && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-zinc-400 uppercase leading-relaxed font-mono animate-pulse"
                >
                  * Rating successfully processed. Heartbreak calibrator adjusted accordingly.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Loop back restart actions */}
          <div className="flex flex-col items-center pt-2">
            <button
              onClick={handleRestartLoop}
              className="px-12 py-3 bg-[#FF007F] text-black font-bold uppercase tracking-widest rounded border border-black shadow-[4px_4px_0px_#8A2BE2] hover:shadow-[0_0_25px_#FF007F] transition-all duration-300 text-xs w-full max-w-md flex items-center justify-center gap-2"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <RotateCcw size={14} /> MATCH AGAIN (WORSE IDEA)
            </button>
            <p className="text-[9px] text-zinc-600 mt-3 text-center uppercase">
              * WARNING: SELECTING MATCH AGAIN RETRIGGERS ENTIRE TRAUMA LOOP SEQUENCE FROM PAGE 1.
            </p>
          </div>

        </section>

      </main>

      {/* Footer Branding Ticker */}
      <footer className="p-4 border-t border-zinc-900 text-[9px] font-mono text-zinc-600 flex justify-between items-center bg-black/40 relative z-50">
        <div className="flex gap-4">
          <span>© 2026 DELULUMATCH TERMINATION AGREEMENT</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">SELF-RESPECT PURGED</span>
        </div>
        <div className="flex gap-4 uppercase font-bold text-[#FF007F]">
          <span>COMPLETION: 100% SUFFERING</span>
        </div>
      </footer>

    </div>
  );
}
