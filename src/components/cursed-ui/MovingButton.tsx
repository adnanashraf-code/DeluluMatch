'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../audio/AudioProvider';

interface MovingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function MovingButton({ children, onClick, className }: MovingButtonProps) {
  const { play } = useSound();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    // Evasive action logic - spring escape
    const distance = 140;
    const angles = [30, 60, 120, 150, 210, 240, 300, 330];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const rad = (angle * Math.PI) / 180;
    
    const newX = position.x + Math.cos(rad) * distance;
    const newY = position.y + Math.sin(rad) * distance;

    // Constrain escape bounds to viewport center area to prevent going off-screen entirely
    const boundedX = Math.max(-250, Math.min(250, newX));
    const boundedY = Math.max(-180, Math.min(180, newY));

    setPosition({ x: boundedX, y: boundedY });
    play('CLICK');
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', damping: 12, stiffness: 220 }}
      className={`px-8 py-3.5 bg-[#FF007F] text-black font-bold uppercase tracking-wider relative rounded border-2 border-black shadow-[4px_4px_0px_#8A2BE2] hover:shadow-[0px_0px_20px_#FF007F] transition-all duration-300 ${className}`}
      style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
