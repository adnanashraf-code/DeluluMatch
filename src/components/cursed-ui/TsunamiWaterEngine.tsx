'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '../audio/AudioProvider';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import gsap from 'gsap';

// =========================================================
// 1. CUSTOM WATER MATERIAL (GLSL SHADERS)
// =========================================================
const TsunamiShader = {
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColorWater: { value: new THREE.Color('#1a0033') }, // Gorgeous deep royal indigo
    uColorGlow: { value: new THREE.Color('#ff007f') },  // Luminous hot magenta
    uColorPeak: { value: new THREE.Color('#00ffff') }   // Electric neon cyan
  },
  vertexShader: `
    uniform float uTime;
    uniform float uProgress;
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vPosition;

    // Procedural 2D noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      vPosition = position;

      // Multi-layered Fractional Brownian Motion (FBM) for liquid ripple waves
      vec2 p = pos.xy * 0.08;
      float fbmNoise = 0.0;
      float amp = 1.0;
      float freq = 1.0;
      for (int i = 0; i < 4; i++) {
        fbmNoise += amp * noise(p * freq + uTime * 0.8);
        p += vec2(2.5, 7.8);
        amp *= 0.48;
        freq *= 1.85;
      }

      // Roll base swell wave motion
      float swell = sin(pos.x * 0.12 - uTime * 1.4) * cos(pos.y * 0.10 - uTime * 1.1) * 2.5;
      float elevation = swell + fbmNoise * 2.6;
      
      // Curved Tsunami wall sweeping Right-to-Left
      float waveX = pos.x + 22.0 - (uProgress * 44.0);
      float waveWall = smoothstep(11.0, 0.0, abs(waveX)) * 9.5 * uProgress;
      elevation += waveWall;

      pos.z += elevation;
      vElevation = elevation;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColorWater;
    uniform vec3 uColorGlow;
    uniform vec3 uColorPeak;
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vPosition;

    void main() {
      // Soft wave peak interpolation
      float peakFactor = smoothstep(1.5, 8.5, vElevation);

      // Base glassmorphic neon water gradient: deep indigo to hot pink
      vec3 waterColor = mix(uColorWater, uColorGlow, vUv.y);

      // Neon cyan highlights on wave crest peaks
      vec3 finalColor = mix(waterColor, uColorPeak, peakFactor * 0.85);

      // Double specular layers for intense water glitter
      float specular1 = pow(sin(vUv.x * 16.0 - uTime * 2.2) * 0.5 + 0.5, 12.0) * pow(vUv.y, 2.0);
      float specular2 = pow(cos(vUv.y * 24.0 + uTime * 3.0) * 0.5 + 0.5, 16.0) * pow(vUv.x, 2.0);
      finalColor += uColorPeak * (specular1 * 0.6 + specular2 * 0.4);

      // Multi-frequency neon foam lines that trace wave elevations
      float foam1 = sin(vElevation * 3.0 + uTime * 2.0) * cos(vUv.x * 20.0 + uTime * 1.5);
      float foam2 = cos(vElevation * 2.0 - uTime * 1.8) * sin(vUv.y * 30.0 + uTime * 2.2);
      float foamFactor = smoothstep(0.4, 0.95, abs(foam1 + foam2) * 0.5);
      vec3 foamColor = mix(vec3(0.0), uColorPeak, foamFactor * 0.35);
      finalColor += foamColor;

      // Glow edge Fresnel effect
      float fresnel = pow(1.0 - vUv.y, 3.0) * 0.45;
      finalColor += uColorGlow * fresnel;

      gl_FragColor = vec4(finalColor, 0.92);
    }
  `
};

// =========================================================
// 2. WATER SURFACE MESH COMPONENT
// =========================================================
function WaterSurface({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const materialArgs = useMemo(() => {
    return {
      uniforms: THREE.UniformsUtils.clone(TsunamiShader.uniforms),
      vertexShader: TsunamiShader.vertexShader,
      fragmentShader: TsunamiShader.fragmentShader,
      transparent: true,
      wireframe: false,
      side: THREE.DoubleSide
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uProgress.value = progress;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2.3, 0, 0]} 
      position={[0, -2, -6]}
    >
      <planeGeometry args={[50, 30, 180, 180]} />
      <shaderMaterial ref={materialRef} args={[materialArgs]} attach="material" />
    </mesh>
  );
}

// =========================================================
// 3. GPU PARTICLES SPRAY COMPONENT (FOAM & MIST)
// =========================================================
function SprayParticles({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { isFpsLow } = useChaosStore();
  const count = isFpsLow ? 450 : 1200; // slightly higher density for premium look

  // Custom circular radial glow gradient texture for premium glowing particle look
  const particleTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(0, 255, 255, 1.0)');     // Glowing Cyan Core
      gradient.addColorStop(0.2, 'rgba(0, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 0, 127, 0.45)');   // Hot Pink glow halo
      gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');        // Fade out
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44;     // X width
      pos[i * 3 + 1] = -2 + Math.random() * 4;     // Y height
      pos[i * 3 + 2] = -4 - Math.random() * 8;     // Z depth
      spd[i] = Math.random() * 3.5 + 1.5;          // Speed
    }
    return [pos, spd];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Horizontal sweep particle movement synced to wave wall progression
      const waveX = posAttr.getX(i) + 22.0 - (progress * 44.0);
      const activeFactor = smoothstep(8.0, 0.0, Math.abs(waveX));

      // Drift upward and float organically
      const yVal = -2 + (Math.sin(time * speeds[i] + i) * 2) + (activeFactor * 6.5);
      posAttr.setY(i, yVal);
      
      // Flow along wave front (Z coordinates drift forward)
      const zVal = -4 - (Math.cos(time * 0.5 + i) * 3) + (activeFactor * 3.0);
      posAttr.setZ(i, zVal);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} key={count}>
      <bufferGeometry key={count}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.42}
        map={particleTexture || undefined}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Simple smoothstep helper
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// =========================================================
// 4. CAMERA SHAKE & EFFECTS COMPONENT
// =========================================================
function CameraController({ progress, state }: { progress: number; state: string }) {
  const { camera } = useThree();
  const basePos = useRef(new THREE.Vector3(0, 0, 8));

  useFrame((stateClock) => {
    const time = stateClock.clock.getElapsedTime();
    
    // Smooth camera float during normal operations
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(time * 0.8) * 0.4, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.cos(time * 0.6) * 0.3, 0.05);

    // Dynamic Camera Impact Zoom & Shake when tsunami crashes
    if (state === 'arrival' || state === 'collapse') {
      const shakeIntensity = progress * 0.75;
      camera.position.x += (Math.random() - 0.5) * shakeIntensity;
      camera.position.y += (Math.random() - 0.5) * shakeIntensity;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8 - (progress * 2.5), 0.1);
    } else if (state === 'underwater') {
      // Slow underwater drift floating
      camera.position.x += Math.sin(time * 1.5) * 0.08;
      camera.position.y += Math.cos(time * 1.2) * 0.06;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6.5, 0.05);
    } else {
      // Revert to baseline positions
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, basePos.current.z, 0.05);
    }
  });

  return null;
}

// =========================================================
// 5. MAIN DYNAMIC TSUNAMI ENGINE WRAPPER
// =========================================================
export default function TsunamiWaterEngine() {
  const { tsunamiState } = useChaosStore();
  const [waveProgress, setWaveProgress] = useState(0);

  // Synchronize wave horizontal vector progress with tsunami timeline states
  useEffect(() => {
    if (tsunamiState === 'arrival') {
      // Rise & Surging across screen
      gsap.to({ val: 0 }, {
        val: 0.65,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: function() {
          setWaveProgress(this.targets()[0].val);
        }
      });
    } else if (tsunamiState === 'collapse') {
      // Complete crashing sweep
      gsap.to({ val: 0.65 }, {
        val: 1.0,
        duration: 1.2,
        ease: 'power1.inOut',
        onUpdate: function() {
          setWaveProgress(this.targets()[0].val);
        }
      });
    } else if (tsunamiState === 'idle') {
      setWaveProgress(0);
    }
  }, [tsunamiState]);

  const isActive = tsunamiState !== 'idle' && tsunamiState !== 'warning' && tsunamiState !== 'void' && tsunamiState !== 'reconstruction';

  return (
    <>
      {/* 1. DOM REFRACTION FILTER PASS (WARPS ACTUAL HTML TEXTURES!) */}
      <AnimatePresence>
        {(tsunamiState === 'arrival' || tsunamiState === 'collapse' || tsunamiState === 'underwater') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none"
          >
            {/* SVG refraction filter injection */}
            <svg className="absolute w-0 h-0 pointer-events-none">
              <defs>
                <filter id="tsunami-fluid-warp">
                  <feTurbulence 
                    type="fractalNoise" 
                    baseFrequency="0.015" 
                    numOctaves="3" 
                    result="noise" 
                  >
                    <animate 
                      attributeName="baseFrequency" 
                      values="0.015;0.035;0.015" 
                      dur="12s" 
                      repeatCount="indefinite" 
                    />
                  </feTurbulence>
                  <feDisplacementMap 
                    in="SourceGraphic" 
                    in2="noise" 
                    scale={tsunamiState === 'underwater' ? '28' : '54'} 
                    xChannelSelector="R" 
                    yChannelSelector="G" 
                  />
                </filter>
              </defs>
            </svg>
            
            {/* Inject displacement styling to body element during submerge */}
            <style>{`
              body {
                filter: url(#tsunami-fluid-warp);
                transition: filter 0.3s ease;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THREE.JS SHADER CANVAS LAYER */}
      {isActive && (
        <div className="fixed inset-0 z-[45] pointer-events-none w-full h-full bg-transparent overflow-hidden">
          <Canvas
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.8]} // Optimized pixel ratios
            camera={{ position: [0, 0, 8], fov: 60 }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 5]} intensity={0.8} color="#FF007F" />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00FFFF" />
            
            <WaterSurface progress={waveProgress} />
            <SprayParticles progress={waveProgress} />
            
            <CameraController progress={waveProgress} state={tsunamiState} />
          </Canvas>
        </div>
      )}
    </>
  );
}
