'use client';

import { useEffect, useRef } from 'react';
import { useSound } from '@/components/audio/AudioProvider';
import { createTearPolygon } from '@/lib/svg-utils';
import gsap from 'gsap';

export default function UniversalTearEngine() {
  const { play } = useSound();
  const activeTear = useRef<{
    element: HTMLElement;
    startY: number;
    currentY: number;
    rect: DOMRect;
  } | null>(null);

  useEffect(() => {
    // 1. Mouse/Touch Start Listener
    const handleStart = (e: MouseEvent | TouchEvent) => {
      // Find closest element with [data-tearable="true"]
      const target = e.target as HTMLElement;
      const tearable = target.closest('[data-tearable="true"]') as HTMLElement;

      if (!tearable || tearable.getAttribute('data-torn') === 'true') return;

      // Ignore if clicking on input, select, textarea, or anchor tags
      if (['INPUT', 'SELECT', 'TEXTAREA', 'A', 'BUTTON'].includes(target.tagName)) return;

      // Prevent standard browser image dragging
      e.preventDefault();

      const pageY = 'touches' in e ? e.touches[0].pageY : e.pageY;
      const rect = tearable.getBoundingClientRect();

      activeTear.current = {
        element: tearable,
        startY: pageY,
        currentY: pageY,
        rect,
      };

      // Set active pointer styling and prepare skew origin
      tearable.style.cursor = 'grabbing';
      tearable.style.transformOrigin = 'top left';
      tearable.style.transition = 'transform 0.05s ease';
      
      // Spawn subtle warning vibration
      play('CLICK');
    };

    // 2. Drag Tracking Listener (Pointer Tension & Skew)
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!activeTear.current) return;

      const { element, startY, rect } = activeTear.current;
      const pageY = 'touches' in e ? e.touches[0].pageY : e.pageY;
      const deltaY = Math.max(0, pageY - startY);

      activeTear.current.currentY = pageY;

      // Skew and warp element during drag (Pointer tension tracking)
      const skewX = deltaY * 0.14;
      const rotate = deltaY * 0.04;
      
      element.style.transform = `translateY(${deltaY}px) skewX(${skewX}deg) rotate(${rotate}deg)`;

      // If drag distance exceeds threshold, trigger physical rip!
      if (deltaY > 80) {
        triggerPhysicalRip(element, rect);
        cleanupActiveTear();
      }
    };

    // 3. Mouse/Touch End Release Listener
    const handleEnd = () => {
      if (!activeTear.current) return;

      const { element } = activeTear.current;

      // Elastic Spring-Back animation if released before tearing threshold
      gsap.to(element, {
        y: 0,
        skewX: 0,
        rotate: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
        onComplete: () => {
          element.style.cursor = 'grab';
          element.style.transition = '';
        }
      });

      cleanupActiveTear();
    };

    const cleanupActiveTear = () => {
      activeTear.current = null;
    };

    // 4. Physical Ripping Physics & Projection Generator
    const triggerPhysicalRip = (element: HTMLElement, rect: DOMRect) => {
      element.setAttribute('data-torn', 'true');
      
      // Play high-fidelity RIP tearing sound effect
      play('RIP');

      // Create static overlays container
      let overlayContainer = document.getElementById('universal-tearing-overlay-container');
      if (!overlayContainer) {
        overlayContainer = document.createElement('div');
        overlayContainer.id = 'universal-tearing-overlay-container';
        overlayContainer.style.position = 'fixed';
        overlayContainer.style.inset = '0';
        overlayContainer.style.pointerEvents = 'none';
        overlayContainer.style.zIndex = '99999';
        document.body.appendChild(overlayContainer);
      }

      // Hide original element layout, preserving DOM spacing
      element.style.visibility = 'hidden';

      const width = rect.width;
      const height = rect.height;
      const tearY = height * 0.5; // Split clean horizontally down the center

      // Calculate matching jagged cut fibers path
      const topPath = createTearPolygon(width, height, tearY, true);
      const bottomPath = createTearPolygon(width, height, tearY, false);

      // SPAWN TOP CLONED PIECE
      const topClone = document.createElement('div');
      topClone.className = 'gpu-accelerated';
      topClone.style.position = 'fixed';
      topClone.style.left = `${rect.left}px`;
      topClone.style.top = `${rect.top}px`;
      topClone.style.width = `${width}px`;
      topClone.style.height = `${height}px`;
      topClone.style.clipPath = `path('${topPath}')`;
      
      const topInner = element.cloneNode(true) as HTMLElement;
      topInner.style.visibility = 'visible';
      topInner.style.transform = 'none';
      topInner.style.transition = 'none';
      topClone.appendChild(topInner);

      // SPAWN BOTTOM TORN PIECE
      const bottomClone = document.createElement('div');
      bottomClone.className = 'gpu-accelerated';
      bottomClone.style.position = 'fixed';
      bottomClone.style.left = `${rect.left}px`;
      bottomClone.style.top = `${rect.top}px`;
      bottomClone.style.width = `${width}px`;
      bottomClone.style.height = `${height}px`;
      bottomClone.style.clipPath = `path('${bottomPath}')`;
      
      const bottomInner = element.cloneNode(true) as HTMLElement;
      bottomInner.style.visibility = 'visible';
      bottomInner.style.transform = 'none';
      bottomInner.style.transition = 'none';
      bottomClone.appendChild(bottomInner);

      overlayContainer.appendChild(topClone);
      overlayContainer.appendChild(bottomClone);

      // 5. Physics Swing & Gravity Drop Animations (GSAP)
      // Top fiber piece shakes briefly on impact, then dissolves
      gsap.to(topClone, {
        y: -10,
        rotate: -2,
        duration: 0.15,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          gsap.to(topClone, {
            opacity: 0,
            y: -30,
            duration: 1.5,
            ease: 'power2.in',
            onComplete: () => topClone.remove()
          });
        }
      });

      // Bottom piece falls under gravity, swings horizontally with spring-damping overshoot, and settles/drops off-screen
      gsap.timeline({
        onComplete: () => {
          bottomClone.remove();
          
          // Fire a custom complete event on the original element
          const event = new CustomEvent('universal-tear-complete', { bubbles: true });
          element.dispatchEvent(event);

          // Check if dynamic redirect or action requested
          const redirect = element.getAttribute('data-tear-redirect');
          if (redirect) {
            window.location.href = redirect;
          } else {
            // Remove target element fully from tree after drop completes
            element.remove();
          }
        }
      })
      .to(bottomClone, {
        y: window.innerHeight - rect.top + 100, // Fall completely below viewport
        rotate: 15,
        skewX: -5,
        duration: 1.4,
        ease: 'power3.in',
      })
      .to(bottomClone, {
        rotate: -8,
        duration: 0.4,
        ease: 'sine.inOut',
      }, 0.2) // Staggered spring swing overlay
      .to(bottomClone, {
        rotate: 4,
        duration: 0.3,
        ease: 'sine.inOut',
      }, 0.6);
    };

    window.addEventListener('mousedown', handleStart, { passive: false });
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseup', handleEnd, { passive: true });

    window.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handleStart);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);

      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [play]);

  return null;
}
