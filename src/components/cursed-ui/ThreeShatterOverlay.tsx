'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Interface for 3D glass shard physics
interface ShardData {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
  color: string;
}

function GlassShard({ shard }: { shard: ShardData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const gravity = -0.15; // Realistic downward gravity

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Apply linear physical velocity and gravity
    shard.velocity.y += gravity * delta;
    meshRef.current.position.addScaledVector(shard.velocity, delta * 3);

    // Apply angular rotational speed
    meshRef.current.rotation.x += shard.rotationSpeed.x * delta;
    meshRef.current.rotation.y += shard.rotationSpeed.y * delta;
    meshRef.current.rotation.z += shard.rotationSpeed.z * delta;

    // Slowly fade/shrink shards over time to keep performance perfect
    if (meshRef.current.scale.x > 0.01) {
      meshRef.current.scale.multiplyScalar(0.985);
    }
  });

  return (
    <mesh ref={meshRef} position={shard.position}>
      <primitive object={shard.geometry} attach="geometry" />
      <meshPhysicalMaterial
        color={shard.color}
        emissive={shard.color}
        emissiveIntensity={1.2}
        roughness={0.05}
        transmission={0.9} // realistic glass transmission
        thickness={0.5}
        metalness={0.1}
        clearcoat={1.0}
        side={THREE.DoubleSide}
        flatShading
      />
    </mesh>
  );
}

// Particle sparks flying off the break point
function ShatterParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spawn at center with random outward trajectory
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      vel[i * 3] = (Math.random() - 0.5) * 8;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 8;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return [pos, vel];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3] += velocities[i * 3] * delta;
      posAttr.array[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      posAttr.array[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      // Friction / slowdown
      velocities[i * 3] *= 0.96;
      velocities[i * 3 + 1] *= 0.96;
      velocities[i * 3 + 2] *= 0.96;
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
        color="#FF0033"
        size={0.08}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main 3D Canvas Scene
function ShatterScene() {
  // Generate 120+ physically unique, randomized glass shards
  const shards = useMemo(() => {
    const list: ShardData[] = [];
    const colors = ['#FF0055', '#FF0000', '#8A2BE2', '#4B0082', '#FF1493'];

    for (let i = 0; i < 120; i++) {
      // Create random triangular geometries for shards
      const geom = new THREE.BufferGeometry();
      const size = 0.15 + Math.random() * 0.45;
      
      const vertices = new Float32Array([
        0, 0, 0,
        (Math.random() - 0.5) * size, size * (0.8 + Math.random() * 0.4), (Math.random() - 0.5) * 0.05,
        size * (0.8 + Math.random() * 0.4), (Math.random() - 0.5) * size, (Math.random() - 0.5) * 0.05
      ]);

      geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geom.computeVertexNormals();

      // Fracture point in the center screen
      const spawnX = (Math.random() - 0.5) * 8;
      const spawnY = (Math.random() - 0.5) * 5;
      const spawnZ = 0;

      // Explode outward away from the center fracture point
      const angle = Math.atan2(spawnY, spawnX) + (Math.random() - 0.5) * 0.5;
      const speed = 2.0 + Math.random() * 4.5;
      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        3.0 + Math.random() * 4.0 // fly forward toward the camera!
      );

      const rotationSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );

      const color = colors[Math.floor(Math.random() * colors.length)];

      list.push({
        geometry: geom,
        position: [spawnX, spawnY, spawnZ],
        velocity,
        rotationSpeed,
        color
      });
    }
    return list;
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 4]} intensity={2.5} color="#FF0055" />
      <pointLight position={[0, 0, 10]} intensity={1.8} color="#FF0000" />
      <pointLight position={[0, 0, -4]} intensity={1.0} color="#8A2BE2" />

      {/* Render all moving glass shards */}
      {shards.map((shard, idx) => (
        <GlassShard key={idx} shard={shard} />
      ))}

      {/* High-speed explosion sparks */}
      <ShatterParticles count={250} />
    </>
  );
}

export default function ThreeShatterOverlay({ countdown }: { countdown: number }) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show prompt quickly after the explosion triggers
    const timer = setTimeout(() => setShowPrompt(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen z-[999999] bg-black/98 overflow-hidden pointer-events-auto select-none flex flex-col items-center justify-center">
      
      {/* 3D Glass Shattering Canvas */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <ShatterScene />
        </Canvas>
      </div>

      {/* Glowing Neon Cyber Alarm Prompts */}
      {showPrompt && (
        <div className="relative z-20 text-center p-8 max-w-xl space-y-6 flex flex-col items-center justify-center">
          {/* Cyber Warning Grid */}
          <div className="inline-block px-4 py-1 border border-[#FF0033] bg-[#FF0033]/15 text-[#FF0033] font-mono text-[9px] uppercase tracking-[0.4em] animate-pulse rounded shadow-[0_0_15px_rgba(255,0,51,0.25)]">
            ⚠️ SYSTEM INTEGRITY CORRUPTED ⚠️
          </div>

          <h2 className="text-[#FF0033] font-bebas text-5xl md:text-8xl tracking-[0.2em] uppercase font-black animate-bounce"
              style={{ textShadow: '0 0 25px rgba(255,0,51,0.95), 0 0 50px rgba(255,0,51,0.5)' }}>
            TRUST ISSUE BREAK
          </h2>

          <p className="text-zinc-400 font-mono text-[11px] leading-relaxed uppercase tracking-wider max-w-md">
            Simulation hardware completely shattered under acute situationship strain. Emergency restoration active.
          </p>

          <div className="pt-6 border-t border-zinc-900 w-full flex flex-col items-center gap-2">
            <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
              Initiating Global Blackout in:
            </span>
            <span className="text-white font-mono text-5xl font-black tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              {countdown}s
            </span>
          </div>
        </div>
      )}

      {/* Retro glitched scanner lines */}
      <div className="absolute inset-0 z-35 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />
    </div>
  );
}
