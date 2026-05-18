'use client';

import { useEffect, useState, useRef } from 'react';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '@/components/audio/AudioProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldAlert, Award, Star } from 'lucide-react';
import gsap from 'gsap';

export default function CartThief() {
  const { play } = useSound();
  const { 
    cartItemsCount, 
    removeFromCart, 
    isGoblinActive, 
    setIsGoblinActive,
    addPopup,
    triggerShake,
    triggerGlitch,
    incrementDamage,
    cursorScale
  } = useChaosStore();

  const [showWarning, setShowWarning] = useState(false);
  const [goblinState, setGoblinState] = useState<'idle' | 'running' | 'snatching' | 'escaping' | 'defeated'>('idle');
  const [portalPos, setPortalPos] = useState({ x: 0, y: 0 });
  const [showPortal, setShowPortal] = useState(false);
  
  const goblinRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(0);
  const animationTl = useRef<gsap.core.Timeline | null>(null);

  // Trigger Goblin Theft Engine when cart count increases!
  useEffect(() => {
    if (cartItemsCount > prevCount.current) {
      // Avoid simultaneous duplicate spawns
      if (isGoblinActive || goblinState !== 'idle') {
        prevCount.current = cartItemsCount;
        return;
      }

      setIsGoblinActive(true);
      
      // Delay emotional sabotage by 2-4s randomly!
      const randomDelay = Math.random() * 2000 + 2000;
      const timeout = setTimeout(() => {
        startThiefSequence();
      }, randomDelay);

      prevCount.current = cartItemsCount;
      return () => clearTimeout(timeout);
    }
    prevCount.current = cartItemsCount;
  }, [cartItemsCount, isGoblinActive]);

  // Start the Relationship Goblin Chase Sequence
  const startThiefSequence = () => {
    // 1. Initial warning rumbling
    setShowWarning(true);
    play('ERROR');
    triggerShake(1000);
    triggerGlitch(500);

    setTimeout(() => {
      setShowWarning(false);
      setGoblinState('running');
      play('DIALUP');

      // 2. Query the live Cart's position in the header navigation
      const cartEl = document.querySelector('[data-id="emotional-cart"]');
      const cartRect = cartEl ? cartEl.getBoundingClientRect() : { left: window.innerWidth - 120, top: 30 };

      // Initialize Goblin positioning offscreen-left
      gsap.set(goblinRef.current, { x: -100, y: window.innerHeight / 2, opacity: 1, scale: 1, rotate: 0 });

      // Create complex GSAP motion path: zig-zag, wall bounce, slide!
      animationTl.current = gsap.timeline();
      
      animationTl.current
        // Stage A: Bouncing entrance & wall-jumps
        .to(goblinRef.current, {
          x: window.innerWidth * 0.25,
          y: window.innerHeight * 0.2,
          rotate: 15,
          duration: 0.8,
          ease: 'power1.out',
          onStart: () => play('CLICK')
        })
        .to(goblinRef.current, {
          x: window.innerWidth * 0.45,
          y: window.innerHeight * 0.7,
          rotate: -20,
          duration: 0.9,
          ease: 'bounce.out',
          onStart: () => play('CLICK')
        })
        // Stage B: Slide-sneak fast towards cart
        .to(goblinRef.current, {
          x: cartRect.left - 50,
          y: cartRect.top + 35,
          rotate: 35,
          duration: 1.1,
          ease: 'sine.inOut',
          onComplete: () => {
            snatchItem(cartRect);
          }
        });
    }, 1800);
  };

  // Snatch Cart Item successfully
  const snatchItem = (cartRect: { left: number; top: number }) => {
    setGoblinState('snatching');
    play('RIP');
    triggerShake(800);

    // Dynamic scale spring visual feedback on header cart icon
    const cartEl = document.querySelector('[data-id="emotional-cart"]') as HTMLElement;
    if (cartEl) {
      gsap.to(cartEl, { scale: 1.4, duration: 0.15, yoyo: true, repeat: 1 });
    }

    // Snatch delay
    setTimeout(() => {
      // Remove item and trigger comedy alarm popup
      removeFromCart();
      incrementDamage(15);
      
      addPopup({
        title: '🚨 RELATIONSHIP GREMLIN LOOT',
        content: 'Warning! The Relationship Goblin successfully snatched your Emotional Stable Match from the cart and dissolved your attachment parameters!',
        x: 40,
        y: 40,
        type: 'warning'
      });

      // Stage C: Escape Portal sequence
      setGoblinState('escaping');
      const escapeX = window.innerWidth + 120;
      const escapeY = window.innerHeight * 0.4;
      
      setPortalPos({ x: escapeX - 200, y: escapeY });

      animationTl.current = gsap.timeline();
      animationTl.current.to(goblinRef.current, {
        x: escapeX - 160,
        y: escapeY,
        rotate: -360,
        duration: 1.2,
        ease: 'power2.in',
        onComplete: () => {
          // Open glitched exit portal
          setShowPortal(true);
          play('DIALUP');
          
          setTimeout(() => {
            setShowPortal(false);
            resetThief();
          }, 600);
        }
      });
    }, 400);
  };

  // Click on Goblin to defeat it!
  const handleDefeatGoblin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (goblinState !== 'running' && goblinState !== 'snatching') return;

    // Pause current timelines
    if (animationTl.current) {
      animationTl.current.kill();
    }

    setGoblinState('defeated');
    play('ERROR');
    triggerGlitch(800);

    addPopup({
      title: '🏆 GREMLIN SLAIN!',
      content: 'Epic Reflexes! You slapped the Relationship Goblin in time. Lost emotional cart items successfully recovered!',
      x: 35,
      y: 45,
      type: 'therapy'
    });

    // Fly Goblin offscreen downwards crying
    gsap.to(goblinRef.current, {
      y: window.innerHeight + 150,
      rotate: 720,
      scale: 0.4,
      duration: 1.5,
      ease: 'power3.in',
      onComplete: () => {
        resetThief();
      }
    });
  };

  const resetThief = () => {
    setGoblinState('idle');
    setIsGoblinActive(false);
  };

  return (
    <div className="fixed inset-0 z-[10001] pointer-events-none select-none">
      
      {/* 1. SUSPICIOUS WARNING FLASHER BANNER */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 border border-red-500 bg-black/90 text-red-500 rounded font-mono text-[10px] tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] z-50 pointer-events-auto"
          >
            <AlertCircle size={12} className="animate-ping text-red-500" />
            <span>⚠️ SUSPICIOUS EMOTIONAL CACHE ACTIVITY DETECTED...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THE RELATIONSHIP GOBLIN SPRITE ELEMENT */}
      {goblinState !== 'idle' && (
        <div
          ref={goblinRef}
          onClick={handleDefeatGoblin}
          className={`absolute pointer-events-auto cursor-pointer shrink-0 z-50 ${
            goblinState === 'running' ? 'hover:scale-105' : ''
          }`}
          style={{ width: '80px', height: '80px', transformOrigin: 'center' }}
          title={goblinState === 'running' ? 'CLICK TO SLAP GREMLIN!' : ''}
        >
          <GoblinSVG isDefeated={goblinState === 'defeated'} />
          
          {/* Defeat impact flash */}
          {goblinState === 'defeated' && (
            <div className="absolute inset-0 bg-cyan-300 rounded-full animate-ping opacity-45 pointer-events-none" />
          )}

          {/* Click CTA Indicator */}
          {goblinState === 'running' && (
            <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 bg-cyan-900 border border-cyan-400 text-cyan-200 text-[6px] font-mono px-1 rounded uppercase tracking-tighter whitespace-nowrap animate-bounce font-bold">
              TAP ME!
            </div>
          )}
        </div>
      )}

      {/* 3. GLITCH PORTAL CIRCLE VISUAL FEEDBACK */}
      {showPortal && (
        <div
          className="absolute w-24 h-24 rounded-full border-4 border-dashed border-[#FF007F] animate-spin"
          style={{
            left: portalPos.x - 48,
            top: portalPos.y - 48,
            boxShadow: '0 0 30px #FF007F'
          }}
        />
      )}
    </div>
  );
}

// Full vector custom SVG representation of the Relationship Goblin character
function GoblinSVG({ isDefeated }: { isDefeated: boolean }) {
  return (
    <svg width="80" height="80" viewBox="0 0 100 100" className="animate-bounce" style={{ filter: 'drop-shadow(0 0 12px #FF007F)' }}>
      {/* Stitched Hoodie Body */}
      <path d="M22,60 C22,40 37,28 50,28 C63,28 78,40 78,60 C78,74 68,84 50,84 C32,84 22,74 22,60 Z" fill="#1b0824" stroke="#FF007F" strokeWidth="2" />
      
      {/* Broken Heart Backpack */}
      <path d="M15,50 C10,40 2,45 8,55 L15,62 L22,55 C28,45 20,40 15,50 Z" fill="#8A2BE2" stroke="#FF007F" />
      <line x1="12" y1="52" x2="18" y2="58" stroke="#1b0824" strokeWidth="1.5" />
      
      {/* Glowing Toxic Eyes */}
      {isDefeated ? (
        <>
          {/* Knocked out eyes */}
          <text x="35" y="48" fill="#00FFFF" fontSize="12" fontFamily="monospace">x</text>
          <text x="55" y="48" fill="#00FFFF" fontSize="12" fontFamily="monospace">x</text>
          {/* Crying drops */}
          <circle cx="38" cy="54" r="2" fill="#00FFFF" />
          <circle cx="58" cy="54" r="2" fill="#00FFFF" />
        </>
      ) : (
        <>
          {/* Glowing toxic neon eyes */}
          <circle cx="38" cy="46" r="5" fill="#00FFFF" className="animate-pulse" />
          <circle cx="58" cy="46" r="5" fill="#00FFFF" className="animate-pulse" />
          {/* Tiny pupils */}
          <circle cx="38" cy="46" r="1.5" fill="#000" />
          <circle cx="58" cy="46" r="1.5" fill="#000" />
        </>
      )}
      
      {/* Hoodie stitches */}
      <path d="M50,28 L50,84" stroke="#FF007F" strokeWidth="1.5" strokeDasharray="3,3" />
      
      {/* Goblin Ears */}
      <polygon points="17,35 2,16 22,28" fill="#1b0824" stroke="#FF007F" strokeWidth="1.5" />
      <polygon points="83,35 98,16 78,28" fill="#1b0824" stroke="#FF007F" strokeWidth="1.5" />
      
      {/* Grinning Mouth */}
      <path d="M38,62 Q50,72 62,62" fill="none" stroke="#FF007F" strokeWidth="2" />
    </svg>
  );
}
