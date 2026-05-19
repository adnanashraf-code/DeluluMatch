'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Stylized 3D Heart Shard
function HeartShard({ 
  position, 
  rotation, 
  shatterDir, 
  shattered, 
  color 
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  shatterDir: [number, number, number]; 
  shattered: boolean;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const targetPos = useMemo(() => {
    const dir = new THREE.Vector3(...shatterDir);
    return new THREE.Vector3().copy(initialPos).add(dir.multiplyScalar(2.5));
  }, [initialPos, shatterDir]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Smooth interpolation for shattering
    const current = meshRef.current.position;
    const target = shattered ? targetPos : initialPos;
    current.lerp(target, 0.1);

    // Dynamic rotation when shattered
    if (shattered) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.8;
    } else {
      meshRef.current.rotation.set(...rotation);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <coneGeometry args={[0.5, 1.2, 4]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={1.8} 
        roughness={0.1}
        metalness={0.9}
        flatShading
      />
    </mesh>
  );
}

// 3D Stylized Humanoid Figure (Boy or Girl)
function GlowingFigure({ 
  position, 
  color, 
  isBoy, 
  shattered 
}: { 
  position: [number, number, number]; 
  color: string; 
  isBoy: boolean; 
  shattered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const targetPos = useMemo(() => {
    // Figures drift apart when relationship is shattered
    const driftX = isBoy ? -1.5 : 1.5;
    return new THREE.Vector3(initialPos.x + driftX, initialPos.y, initialPos.z);
  }, [initialPos, isBoy]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Soft floating animation
    const time = state.clock.getElapsedTime();
    const floatY = Math.sin(time * 2 + (isBoy ? 0 : Math.PI)) * 0.15;
    
    // Smooth position transition
    const current = groupRef.current.position;
    const target = shattered ? targetPos : initialPos;
    current.lerp(new THREE.Vector3(target.x, target.y + floatY, target.z), 0.08);

    // Sad head tilt and body turn away
    if (groupRef.current.children[0]) {
      const head = groupRef.current.children[0];
      head.rotation.x = shattered ? 0.35 : Math.sin(time * 1.5) * 0.05;
      head.rotation.y = shattered ? (isBoy ? -0.3 : 0.3) : 0;
    }
    
    if (shattered) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, isBoy ? 0.8 : -0.8, 0.08);
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.08);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} roughness={0.2} />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.9, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.2} flatShading />
      </mesh>

      {/* Limbs (Abstract) */}
      <mesh position={[-0.22, 0.4, 0]} rotation={[0, 0, shattered ? -0.2 : 0.1]}>
        <cylinderGeometry args={[0.07, 0.07, 0.7, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0.22, 0.4, 0]} rotation={[0, 0, shattered ? 0.2 : -0.1]}>
        <cylinderGeometry args={[0.07, 0.07, 0.7, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
}

// Particle System for Shatter Sparks
function HeartParticles({ count, shattered }: { count: number; shattered: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      vel[i * 3] = (Math.random() - 0.5) * 4;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 4;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return [pos, vel];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !shattered) return;
    
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3] += velocities[i * 3] * delta;
      posAttr.array[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      posAttr.array[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      // Add a bit of gravity or slow down
      velocities[i * 3] *= 0.98;
      velocities[i * 3 + 1] *= 0.98;
      velocities[i * 3 + 2] *= 0.98;
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
        color="#FF007F" 
        size={0.06} 
        transparent 
        opacity={shattered ? 0.8 : 0} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Scene Setup with Interactive Trigger
function BreakupScene({ shattered, setShattered, onTrigger }: { shattered: boolean; setShattered: (val: boolean) => void; onTrigger: () => void }) {
  const { camera } = useThree();
  const containerRef = useRef<THREE.Group>(null);

  // Gentle mouse-follow effect for camera
  useFrame((state) => {
    const mouseX = state.pointer.x * 2.5;
    const mouseY = state.pointer.y * 1.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2 + mouseY, 0.05);
    camera.lookAt(0, 0.5, 0);

    if (containerRef.current) {
      containerRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  // Shattered heart shards list
  const shards = [
    { pos: [-0.3, 0.8, 0], rot: [0, 0, 0.4], dir: [-0.6, 0.8, 0.3] },
    { pos: [0.3, 0.8, 0], rot: [0, 0, -0.4], dir: [0.6, 0.8, -0.3] },
    { pos: [-0.2, 0.3, 0.1], rot: [0.2, 0.1, 0.8], dir: [-0.7, -0.4, 0.5] },
    { pos: [0.2, 0.3, -0.1], rot: [-0.2, -0.1, -0.8], dir: [0.7, -0.4, -0.5] },
    { pos: [0, -0.2, 0], rot: [Math.PI, 0, 0], dir: [0, -0.9, 0.1] }
  ];

  return (
    <group ref={containerRef}>
      {/* 3D Grid Platform */}
      <gridHelper args={[10, 20, '#FF007F', '#1f0d25']} position={[0, -0.8, 0]} />

      {/* Cyber Lights */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 4, 2]} intensity={1.8} color="#FF007F" />
      <pointLight position={[-4, 2, -2]} intensity={1.2} color="#8A2BE2" />
      <pointLight position={[4, 2, -2]} intensity={1.2} color="#00FFFF" />

      {/* Stylized 3D Figures */}
      <GlowingFigure position={[-2.2, -0.8, 0]} color="#00FFFF" isBoy={true} shattered={shattered} />
      <GlowingFigure position={[2.2, -0.8, 0]} color="#FF1493" isBoy={false} shattered={shattered} />

      {/* Heart Shards Group */}
      <group position={[0, 0.4, 0]}>
        {shards.map((s, i) => (
          <HeartShard 
            key={i} 
            position={s.pos as [number, number, number]} 
            rotation={s.rot as [number, number, number]} 
            shatterDir={s.dir as [number, number, number]} 
            shattered={shattered}
            color={i % 2 === 0 ? '#FF007F' : '#8A2BE2'}
          />
        ))}
        {/* Heart Core Explosion Particles */}
        <HeartParticles count={150} shattered={shattered} />
      </group>
    </group>
  );
}

export default function ThreeBreakupEngine() {
  const [shattered, setShattered] = useState(false);

  return (
    <div className="relative w-full h-[320px] bg-black/85 border border-zinc-900 rounded-lg overflow-hidden flex flex-col justify-between">
      {/* Glitched scanning grid backdrop */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      {/* Interactive 3D Canvas */}
      <div className="flex-1 w-full h-full cursor-pointer relative">
        <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
          <Stars radius={100} depth={50} count={300} factor={4} saturation={0.5} fade speed={1} />
          <BreakupScene 
            shattered={shattered} 
            setShattered={setShattered} 
            onTrigger={() => setShattered(true)} 
          />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            maxPolarAngle={Math.PI / 2 - 0.05} 
            minPolarAngle={Math.PI / 6}
          />
        </Canvas>

        {/* 3D Overlay Interactive Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!shattered && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setShattered(true);
              }}
              className="pointer-events-auto bg-black/90 hover:bg-[#FF007F] hover:text-black text-[#FF007F] border-2 border-[#FF007F] px-4 py-2 rounded font-mono text-[10px] tracking-wider uppercase font-bold shadow-[0_0_20px_rgba(255,0,127,0.4)] transition-all z-20"
            >
              💔 DETONATE HEART 💔
            </motion.button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 border-t border-zinc-900 bg-black/90 font-mono text-[9px] text-zinc-500 uppercase tracking-widest z-20">
        <span>CYBERSPACE STATUS: {shattered ? '💔 HEART SHATTERED' : '💚 HEART FLOATING'}</span>
        {shattered && (
          <button 
            onClick={() => setShattered(false)}
            className="text-pink-500 hover:text-white font-bold underline transition-colors cursor-pointer"
          >
            🔄 Reset Heart Loop
          </button>
        )}
      </div>
    </div>
  );
}
