'use client';

import { useEffect, useRef, createContext, useContext } from 'react';
import { useAudioStore } from '@/store/useAudioStore';

interface AudioContextType {
  play: (sound: 'ERROR' | 'RIP' | 'DIALUP' | 'CLICK' | 'AMBIENCE') => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambienceNodeRef = useRef<GainNode | null>(null);
  const { globalVolume, isMuted } = useAudioStore();

  // Initialize Web Audio API Context safely on first user gesture or page interaction
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // 1. Programmatic Synthesizer: CLICK
  const synthClick = (ctx: AudioContext, destination: AudioNode) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(isMuted ? 0 : globalVolume * 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  };

  // 2. Programmatic Synthesizer: ERROR Alert
  const synthError = (ctx: AudioContext, destination: AudioNode) => {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'sawtooth';
    
    osc1.frequency.setValueAtTime(140, ctx.currentTime);
    osc2.frequency.setValueAtTime(143, ctx.currentTime); // Dissonant beats

    gain.gain.setValueAtTime(isMuted ? 0 : globalVolume * 0.5, ctx.currentTime);
    gain.gain.setValueAtTime(isMuted ? 0 : globalVolume * 0.5, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(destination);

    osc1.start();
    osc2.start();
    
    osc1.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  };

  // 3. Programmatic Synthesizer: Dialup Modem Handshake
  const synthDialup = (ctx: AudioContext, destination: AudioNode) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const noise = ctx.createBufferSource();
    const gain = ctx.createGain();

    // Generate White Noise Buffer
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    // Filter white noise to sound scratchy
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 1.2);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.setValueAtTime(440, now + 0.2);
    osc.frequency.linearRampToValueAtTime(800, now + 0.8);

    gain.gain.setValueAtTime(isMuted ? 0 : globalVolume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(now);
    noise.start(now);
    
    osc.stop(now + 1.2);
    noise.stop(now + 1.2);
  };

  // 4. Programmatic Synthesizer: PAPER RIP crackle fiber snap
  const synthRip = (ctx: AudioContext, destination: AudioNode) => {
    const now = ctx.currentTime;
    const impulses = 14; // Number of fiber snaps
    
    for (let i = 0; i < impulses; i++) {
      const snapTime = now + (i * 0.03) + (Math.random() * 0.01);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = Math.random() > 0.5 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(Math.random() * 1200 + 400, snapTime);
      osc.frequency.exponentialRampToValueAtTime(80, snapTime + 0.04);

      gain.gain.setValueAtTime(isMuted ? 0 : globalVolume * 0.6, snapTime);
      gain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.04);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(snapTime);
      osc.stop(snapTime + 0.04);
    }
  };

  // 5. Programmatic Synthesizer: AMBIENCE Deep Sub-Bass & Minor Key Melancholic Drone
  const synthAmbience = (ctx: AudioContext, destination: AudioNode) => {
    if (ambienceNodeRef.current) return; // Already running

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(isMuted ? 0 : globalVolume * 0.22, ctx.currentTime);
    ambienceNodeRef.current = gain;

    // Sub carrier wave (60Hz deep rumble)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, ctx.currentTime); // A1 note

    // Minor triad sweep pad (A minor chord: A3, C4, E4)
    const chordFreqs = [220, 261.63, 329.63];
    const oscs = chordFreqs.map(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Low frequency modulation (LFO) for deep drifting sweeps
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      return osc;
    });

    subOsc.connect(gain);
    gain.connect(destination);

    subOsc.start();
    oscs.forEach(o => o.start());
  };

  // Adjust Ambience volume on Zustand global store change
  useEffect(() => {
    if (ambienceNodeRef.current) {
      ambienceNodeRef.current.gain.setValueAtTime(isMuted ? 0 : globalVolume * 0.22, audioCtxRef.current?.currentTime || 0);
    }
  }, [globalVolume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const play = (sound: 'ERROR' | 'RIP' | 'DIALUP' | 'CLICK' | 'AMBIENCE') => {
    try {
      const ctx = getAudioContext();
      const dest = ctx.destination;

      switch (sound) {
        case 'CLICK':
          synthClick(ctx, dest);
          break;
        case 'ERROR':
          synthError(ctx, dest);
          break;
        case 'DIALUP':
          synthDialup(ctx, dest);
          break;
        case 'RIP':
          synthRip(ctx, dest);
          break;
        case 'AMBIENCE':
          synthAmbience(ctx, dest);
          break;
      }
    } catch (e) {
      console.warn('Audio Context interaction pending user click gesture.');
    }
  };

  return (
    <AudioContext.Provider value={{ play }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useSound = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useSound must be used within AudioProvider');
  return context;
};
