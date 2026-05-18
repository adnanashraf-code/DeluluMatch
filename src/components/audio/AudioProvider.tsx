'use client';

import { useEffect, useRef, createContext, useContext } from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import { useChaosStore } from '@/store/useChaosStore';

interface AudioContextType {
  play: (sound: 'ERROR' | 'RIP' | 'DIALUP' | 'CLICK' | 'AMBIENCE' | 'SYSTEM_ALARM') => void;
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

  // 2. ERROR = Desi Slang Voice Only (Hindi Devanagari for realistic pronunciation)
  const ERROR_SLANG_HINDI = [
    'अबे साले, क्या कर रहा है?',
    'भाई तेरा दिमाग खराब है क्या?',
    'ओ भाई, सिस्टम फट गया!',
    'निकल लौंडे, पहली फुर्सत में निकल!',
    'एरर पे एरर दे रहा है तू!',
    'तेरा एक्स भी इससे बेहतर था!',
    'पागल है क्या बे? रुक जा!',
    'अरे यार, फिर से तोड़ दिया सब!',
    'भाई थेरेपी ले, ऐप नहीं!',
    'इमोशनल डैमेज हो गया रे!',
    'तू रहने दे भाई, तेरा बस की नहीं है!',
    'सिस्टम बोला, तेरे से ना हो पाएगा!',
    'ओए होए, क्या सीन है ये!',
    'अरे बेवकूफ, बंद कर ये सब!',
    'भाई तू तो गया अब!',
    'ये क्या बवाल मचा रखा है?',
    'तेरी तो लग गई भाई!',
    'बंद कर ये नौटंकी!',
  ];

  // Romanized fallback if no Hindi voice is available
  const ERROR_SLANG_ROMAN = [
    'Abe saale, kya kar raha hai?',
    'Bhai tera dimaag kharaab hai kya?',
    'Ooo bhai, system fat gaya!',
    'Nikal launde, pehli fursat mein nikal!',
    'Error pe error de raha hai tu!',
    'Tera ex bhi isse better tha!',
    'Pagal hai kya be? Ruk ja!',
    'Arey yaar, phir se tod diya sab!',
    'Bhai therapy le, app nahi!',
    'Emotional damage ho gaya re!',
    'Tu rehne de bhai, tera bas ki nahi hai!',
    'System bola, tere se na ho payega!',
    'Oye hoye, kya scene hai ye!',
    'Arre bewakoof, band kar ye sab!',
    'Bhai tu toh gaya ab!',
    'Ye kya bawaal macha rakha hai?',
    'Teri toh lag gayi bhai!',
    'Band kar ye nautanki!',
  ];

  // Cache voices - they load asynchronously
  const cachedVoicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const hindiVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      cachedVoicesRef.current = voices;
      
      // Find best Hindi/Indian voice
      const googleHi = voices.find(v => v.lang === 'hi-IN' && v.name.toLowerCase().includes('google'));
      const msHi = voices.find(v => v.lang === 'hi-IN');
      const googleEnIn = voices.find(v => v.lang === 'en-IN' && v.name.toLowerCase().includes('google'));
      const msEnIn = voices.find(v => v.lang === 'en-IN');
      const anyIndian = voices.find(v => v.lang.includes('IN'));
      
      hindiVoiceRef.current = googleHi || msHi || googleEnIn || msEnIn || anyIndian || null;
      console.log('[DeluluMatch Audio] Voices loaded:', voices.length, '| Hindi voice:', hindiVoiceRef.current?.name || 'NONE - using default');
    };
    
    // Load immediately + listen for async load
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakSlang = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const voice = hindiVoiceRef.current;
    const hasHindi = voice && voice.lang.startsWith('hi');
    
    // Pick text based on whether we have a Hindi voice
    const slangList = hasHindi ? ERROR_SLANG_HINDI : ERROR_SLANG_ROMAN;
    const line = slangList[Math.floor(Math.random() * slangList.length)];
    
    console.log('[DeluluMatch] Speaking:', line, '| Voice:', voice?.name || 'DEFAULT', '| Lang:', voice?.lang || 'none');
    
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();
    
    // Small delay after cancel to prevent race condition
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(line);
      
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
      // Do NOT set lang to 'hi-IN' if no voice — let browser use default
      
      utterance.rate = 0.85;
      utterance.pitch = 0.8;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  // synthError: ONLY speaks slang
  const synthError = (_ctx: AudioContext, _destination: AudioNode) => {
    speakSlang();
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

  // Master Refs for Background Music
  const musicVolumeNodeRef = useRef<GainNode | null>(null);
  const musicFilterRef = useRef<BiquadFilterNode | null>(null);
  const musicIntervalRef = useRef<any>(null);

  const { tsunamiState } = useChaosStore();

  // Programmatic Background Romantic Music Sequencer
  const startRomanticMusic = (ctx: AudioContext, destination: AudioNode) => {
    if (musicIntervalRef.current) return; // Already running

    // Master music volume
    const musicGain = ctx.createGain();
    musicGain.gain.setValueAtTime(isMuted ? 0 : globalVolume * 0.35, ctx.currentTime);
    musicVolumeNodeRef.current = musicGain;

    // Submerge filter for underwater lowpass effect
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(tsunamiState === 'underwater' ? 320 : 20000, ctx.currentTime);
    lowpass.Q.setValueAtTime(1, ctx.currentTime);
    musicFilterRef.current = lowpass;

    musicGain.connect(lowpass);
    lowpass.connect(destination);

    // Timing metrics
    const bpm = 75;
    const beatDuration = 60 / bpm; // 0.8s
    const barDuration = beatDuration * 4; // 3.2s
    
    let currentBar = 0;
    let nextBarTime = ctx.currentTime + 0.1;
    
    // Romantic Fmaj9 - G6 - Em7 - Am9 Progression
    const chords = [
      {
        bass: 87.31, // F2
        pad: [174.61, 220.00, 261.63, 329.63], // F3, A3, C4, E4
        melody: [
          { beat: 0.0, freq: 523.25 }, // C5
          { beat: 1.0, freq: 659.25 }, // E5
          { beat: 2.0, freq: 783.99 }, // G5
          { beat: 3.0, freq: 880.00 }  // A5
        ]
      },
      {
        bass: 98.00, // G2
        pad: [196.00, 246.94, 293.66, 392.00], // G3, B3, D4, G4
        melody: [
          { beat: 0.0, freq: 493.88 }, // B4
          { beat: 1.0, freq: 587.33 }, // D5
          { beat: 2.0, freq: 783.99 }, // G5
          { beat: 3.0, freq: 987.77 }  // B5
        ]
      },
      {
        bass: 82.41, // E2
        pad: [164.81, 196.00, 246.94, 293.66], // E3, G3, B3, D4
        melody: [
          { beat: 0.0, freq: 392.00 }, // G4
          { beat: 1.0, freq: 493.88 }, // B4
          { beat: 2.0, freq: 659.25 }, // E5
          { beat: 3.0, freq: 783.99 }  // G5
        ]
      },
      {
        bass: 110.00, // A2
        pad: [220.00, 261.63, 329.63, 392.00], // A3, C4, E4, G4
        melody: [
          { beat: 0.0, freq: 440.00 }, // A4
          { beat: 1.0, freq: 523.25 }, // C5
          { beat: 2.0, freq: 659.25 }, // E5
          { beat: 3.0, freq: 783.99 }  // G5
        ]
      }
    ];

    const scheduleBar = (barIndex: number, startTime: number) => {
      const data = chords[barIndex % chords.length];
      const now = startTime;
      const vol = isMuted ? 0 : globalVolume;

      // 1. Deep Bass line
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(data.bass, now);
      
      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(vol * 0.3, now + 0.15);
      bassGain.gain.setValueAtTime(vol * 0.3, now + barDuration - 0.4);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + barDuration);
      
      bassOsc.connect(bassGain);
      bassGain.connect(musicGain);
      
      bassOsc.start(now);
      bassOsc.stop(now + barDuration);

      // 2. Soft Chord Pad
      data.pad.forEach((freq) => {
        const padOsc = ctx.createOscillator();
        const padGain = ctx.createGain();
        padOsc.type = 'triangle';
        padOsc.frequency.setValueAtTime(freq, now);
        
        padGain.gain.setValueAtTime(0, now);
        padGain.gain.linearRampToValueAtTime(vol * 0.12, now + 0.6);
        padGain.gain.setValueAtTime(vol * 0.12, now + barDuration - 0.6);
        padGain.gain.exponentialRampToValueAtTime(0.001, now + barDuration);
        
        const padFilter = ctx.createBiquadFilter();
        padFilter.type = 'lowpass';
        padFilter.frequency.setValueAtTime(650, now);
        
        padOsc.connect(padFilter);
        padFilter.connect(padGain);
        padGain.connect(musicGain);
        
        padOsc.start(now);
        padOsc.stop(now + barDuration);
      });

      // 3. Sparkling Romantic Music Box Bells
      data.melody.forEach((note) => {
        const noteTime = now + note.beat * beatDuration;
        
        const melOsc = ctx.createOscillator();
        const melGain = ctx.createGain();
        
        melOsc.type = 'sine';
        melOsc.frequency.setValueAtTime(note.freq, noteTime);
        
        melGain.gain.setValueAtTime(0, noteTime);
        melGain.gain.linearRampToValueAtTime(vol * 0.24, noteTime + 0.03);
        melGain.gain.exponentialRampToValueAtTime(0.001, noteTime + beatDuration * 1.6);
        
        const melFilter = ctx.createBiquadFilter();
        melFilter.type = 'highpass';
        melFilter.frequency.setValueAtTime(320, noteTime);
        
        melOsc.connect(melFilter);
        melFilter.connect(melGain);
        melGain.connect(musicGain);
        
        melOsc.start(noteTime);
        melOsc.stop(noteTime + beatDuration * 1.6);
      });
    };

    const tick = () => {
      const lookahead = 0.45;
      while (nextBarTime < ctx.currentTime + lookahead) {
        scheduleBar(currentBar, nextBarTime);
        currentBar++;
        nextBarTime += barDuration;
      }
    };

    tick();
    musicIntervalRef.current = setInterval(tick, 200);
  };

  // Adjust music volume and mute dynamically
  useEffect(() => {
    if (musicVolumeNodeRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      musicVolumeNodeRef.current.gain.setTargetAtTime(
        isMuted ? 0 : globalVolume * 0.35,
        now,
        0.05
      );
    }
  }, [globalVolume, isMuted]);

  // Smoothly muffle background music when underwater
  useEffect(() => {
    if (musicFilterRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      if (tsunamiState === 'underwater') {
        musicFilterRef.current.frequency.setTargetAtTime(320, now, 0.3);
      } else {
        musicFilterRef.current.frequency.setTargetAtTime(20000, now, 0.3);
      }
    }
  }, [tsunamiState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (musicIntervalRef.current) {
        clearInterval(musicIntervalRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // 6. Programmatic Synthesizer: SYSTEM ALARM (Loud 5-second digital "bee-bee")
  const synthAlarm = (ctx: AudioContext, destination: AudioNode) => {
    const now = ctx.currentTime;
    const duration = 5.0; // 5 seconds alarm

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'sawtooth';

    // Dissonant beating alarm frequencies
    osc1.frequency.setValueAtTime(880, now); // A5 note
    osc2.frequency.setValueAtTime(884, now); // 4Hz beat frequency

    gainNode.gain.setValueAtTime(0, now);

    const pulseInterval = 0.4; // beep every 400ms
    const beepLength = 0.15; // 150ms beeps

    for (let t = 0; t < duration; t += pulseInterval) {
      const tStart = now + t;
      if (tStart + beepLength > now + duration) break;

      gainNode.gain.setValueAtTime(0, tStart);
      gainNode.gain.linearRampToValueAtTime(isMuted ? 0 : globalVolume * 0.85, tStart + 0.01);
      gainNode.gain.setValueAtTime(isMuted ? 0 : globalVolume * 0.85, tStart + beepLength - 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, tStart + beepLength);
    }

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(destination);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + duration);
    osc2.stop(now + duration);
  };

  const play = (sound: 'ERROR' | 'RIP' | 'DIALUP' | 'CLICK' | 'AMBIENCE' | 'SYSTEM_ALARM') => {
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
          // Ambience plays our gorgeous looping romantic song instead of a simple hum!
          startRomanticMusic(ctx, dest);
          break;
        case 'SYSTEM_ALARM':
          synthAlarm(ctx, dest);
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
