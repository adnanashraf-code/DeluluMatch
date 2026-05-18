'use client';

import { useState, useEffect, useRef } from 'react';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '../audio/AudioProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Heart, Star, Sparkles, X, Check } from 'lucide-react';
import gsap from 'gsap';

export default function CookieConsentMafia() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaStage, setCaptchaStage] = useState(1);
  const [selectedBoxes, setSelectedBoxes] = useState<boolean[]>(new Array(9).fill(false));
  const [captchaAttempts, setCaptchaAttempts] = useState(0);
  
  // Custom offsets for checkboxes evading the cursor
  const [boxOffsets, setBoxOffsets] = useState<{ x: number; y: number }[]>(new Array(9).fill({ x: 0, y: 0 }));

  const { play } = useSound();
  const { 
    addPopup, 
    triggerShake, 
    triggerGlitch, 
    incrementDamage,
    cursorScale
  } = useChaosStore();

  const bannerRef = useRef<HTMLDivElement>(null);
  const rejectBtnRef = useRef<HTMLButtonElement>(null);
  const acceptBtnRef = useRef<HTMLButtonElement>(null);
  
  // Magnetic spring trackers for Accept Button
  const acceptX = useRef(0);
  const acceptY = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const isHoveredAccept = useRef(false);

  useEffect(() => {
    // Spawns the Y2K Cookie Banner after 4 seconds to welcome the user
    const timeout = setTimeout(() => {
      setIsVisible(true);
      play('ERROR');
    }, 400);

    const handleGlobalMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [play]);

  // RequestAnimationFrame Loop for the Magnetic Accept Button chase
  useEffect(() => {
    if (!isVisible || showCaptcha) return;

    let animFrame: number;
    let vx = 0;
    let vy = 0;
    const tension = 0.12;
    const friction = 0.75;

    const chaseLoop = () => {
      if (isHoveredAccept.current && acceptBtnRef.current) {
        const rect = acceptBtnRef.current.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        // Spring acceleration calculation towards mouse coordinates
        const ax = (mouseX.current - btnCenterX) * tension;
        const ay = (mouseY.current - btnCenterY) * tension;

        vx = (vx + ax) * friction;
        vy = (vy + ay) * friction;

        acceptX.current += vx;
        acceptY.current += vy;

        gsap.set(acceptBtnRef.current, {
          x: acceptX.current,
          y: acceptY.current,
        });
      }
      animFrame = requestAnimationFrame(chaseLoop);
    };

    animFrame = requestAnimationFrame(chaseLoop);
    return () => cancelAnimationFrame(animFrame);
  }, [isVisible, showCaptcha]);

  // REJECT button evasive leap logic
  const handleRejectHover = () => {
    if (!rejectBtnRef.current) return;
    play('CLICK');
    
    // Jump to random nearby offset
    const distance = 160;
    const angle = Math.random() * Math.PI * 2;
    const jumpX = Math.cos(angle) * distance;
    const jumpY = Math.sin(angle) * distance;

    // Boundary safe zones
    const boundedX = Math.max(-200, Math.min(200, jumpX));
    const boundedY = Math.max(-80, Math.min(80, jumpY));

    gsap.to(rejectBtnRef.current, {
      x: boundedX,
      y: boundedY,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  // Trigger Cookie Consent blackmail popups on click Reject
  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    play('ERROR');
    triggerShake(800);
    triggerGlitch(400);
    incrementDamage(20);

    const blackmailTitles = [
      '💔 SPECIAL RELATIONSHIP ERROR',
      '⚠️ EMOTIONALLY DISTANT ATTEMPT',
      '🤡 COMPATIBILITY BLACKMAIL',
      '🚨 ATTACHMENT CRISIS LOG',
      '📱 TRAUMA INJECTOR'
    ];

    const blackmailContents = [
      'We thought this situationship was special. Why are you rejecting our cookies?',
      'Why are you being so avoidant? Please proceed with extreme emotional vulnerability.',
      'Are you checking other websites? We have screenshot logs of your history.',
      'We can change, we swear! Accept our terms or face attachment relapse.',
      'Is it because of our Y2K cookies? They are baked with unreleased trauma!'
    ];

    for (let i = 0; i < 5; i++) {
      addPopup({
        title: blackmailTitles[i],
        content: blackmailContents[i],
        x: Math.max(10, Math.min(80, (e.clientX / window.innerWidth) * 100 + (Math.random() - 0.5) * 45)),
        y: Math.max(10, Math.min(80, (e.clientY / window.innerHeight) * 100 + (Math.random() - 0.5) * 45)),
        type: 'toxic'
      });
    }
  };

  // Launch Captcha grid on Accept
  const handleAcceptClick = () => {
    play('DIALUP');
    setShowCaptcha(true);
    setSelectedBoxes(new Array(9).fill(false));
    setBoxOffsets(new Array(9).fill({ x: 0, y: 0 }));
  };

  // Checkbox evasive hover slides
  const handleCaptchaBoxHover = (index: number) => {
    play('CLICK');
    
    // Checkbox slides away dynamically from pointer bounding box
    setBoxOffsets((prev) => {
      const next = [...prev];
      next[index] = {
        x: (Math.random() - 0.5) * 180,
        y: (Math.random() - 0.5) * 180
      };
      return next;
    });
  };

  const handleSelectBox = (index: number) => {
    setSelectedBoxes(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
    play('CLICK');
  };

  // Submit Captcha evaluations
  const handleVerifyCaptcha = () => {
    const activeCount = selectedBoxes.filter(Boolean).length;
    
    play('ERROR');
    triggerShake(600);
    triggerGlitch(400);

    const nextAttempts = captchaAttempts + 1;
    setCaptchaAttempts(nextAttempts);

    if (nextAttempts >= 3) {
      // Exit criteria reached: existential bypass
      addPopup({
        title: '🧩 EXISTENTIAL BYPASS SUCCESS',
        content: 'Verification concluded: "No one is truly emotionally verified." Consent automatically forced.',
        x: 35,
        y: 40,
        type: 'therapy'
      });
      setIsVisible(false);
      setShowCaptcha(false);
      return;
    }

    if (captchaStage === 1) {
      setCaptchaStage(2);
      addPopup({
        title: '❌ INCORRECT EMOTIONAL JUDGMENT',
        content: 'AI predicts attachment relapse. Those choices represent clear avoidant attachment. Try again.',
        x: 40,
        y: 35,
        type: 'warning'
      });
    } else {
      setCaptchaStage(3);
      addPopup({
        title: '❌ FAILED CHALLENGE PROGRESSION',
        content: 'Wrong. You selected matches who reply "k" / "damn crazy". Stability degraded.',
        x: 45,
        y: 40,
        type: 'toxic'
      });
    }

    // Reset grid
    setSelectedBoxes(new Array(9).fill(false));
    setBoxOffsets(new Array(9).fill({ x: 0, y: 0 }));
  };

  // Captcha Grid Contents mapped based on stage
  const getCaptchaPrompt = () => {
    if (captchaStage === 1) return 'Select all emotionally available partners';
    if (captchaStage === 2) return 'Identify partners who will text you back on a Friday night';
    return 'Select individuals with resolved ex-trauma and healthy boundaries';
  };

  const CAPTCHA_CARDS = [
    { emoji: '👻', text: 'Ghoster expert. 4k unread DMs.' },
    { emoji: '📱', text: 'Replies "k" after 14 hours.' },
    { emoji: '🚩', text: 'Holds 8 Spotify ex-trackers.' },
    { emoji: '🫠', text: 'Says "I can fix them" hourly.' },
    { emoji: '🍷', text: 'Drunk texts "u up?" at 3 AM.' },
    { emoji: '🎸', text: 'Plays acoustic ex-guitar.' },
    { emoji: '💅', text: 'Double-texts Sneha.' },
    { emoji: '🤷‍♂️', text: 'Bio reads: "No drama please."' },
    { emoji: '🤫', text: 'Hides WhatsApp active status.' }
  ];

  return (
    <>
      {/* 1. BOTTOM DOCKED COOKIE BLACKMAIL BANNER */}
      <AnimatePresence>
        {isVisible && !showCaptcha && (
          <motion.div
            ref={bannerRef}
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-5 bg-black/95 border-t-2 border-[#FF007F] z-[10002] flex flex-col md:flex-row justify-between items-center gap-4 font-mono select-none"
            style={{ boxShadow: '0 -10px 40px rgba(255, 0, 127, 0.25)' }}
          >
            <div className="flex items-center gap-3 max-w-2xl">
              <ShieldAlert size={32} className="text-[#FF007F] animate-pulse shrink-0" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#FF007F] uppercase tracking-wider">⚠️ Y2K COOKIE BLACKMAIL WARNING</h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed uppercase">
                  This situationship uses toxic attachment cookies to blackmail you, monitor your emotional vulnerability ratios, and trigger ex-trauma scans. Do you accept love?
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center relative pr-8">
              {/* Reject Happiness Button: Evades clicks! */}
              <button
                ref={rejectBtnRef}
                onMouseEnter={handleRejectHover}
                onClick={handleRejectClick}
                className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500/10 text-[10px] uppercase font-bold rounded transition-colors duration-200"
              >
                Reject Happiness
              </button>

              {/* Accept Love Button: Magnetic cursor attract! */}
              <button
                ref={acceptBtnRef}
                onMouseEnter={() => { isHoveredAccept.current = true; }}
                onMouseLeave={() => {
                  isHoveredAccept.current = false;
                  gsap.to(acceptBtnRef.current, { x: 0, y: 0, duration: 0.4 });
                  acceptX.current = 0;
                  acceptY.current = 0;
                }}
                onClick={handleAcceptClick}
                className="px-6 py-2 bg-[#FF007F] text-black text-[10px] uppercase font-extrabold rounded shadow-[0_0_15px_#FF007F]"
              >
                Accept Love ❤️
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. NEVER-ENDING EXISTENTIAL CAPTCHA MODAL */}
      <AnimatePresence>
        {showCaptcha && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10003] flex items-center justify-center p-4 font-mono select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-zinc-950 border-2 border-cyan-500 rounded p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative overflow-hidden"
            >
              {/* Corner Glitch Ornaments */}
              <div className="absolute top-1 left-1 text-[8px] text-cyan-500/40">Y2K.OS.SEC</div>
              <div className="absolute top-1 right-1 text-[8px] text-cyan-500/40">SYS_SEC_V9</div>

              {/* Close Button: Spawns popups if clicked! */}
              <button 
                onClick={() => {
                  play('ERROR');
                  addPopup({
                    title: '🚨 BYPASS BLOCKED',
                    content: 'Nice try! You cannot unmatch from this emotional captcha. Submit verification parameters.',
                    x: 30,
                    y: 30,
                    type: 'toxic'
                  });
                }}
                className="absolute top-4 right-4 text-zinc-500 hover:text-cyan-500 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-1 pb-3 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Sparkles size={14} className="animate-spin text-cyan-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">EMOTIONAL VERIFICATION PORTAL</h3>
                  </div>
                  <p className="text-[9px] text-zinc-500 uppercase">Challenge Attempt: {captchaAttempts}/3</p>
                </div>

                {/* Prompt instructions banner */}
                <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded">
                  <h4 className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">Instructions:</h4>
                  <p className="text-[11px] text-white uppercase font-bold pt-1">{getCaptchaPrompt()}</p>
                </div>

                {/* Captcha 3x3 Choice Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  {CAPTCHA_CARDS.map((card, idx) => (
                    <motion.div
                      key={idx}
                      onMouseEnter={() => handleCaptchaBoxHover(idx)}
                      onClick={() => handleSelectBox(idx)}
                      className={`h-24 p-2 border rounded flex flex-col justify-between items-center text-center cursor-pointer transition-all relative overflow-hidden select-none ${
                        selectedBoxes[idx]
                          ? 'border-[#FF007F] bg-[#FF007F]/10 shadow-[0_0_10px_rgba(255,0,127,0.2)]'
                          : 'border-zinc-800 bg-black/40 hover:border-cyan-500/40'
                      }`}
                      style={{
                        transform: `translate3d(${boxOffsets[idx].x}px, ${boxOffsets[idx].y}px, 0)`,
                        transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                    >
                      <span className="text-2xl mt-1 select-none">{card.emoji}</span>
                      <span className="text-[7px] text-zinc-400 leading-tight uppercase font-mono tracking-tighter">
                        {card.text}
                      </span>

                      {/* Small mock verification checkbox circle */}
                      <div className={`absolute top-1 right-1 w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        selectedBoxes[idx]
                          ? 'border-[#FF007F] bg-[#FF007F] text-black'
                          : 'border-zinc-700 bg-zinc-900'
                      }`}>
                        {selectedBoxes[idx] && <Check size={8} strokeWidth={3} />}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Verification Actions footer */}
                <div className="flex justify-between items-center pt-4 border-t border-cyan-500/20 text-[9px] text-zinc-500">
                  <span>AI EMOTIONAL SECURITY SYSTEM v1.3</span>
                  
                  <button
                    onClick={handleVerifyCaptcha}
                    className="px-5 py-2.5 bg-cyan-500 text-black text-[9px] uppercase font-bold rounded shadow-[0_0_12px_rgba(6,182,212,0.4)] hover:bg-cyan-400 transition-colors"
                  >
                    Verify availability
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
