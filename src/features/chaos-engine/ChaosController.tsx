'use client';

import { useEffect } from 'react';
import { useChaosStore } from '@/store/useChaosStore';
import { motion } from 'framer-motion';

export default function ChaosController() {
  const { isShaking, isGlitching, addPopup, triggerShake, triggerGlitch, randomizeOnlineUsers } = useChaosStore();

  useEffect(() => {
    // Staged chaos ticks
    const interval = setInterval(() => {
      randomizeOnlineUsers();

      // Random glitch injections
      if (Math.random() > 0.85) {
        triggerGlitch();
      }

      // Random subtle screen shakes
      if (Math.random() > 0.9) {
        triggerShake(400);
      }

      // Random popup spawning
      if (Math.random() > 0.8) {
        const warningTypes: Array<'toxic' | 'warning' | 'alert' | 'therapy'> = ['toxic', 'warning', 'alert', 'therapy'];
        const randomType = warningTypes[Math.floor(Math.random() * warningTypes.length)];
        const alerts = [
          { title: '⚠️ ANXIETY INCOMING', content: 'Compatibility engine predicts dry texting behavior from matches. Prepare emotional barriers.' },
          { title: '⚠️ RE-EVALUATION LOG', content: 'Are you sure you are ready to be gaslit again? Attachment style: Highly Avoidant.' },
          { title: '⚠️ EX ACTIVE', content: 'Your ex is currently updating their bio. Proceed with complete caution.' },
          { title: '⚠️ LOW STANDARDS DETECTED', content: 'Standards meter fell below safety threshold. Therapy DLC purchase recommended.' }
        ];
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        
        addPopup({
          title: randomAlert.title,
          content: randomAlert.content,
          x: Math.random() * 50 + 25,
          y: Math.random() * 50 + 25,
          type: randomType
        });
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [addPopup, triggerShake, triggerGlitch, randomizeOnlineUsers]);

  return (
    <>
      <motion.div
        animate={isShaking ? {
          x: [0, -8, 8, -8, 8, -4, 4, 0],
          y: [0, 4, -4, 4, -4, 2, -2, 0],
        } : {}}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 pointer-events-none z-[10001]"
        style={{
          boxShadow: isShaking ? 'inset 0 0 100px rgba(255, 0, 127, 0.3)' : 'none',
          borderColor: isShaking ? '#FF007F' : 'transparent',
          borderWidth: isShaking ? '4px' : '0px',
        }}
      />
      {isGlitching && (
        <div className="fixed inset-0 pointer-events-none z-[10002] bg-pink-500/10 mix-blend-overlay animate-pulse" />
      )}
    </>
  );
}
