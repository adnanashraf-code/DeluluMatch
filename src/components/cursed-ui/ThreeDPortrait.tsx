'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDPortraitProps {
  emoji?: string;
  themeColor?: string; // e.g. '#FF007F' or '#8A2BE2'
}

export default function ThreeDPortrait({ emoji = '🫣', themeColor = '#FF007F' }: ThreeDPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // 2. Camera Setup
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 160;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    // 3. Renderer Setup (Alpha true for gorgeous background gradients)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Create the central "Relational Core" (glowing wireframe icosahedron)
    const coreColor = new THREE.Color(themeColor);
    const coreGeometry = new THREE.IcosahedronGeometry(6, 2);
    
    // Wireframe material for the Y2K net vibe
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: coreColor,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Inner glowing core
    const innerGeometry = new THREE.IcosahedronGeometry(2.5, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // 5. Create 3D Heart Particle Cloud
    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const pinkColor = new THREE.Color('#FF007F');
    const purpleColor = new THREE.Color('#8A2BE2');
    const cyanColor = new THREE.Color('#00F0FF');

    for (let i = 0; i < particleCount; i++) {
      // Parametric 3D Heart Math formula!
      const t = Math.random() * Math.PI * 2;
      
      // Basic 2D heart contour
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      // Map coordinates to fit our 3D space scale
      const scale = 0.55;
      const xScaled = x * scale;
      const yScaled = y * scale;
      
      // Make it thick 3D by adding normal-distributed z values
      const zScaled = (Math.random() - 0.5) * 12;

      // Add a bit of random offset/noise for gorgeous volumetric depth
      const noiseX = (Math.random() - 0.5) * 2;
      const noiseY = (Math.random() - 0.5) * 2;

      positions[i * 3] = xScaled + noiseX;
      positions[i * 3 + 1] = yScaled + noiseY;
      positions[i * 3 + 2] = zScaled;

      // Interpolate colors between custom neon Y2K accents
      const blend = Math.random();
      let color = pinkColor;
      if (blend > 0.6) color = purpleColor;
      else if (blend > 0.85) color = cyanColor;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random particle sizes
      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom glowing particle texture via Canvas 2D
    const createParticleTexture = () => {
      const size = 16;
      const canvasTex = document.createElement('canvas');
      canvasTex.width = size;
      canvasTex.height = size;
      const ctx = canvasTex.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 0, 127, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(canvasTex);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.85,
      map: createParticleTexture(),
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Interactive Mouse Move Parallax Setup
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Map to normalized device coordinates (-1 to 1)
      targetX = (x / rect.width) * 2 - 1;
      targetY = -(y / rect.height) * 2 + 1;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax spring interpolation
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      // Rotate Relational Core
      coreMesh.rotation.y = elapsedTime * 0.45;
      coreMesh.rotation.x = elapsedTime * 0.25;

      // Apply subtle mesh jitter/glitch spikes representing "attachment insecurity"
      const glitchChance = Math.random();
      if (glitchChance > 0.98) {
        coreMesh.scale.setScalar(1.08);
        coreMaterial.opacity = 1.0;
      } else {
        coreMesh.scale.setScalar(1.0);
        coreMaterial.opacity = 0.75 + Math.sin(elapsedTime * 4) * 0.1;
      }

      innerMesh.rotation.y = -elapsedTime * 0.8;
      innerMesh.rotation.z = elapsedTime * 0.4;

      // Rotate particle heart cloud opposite to the core
      particles.rotation.y = -elapsedTime * 0.15 + mouseX * 0.4;
      particles.rotation.x = mouseY * 0.3;

      // Pulse particle sizes slightly
      particleMaterial.size = 0.85 + Math.sin(elapsedTime * 3) * 0.1;

      // Draw scene
      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose WebGL resources cleanly to prevent leaks
      coreGeometry.dispose();
      coreMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [themeColor]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer overflow-hidden bg-black/60 rounded"
    >
      {/* 3D Canvas layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none block z-10" />

      {/* Floating Y2K Emojis rendered inside the 3D grid context */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <span className="text-5xl filter drop-shadow-[0_0_12px_rgba(255,0,127,0.4)] animate-pulse">
          {emoji}
        </span>
      </div>

      {/* Retro digital mesh overlays inside the canvas container */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_50%,rgba(0,0,0,0.85))] pointer-events-none z-15" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-25 pointer-events-none z-15" />
    </div>
  );
}
