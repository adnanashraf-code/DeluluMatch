'use client';

import { ReactNode, useEffect } from 'react';
import gsap from 'gsap';

export default function Template({ children }: { children: ReactNode }) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page Enter Animation with scale/skew offsets
      gsap.fromTo(
        'main',
        { 
          opacity: 0, 
          y: 20,
          scale: 0.98,
          filter: 'blur(10px)' 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2, 
          ease: 'power4.out',
          delay: 0.5
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="w-full h-full min-h-screen">
      {children}
    </main>
  );
}
