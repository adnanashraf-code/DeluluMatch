'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { generateJaggedPath } from '@/lib/svg-utils';
import { useSound } from '@/components/audio/AudioProvider';

interface TearingContainerProps {
  children: React.ReactNode;
  underlayer?: React.ReactNode;
  id: string;
  autoTearTrigger?: boolean;
  tearType?: 'horizontal' | 'diagonal';
  onTearComplete?: () => void;
}

export default function TearingContainer({ 
  children, 
  underlayer, 
  id, 
  autoTearTrigger = false, 
  tearType = 'horizontal',
  onTearComplete
}: TearingContainerProps) {
  const { play } = useSound();
  const [isTorn, setIsTorn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tearPath, setTearPath] = useState("");

  const dragY = useMotionValue(0);
  const springY = useSpring(dragY, { damping: 20, stiffness: 100 });
  
  const skew = useTransform(dragY, [0, 100], [0, 5]);
  const rotate = useTransform(dragY, [0, 100], [0, 2]);

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleTear = (currentWidth: number, currentHeight: number) => {
    if (isTorn || currentWidth === 0) return;
    
    let path = "";
    if (tearType === 'horizontal') {
      const tearY = currentHeight * 0.45;
      path = generateJaggedPath(0, tearY, currentWidth, tearY, 30, 12);
    } else if (tearType === 'diagonal') {
      // Top-left to bottom-right diagonal tear
      path = generateJaggedPath(0, 0, currentWidth, currentHeight, 40, 20);
    }
    setTearPath(path);
    
    setIsTorn(true);
    play('RIP');
  };

  // Watch for manual drag threshold to initiate tear
  useEffect(() => {
    return dragY.on('change', (latest) => {
      if (latest > 80 && !isTorn && dimensions.width > 0 && !autoTearTrigger) {
        handleTear(dimensions.width, dimensions.height);
      }
    });
  }, [dragY, isTorn, dimensions, autoTearTrigger]);

  // Watch for when the torn piece is dragged or drops completely off-screen to trigger navigation
  useEffect(() => {
    if (!isTorn || !onTearComplete) return;

    return dragY.on('change', (latest) => {
      // If bottom piece is dragged past half the viewport or dropped off-screen
      if (latest > 280) {
        onTearComplete();
      }
    });
  }, [isTorn, dragY, onTearComplete]);

  // Watch for programmatic auto tear
  useEffect(() => {
    if (autoTearTrigger && !isTorn && dimensions.width > 0) {
      handleTear(dimensions.width, dimensions.height);
      // Aggressive drop for auto tear
      setTimeout(() => {
        springY.set(dimensions.height * 0.65);
        
        // If navigation callback is active, trigger after visual split completion
        if (onTearComplete) {
          setTimeout(() => {
            onTearComplete();
          }, 1200);
        }
      }, 100);
    }
  }, [autoTearTrigger, isTorn, dimensions, onTearComplete]);

  // SVG Path strings for clip-path
  // TOP: (0,0) -> (W,0) -> (W,TearY) -> [Jagged Path Back to 0] -> (0,0)
  const clipPathTop = isTorn && tearPath
    ? `path('${tearPath} L ${dimensions.width} 0 L 0 0 Z')`
    : 'none';
    
  // BOTTOM: [Jagged Path] -> (W,H) -> (0,H) -> (0,TearY)
  const clipPathBottom = isTorn && tearPath
    ? `path('${tearPath} L ${dimensions.width} ${dimensions.height} L 0 ${dimensions.height} Z')`
    : 'none';

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      id={`tearing-root-${id}`}
    >
      {/* 1. UNDERLAYER */}
      {isTorn && (
        <div className="absolute inset-0 z-0 bg-[#FF007F]/5 flex items-center justify-center border border-dashed border-[#FF007F]/20 rounded-lg">
          {underlayer || (
            <div className="font-mono text-[10px] text-[#FF007F] opacity-40 rotate-12 p-8 uppercase tracking-widest text-center">
              TRAUMA UNLOCKED
            </div>
          )}
        </div>
      )}

      {/* 2. TOP PIECE */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none gpu-accelerated"
        style={{ 
          clipPath: clipPathTop,
        }}
      >
        <div className="pointer-events-auto h-full w-full bg-[#120516] border border-[#FF007F]/30 rounded-lg">
          {children}
        </div>
      </motion.div>

      {/* 3. BOTTOM / TORN PIECE */}
      <motion.div
        className="absolute inset-0 z-30 gpu-accelerated"
        drag={isTorn ? "y" : false}
        dragConstraints={{ top: 0, bottom: 1200 }}
        style={{ 
          clipPath: clipPathBottom,
          y: isTorn ? dragY : springY,
          rotate: isTorn ? 4 : rotate,
          skewX: isTorn ? 0 : skew,
          transformOrigin: 'top left'
        }}
        animate={isTorn ? {
          rotate: 0,
          transition: { type: 'spring', damping: 4, stiffness: 50 }
        } : {}}
      >
        <div className="h-full w-full bg-[#120516] border border-[#FF007F]/30 shadow-2xl rounded-lg">
          {children}
        </div>
      </motion.div>

      {/* 4. DRAG HANDLE - Hidden if autoTearTrigger is used */}
      {!isTorn && !autoTearTrigger && (
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 300 }}
          style={{ y: dragY }}
          className="absolute bottom-0 right-0 w-32 h-32 z-50 flex items-end justify-end p-4 group cursor-grab active:cursor-grabbing"
        >
          <div className="relative">
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-foreground/10 rounded-tl-full blur-sm group-hover:bg-foreground/20 transition-all" />
            <div className="text-[10px] font-mono text-white/40 group-hover:text-[#FF007F] font-bold uppercase tracking-tighter whitespace-nowrap origin-bottom-right -rotate-90 translate-x-4">
              TEAR CORNER FOR RED FLAGS
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
