'use client';

import { useEffect } from 'react';
import { useChaosStore } from '@/store/useChaosStore';
import { motion } from 'framer-motion';

export default function ChaosController() {
  const { isShaking, isGlitching, addPopup, clearPopups, triggerShake, triggerGlitch, randomizeOnlineUsers } = useChaosStore();

  useEffect(() => {
    // 1. Clear any active popups on initial mount to guarantee a clean screen!
    clearPopups();

    // Disable all chaotic background loops on thank you page to prevent any unexpected popups or errors!
    if (window.location.pathname.includes('/thank-you')) {
      return;
    }

    // Check if on mobile or small screen to reduce chaos spam
    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

    // Staged chaos ticks
    const interval = setInterval(() => {
      randomizeOnlineUsers();

      // Random glitch injections - scaled down on mobile
      if (Math.random() > (isMobile ? 0.97 : 0.85)) {
        triggerGlitch();
      }

      // Random subtle screen shakes - scaled down on mobile
      if (Math.random() > (isMobile ? 0.98 : 0.9)) {
        triggerShake(400);
      }

      // Gradual popup spawning: spawn a popup every 5s under the 5-cap limit
      const currentPopups = useChaosStore.getState().popups;
      const currentTsunami = useChaosStore.getState().tsunamiState;

      if (!isMobile && currentPopups.length < 5 && currentTsunami === 'idle') {
        const warningTypes: Array<'toxic' | 'warning' | 'alert' | 'therapy'> = ['toxic', 'warning', 'alert', 'therapy'];
        const randomType = warningTypes[Math.floor(Math.random() * warningTypes.length)];
        const alerts = [
          { title: '⚠️ ANXIETY INCOMING', content: 'Compatibility engine predicts dry texting behavior from matches. Prepare emotional barriers.' },
          { title: '⚠️ RE-EVALUATION LOG', content: 'Are you sure you are ready to be gaslit again? Attachment style: Highly Avoidant.' },
          { title: '⚠️ EX ACTIVE', content: 'Your ex is currently updating their bio. Proceed with complete caution.' },
          { title: '⚠️ LOW STANDARDS DETECTED', content: 'Standards meter fell below safety threshold. Therapy DLC purchase recommended.' },
          { title: '⚠️ SYSTEM FAILURE', content: 'Unresolved relationship situationship detected in active memory cache.' }
        ];

        // Pick an alert that isn't already displayed to ensure unique errors on screen
        const activeTitles = currentPopups.map((p) => p.title);
        const availableAlerts = alerts.filter((a) => !activeTitles.includes(a.title));
        const selectedAlert = availableAlerts.length > 0 ? availableAlerts[0] : alerts[Math.floor(Math.random() * alerts.length)];
        
        addPopup({
          title: selectedAlert.title,
          content: selectedAlert.content,
          x: Math.random() * 50 + 20,
          y: Math.random() * 50 + 20,
          type: randomType
        });
      }
    }, 5000); // Consistent 5s interval for a dramatic gradual build-up!

    return () => clearInterval(interval);
  }, [addPopup, clearPopups, triggerShake, triggerGlitch, randomizeOnlineUsers]);

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
