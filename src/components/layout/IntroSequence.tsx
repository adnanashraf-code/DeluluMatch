'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../audio/AudioProvider';

const BOOT_LOG = [
  'INITIALIZING DELULUMATCH ENGINE v1.2.0...',
  'SCANNING ATTACHMENT STYLE: Highly Avoidant...',
  'VERIFYING UNRESOLVED EX-TRAUMA: 98% Corrupted...',
  'CALIBRATING HEARTBREAK VOLATILITY INDEX...',
  'ESTABLISHING UNSUBSTANTIATED COMPATIBILITY LIES...',
  'READY TO EMOTIONALLY MANIPULATE.'
];

export default function IntroSequence() {
  const [show, setShow] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const { play } = useSound();

  useEffect(() => {
    // Sequence starts
    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < BOOT_LOG.length) {
        setLogs(prev => [...prev, BOOT_LOG[currentLog]]);
        currentLog++;
        play('CLICK');
      } else {
        clearInterval(logInterval);
        setTimeout(() => setShow(false), 1200);
      }
    }, 450);

    return () => clearInterval(logInterval);
  }, [play]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ 
            scaleY: 0.01, 
            scaleX: 1.5, 
            opacity: 0,
            transition: { duration: 0.5, ease: 'circIn' } 
          }}
          className="fixed inset-0 z-[10002] bg-black flex flex-col items-center justify-center p-8 font-mono"
        >
          {/* CRT Bloom Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,0,127,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
          
          <div className="w-full max-w-lg space-y-2 text-[#FF007F] text-xs">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="opacity-50 font-mono">[{i}]</span>
                <span className="font-mono">{log}</span>
              </div>
            ))}
            <motion.div
              animate={{ opacity: [0, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="w-2 h-4 bg-[#FF007F]"
            />
          </div>

          <div className="absolute bottom-8 text-[10px] text-[#FF007F]/45 animate-pulse uppercase tracking-[0.5em] font-mono">
            DELULUMATCH EMOTIONAL PORTAL
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
