'use client';

import { useChaosStore, DeluluPopup } from '@/store/useChaosStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ShieldAlert, HeartCrack, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSound } from '@/components/audio/AudioProvider';

export default function PopupManager() {
  const { popups, removePopup } = useChaosStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      <AnimatePresence>
        {popups.map((popup) => (
          <CursedPopup key={popup.id} popup={popup} onClose={() => removePopup(popup.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function CursedPopup({ popup, onClose }: { popup: DeluluPopup; onClose: () => void }) {
  const { play } = useSound();
  
  // Play error sound when spawned
  useEffect(() => {
    play('ERROR');
  }, [play]);

  const rotation = (Math.random() - 0.5) * 6;

  // Aesthetic color maps
  const typeStyles = {
    toxic: 'border-[#FF007F] shadow-[4px_4px_0px_rgba(255,0,127,0.3)] bg-black/90 text-white',
    warning: 'border-[#FF0000] shadow-[4px_4px_0px_rgba(255,0,0,0.3)] bg-black/90 text-white',
    alert: 'border-[#8A2BE2] shadow-[4px_4px_0px_rgba(138,43,226,0.3)] bg-black/90 text-white',
    therapy: 'border-[#32CD32] shadow-[4px_4px_0px_rgba(50,205,50,0.3)] bg-black/90 text-white',
  };

  const headerColors = {
    toxic: 'bg-[#FF007F] text-black',
    warning: 'bg-[#FF0000] text-white',
    alert: 'bg-[#8A2BE2] text-white',
    therapy: 'bg-[#32CD32] text-black',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, x: `${popup.x}vw`, y: `${popup.y}vh` }}
      animate={{ scale: 1, opacity: 1, rotate: rotation }}
      exit={{ scale: 1.1, opacity: 0, filter: 'blur(8px)' }}
      className={`absolute pointer-events-auto w-80 border-2 rounded flex flex-col backdrop-blur-md ${typeStyles[popup.type]}`}
      style={{ left: 0, top: 0, transform: `translate(-50%, -50%)` }}
    >
      <div className={`px-2 py-1 flex justify-between items-center font-mono text-[10px] uppercase font-bold tracking-wider ${headerColors[popup.type]}`}>
        <div className="flex items-center gap-1.5">
          {popup.type === 'toxic' && <HeartCrack size={12} />}
          {popup.type === 'warning' && <ShieldAlert size={12} />}
          {popup.type === 'alert' && <AlertTriangle size={12} />}
          {popup.type === 'therapy' && <Flame size={12} />}
          <span className="font-mono">{popup.title}</span>
        </div>
        <button 
          onClick={onClose}
          className="hover:bg-black/20 hover:text-white rounded transition-colors p-0.5"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-3 font-mono text-xs space-y-3">
        <p className="leading-relaxed text-[11px] text-pink-100/90">{popup.content}</p>
        
        <div className="flex justify-end gap-1.5 pt-1">
          <button 
            onClick={onClose}
            className="px-2.5 py-1 border border-[#FF007F] text-[#FF007F] hover:bg-[#FF007F] hover:text-black font-bold uppercase transition-all duration-200 text-[10px] rounded"
          >
            I ACCEPTS MY DELUSION
          </button>
        </div>
      </div>
    </motion.div>
  );
}
