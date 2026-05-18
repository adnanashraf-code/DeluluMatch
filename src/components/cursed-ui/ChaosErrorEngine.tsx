'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function GlitchedMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  // Generate customized spiked/deformed geometry
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 2);
    const pos = geo.attributes.position;
    // Displace vertices permanently to make it spiked and chaotic
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const len = Math.sqrt(x*x + y*y + z*z);
      if (len > 0) {
        const factor = 1.0 + (Math.sin(x * 4.0) * Math.cos(y * 4.0) * 0.25);
        pos.setXYZ(i, (x / len) * 2 * factor, (y / len) * 2 * factor, (z / len) * 2 * factor);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current && wireRef.current) {
      // Chaotic rotations
      meshRef.current.rotation.x = time * 0.6 + Math.sin(time * 2.0) * 0.15;
      meshRef.current.rotation.y = time * 0.4;
      wireRef.current.rotation.x = time * 0.6 + Math.sin(time * 2.0) * 0.15;
      wireRef.current.rotation.y = time * 0.4;

      // High frequency glitch scale vibrations
      if (Math.random() > 0.93) {
        const scaleVal = 0.85 + Math.random() * 0.45;
        meshRef.current.scale.set(scaleVal, scaleVal, scaleVal);
        wireRef.current.scale.set(scaleVal + 0.05, scaleVal + 0.05, scaleVal + 0.05);
      } else {
        meshRef.current.scale.setScalar(1.0);
        wireRef.current.scale.setScalar(1.05);
      }
    }
  });

  return (
    <group>
      {/* Solid distorted core */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial 
          color="#0c0214" 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Glowing neon wireframe overlay */}
      <mesh ref={wireRef} geometry={geometry}>
        <meshBasicMaterial 
          color="#FF007F" 
          wireframe 
          transparent
          opacity={0.88}
        />
      </mesh>
    </group>
  );
}

function ErrorParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 180;

  // Custom particle glow texture
  const particleTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255, 0, 127, 1.0)');  // Neon Pink core
      gradient.addColorStop(0.3, 'rgba(138, 43, 226, 0.7)'); // Violet mid
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;      // X bounds
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;  // Y bounds
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;   // Z bounds
      spd[i] = Math.random() * 1.5 + 0.8;           // speed factor
    }
    return [pos, spd];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Floating upwards organically
      let yVal = posAttr.getY(i) + speeds[i] * 0.015;
      if (yVal > 6) {
        yVal = -6; // wrap around
      }
      posAttr.setY(i, yVal);

      // Horizontal wave oscillation
      let xVal = posAttr.getX(i) + Math.sin(time * speeds[i] + i) * 0.005;
      
      // Cyber glitch translation spikes
      if (Math.random() > 0.992) {
        xVal += (Math.random() - 0.5) * 1.8;
      }
      posAttr.setX(i, xVal);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        map={particleTexture || undefined}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ChaosErrorEngine() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-black/90 border border-[#FF007F]/30 rounded shadow-[inset_0_0_30px_rgba(255,0,127,0.25)] flex items-center justify-center">
      
      {/* CRT Scanline aesthetics */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.12] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />
      
      {/* 3D WebGL Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <GlitchedMesh />
          <ErrorParticles />
        </Canvas>
      </div>

      {/* Floating retro-warning glitches overlay */}
      <div className="absolute inset-x-4 top-4 z-20 flex justify-between font-mono text-[8px] text-[#FF007F]/80 uppercase select-none tracking-widest">
        <span>[ 3D DECOMPOSITION ENGINE ]</span>
        <span className="animate-pulse">ERROR RATE: 89.4%</span>
      </div>

      <div className="absolute inset-x-4 bottom-4 z-20 flex flex-col font-mono text-[8px] text-[#8A2BE2] uppercase select-none leading-normal">
        <div className="flex justify-between">
          <span>BUFFERS: OVERLOADED</span>
          <span>STABILITY: CRITICAL</span>
        </div>
        <div className="text-[#FF007F]/60 text-[7px] mt-1 border-t border-[#FF007F]/10 pt-1 flex justify-between">
          <span>&gt; SEGMENTATION FAULT IN active_relationship</span>
          <span>CODE: 0xDEADBEEF</span>
        </div>
      </div>
      
    </div>
  );
}
