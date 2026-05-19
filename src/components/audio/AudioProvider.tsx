"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { useChaosStore } from "@/store/useChaosStore";

interface AudioContextType {
  play: (
    sound: "ERROR" | "RIP" | "DIALUP" | "CLICK" | "AMBIENCE" | "SYSTEM_ALARM",
  ) => void;
  speak: (text: string, callback?: () => void) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambienceNodeRef = useRef<GainNode | null>(null);
  const { globalVolume, isMuted } = useAudioStore();

  // Initialize Web Audio API Context safely on first user gesture or page interaction
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // 1. Programmatic Synthesizer: CLICK
  const synthClick = (ctx: AudioContext, destination: AudioNode) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(isMuted ? 0 : globalVolume * 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  };

  // 2. Vocal Notification Prompts: Native Devanagari script for direct Hindi speech rendering
  const ERROR_SLANG_HINDI = [
    "अबे साले, क्या कर रहा है?",
    "भाई तेरा दिमाग खराब है क्या?",
    "ओ भाई, सिस्टम फट गया!",
    "निकल लौंडे, पहली फुर्सत में निकल!",
    "एरर पे एरर दे रहा है तू!",
    "तेरा एक्स भी इससे बेहतर था!",
    "पागल है क्या बे? रुक जा!",
    "अरे यार, फिर से तोड़ दिया सब!",
    "भाई थेरेपी ले, ऐप नहीं!",
    "इमोशनल डैमेज हो गया रे!",
    "तू रहने दे भाई, तेरा बस की नहीं है!",
    "सिस्टम बोला, तेरे से ना हो पाएगा!",
    "ओए होए, क्या सीन है ये!",
    "अरे बेवकूफ, बंद कर ये सब!",
    "भाई तू तो गया अब!",
    "ये क्या बवाल मचा रखा है?",
    "तेरी तो लग गई भाई!",
    "बंद कर ये नौटंकी!",
    "सुनामी आ गया भाई, तेरी तो लंका लगने वाली है सिस्टम की!",
  ];

  // Phonetic fallback transliterations for engines lacking Devanagari voice profiles
  const ERROR_SLANG_ROMAN = [
    "Abe saale, kya kar raha hai?",
    "Bhai tera dimaag kharaab hai kya?",
    "Nikal launde, pehli fursat mein nikal!",
    "Error pe error de raha hai tu!",
    "Tera ex bhi isse better tha!",
    "Pagal hai kya be? Ruk ja!",
    "Arey yaar, phir se tod diya sab!",
    "Bhai therapy le, app nahi!",
    "Emotional damage ho gaya re!",
    "Tu rehne de bhai, tera bas ki nahi hai!",
    "System bola, tere se na ho payega!",
    "Oye hoye, kya scene hai ye!",
    "Arre bewakoof, band kar ye sab!",
    "Bhai tu toh gaya ab!",
    "Ye kya bawaal macha rakha hai?",
    "Teri toh lag gayi bhai!",
    "Band kar ye nautanki!",
    "TSUNAMI AA GAYA BHAI TERI TOH LANKA LAGNE WALI HAI SYSTEM KI",
  ];

  // Cache voices - they load asynchronously
  const cachedVoicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const hindiVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      cachedVoicesRef.current = voices;

      // Filter all available voices
      const hiVoices = voices.filter((v) =>
        v.lang.toLowerCase().replace("_", "-").startsWith("hi"),
      );
      const enInVoices = voices.filter((v) =>
        v.lang.toLowerCase().replace("_", "-").startsWith("en-in"),
      );

      // 1. Search for natural neural Indian Hindi female voices first
      let selectedVoice = hiVoices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          (name.includes("kalpana") ||
            name.includes("harita") ||
            name.includes("lekha") ||
            name.includes("google") ||
            name.includes("online")) &&
          !name.includes("hemant") &&
          !name.includes("rishi")
        );
      });

      // 2. Fall back to any Hindi voice (excluding known male voices if possible)
      if (!selectedVoice) {
        selectedVoice = hiVoices.find((v) => {
          const name = v.name.toLowerCase();
          return (
            !name.includes("hemant") &&
            !name.includes("rishi") &&
            !name.includes("male")
          );
        });
      }

      // 3. Fall back to any available Hindi voice
      if (!selectedVoice) {
        selectedVoice = hiVoices[0];
      }

      // 4. Fall back to Indian English female voice (realistic Indian accent)
      if (!selectedVoice) {
        selectedVoice = enInVoices.find((v) => {
          const name = v.name.toLowerCase();
          return (
            (name.includes("heera") ||
              name.includes("veena") ||
              name.includes("neerja") ||
              name.includes("priya") ||
              name.includes("google") ||
              name.includes("online")) &&
            !name.includes("ravi") &&
            !name.includes("prabhat")
          );
        });
      }

      // 5. Fall back to any Indian English voice
      if (!selectedVoice) {
        selectedVoice = enInVoices[0];
      }

      // 6. Fall back to any female voice
      if (!selectedVoice) {
        selectedVoice = voices.find((v) => {
          const name = v.name.toLowerCase();
          return (
            (name.includes("zira") ||
              name.includes("samantha") ||
              name.includes("siri") ||
              name.includes("hazel") ||
              name.includes("female")) &&
            !name.includes("david") &&
            !name.includes("mark") &&
            !name.includes("george")
          );
        });
      }

      hindiVoiceRef.current = selectedVoice || null;

      console.log(
        "[DeluluMatch Audio] Selected Real Indian Female Voice:",
        hindiVoiceRef.current
          ? `${hindiVoiceRef.current.name} (${hindiVoiceRef.current.lang})`
          : "System Default",
      );
    };

    // Load immediately + listen for async load
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Duck background music volume dynamically during active voice speech playback
  const duckMusic = (duck: boolean) => {
    if (musicVolumeNodeRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      const targetVolume = duck ? 0.01 : 1.5; // Duck to virtual silence during speech for massive 2.0 relative volume!
      musicVolumeNodeRef.current.gain.setTargetAtTime(
        isMuted ? 0 : globalVolume * targetVolume,
        now,
        0.08, // Quick crossfade transition
      );
    }
  };

  // Local speech synthesis fallback module
  const fallbackSpeak = (text: string, callback?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      if (callback) callback();
      return;
    }

    duckMusic(true); // Lower background volume

    const voice = hindiVoiceRef.current;
    const utterance = new SpeechSynthesisUtterance(text);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    let hasCalled = false;
    const endUtterance = () => {
      if (!hasCalled) {
        hasCalled = true;
        duckMusic(false); // Restore background volume
        if (callback) callback();
      }
    };

    utterance.onend = endUtterance;
    utterance.onerror = endUtterance;

    // Safety fallback timeout to recover background volume in case window speech synthesis blocks
    setTimeout(endUtterance, 4500);

    window.speechSynthesis.speak(utterance);
  };

  // Plays streamed TTS voice audio directly and ducks background music during playback
  const playBoostedAudio = (
    url: string,
    fallbackText: string,
    callback?: () => void,
  ) => {
    duckMusic(true); // Lower background volume

    try {
      const audio = new Audio(url);
      audio.volume = 1.0;

      let hasPlayedOrFailed = false;
      const handleFallback = () => {
        if (!hasPlayedOrFailed) {
          hasPlayedOrFailed = true;
          fallbackSpeak(fallbackText, callback);
        }
      };

      audio.onended = () => {
        if (!hasPlayedOrFailed) {
          hasPlayedOrFailed = true;
          duckMusic(false); // Restore background volume
          if (callback) callback();
        }
      };

      audio.onerror = () => {
        handleFallback();
      };

      audio.play().catch((err) => {
        handleFallback();
      });
    } catch (e) {
      fallbackSpeak(fallbackText, callback);
    }
  };

  const speakSlang = () => {
    if (typeof window === "undefined") return;

    const voice = hindiVoiceRef.current;
    const hasHindi = !voice || voice.lang.startsWith("hi");

    const slangList = hasHindi ? ERROR_SLANG_HINDI : ERROR_SLANG_ROMAN;
    const line = slangList[Math.floor(Math.random() * slangList.length)];

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=hi&client=tw-ob&q=${encodeURIComponent(line)}`;
      playBoostedAudio(url, line);
    } catch (e) {
      fallbackSpeak(line);
    }
  };

  const speak = (text: string, callback?: () => void) => {
    if (typeof window === "undefined") {
      if (callback) callback();
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    let hasCalledBack = false;
    const triggerCallback = () => {
      if (!hasCalledBack) {
        hasCalledBack = true;
        duckMusic(false); // Restore background volume
        if (callback) callback();
      }
    };

    const fallbackTimeout = setTimeout(triggerCallback, 4500);

    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=hi&client=tw-ob&q=${encodeURIComponent(text)}`;
      playBoostedAudio(url, text, () => {
        clearTimeout(fallbackTimeout);
        triggerCallback();
      });
    } catch (e) {
      clearTimeout(fallbackTimeout);
      fallbackSpeak(text, triggerCallback);
    }
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
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 1.2);

    osc.type = "sawtooth";
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
      const snapTime = now + i * 0.03 + Math.random() * 0.01;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = Math.random() > 0.5 ? "triangle" : "sine";
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
    musicGain.gain.setValueAtTime(
      isMuted ? 0 : globalVolume * 1.0,
      ctx.currentTime,
    );
    musicVolumeNodeRef.current = musicGain;

    // Submerge filter for underwater lowpass effect
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(
      tsunamiState === "underwater" ? 320 : 20000,
      ctx.currentTime,
    );
    lowpass.Q.setValueAtTime(1, ctx.currentTime);
    musicFilterRef.current = lowpass;

    musicGain.connect(lowpass);
    lowpass.connect(destination);

    // Timing metrics
    const bpm = 135;
    const beatDuration = 60 / bpm; // 0.44s
    const barDuration = beatDuration * 4; // 1.77s

    let currentBar = 0;
    let nextBarTime = ctx.currentTime + 0.1;

    // Romantic Fmaj9 - G6 - Em7 - Am9 Progression
    const chords = [
      {
        bass: 130.81, // C3
        pad: [261.63, 311.13, 369.99, 440.0], // C diminished
        melody: [
          { beat: 0.0, freq: 523.25 }, // C5
          { beat: 1.0, freq: 554.37 }, // C#5 (Highly annoying minor second!)
          { beat: 2.0, freq: 739.99 }, // F#5 (Unstable tritone!)
          { beat: 3.0, freq: 783.99 }, // G5
        ],
      },
      {
        bass: 138.59, // C#3
        pad: [277.18, 329.63, 392.0, 466.16], // C# diminished
        melody: [
          { beat: 0.0, freq: 554.37 }, // C#5
          { beat: 1.0, freq: 587.33 }, // D5
          { beat: 2.0, freq: 783.99 }, // G5
          { beat: 3.0, freq: 830.61 }, // G#5
        ],
      },
      {
        bass: 123.47, // B2
        pad: [246.94, 293.66, 349.23, 415.3], // B diminished
        melody: [
          { beat: 0.0, freq: 493.88 }, // B4
          { beat: 1.0, freq: 523.25 }, // C5
          { beat: 2.0, freq: 698.46 }, // F5
          { beat: 3.0, freq: 739.99 }, // F#5
        ],
      },
      {
        bass: 116.54, // A#2
        pad: [233.08, 277.18, 329.63, 392.0], // A# diminished
        melody: [
          { beat: 0.0, freq: 466.16 }, // A#4
          { beat: 1.0, freq: 493.88 }, // B4
          { beat: 2.0, freq: 659.25 }, // E5
          { beat: 3.0, freq: 698.46 }, // F5
        ],
      },
    ];

    const scheduleBar = (barIndex: number, startTime: number) => {
      const data = chords[barIndex % chords.length];
      const now = startTime;
      const vol = isMuted ? 0 : globalVolume;

      // 1. Deep Bass line
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = "sine";
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
        padOsc.type = "sawtooth";
        padOsc.frequency.setValueAtTime(freq, now);

        padGain.gain.setValueAtTime(0, now);
        padGain.gain.linearRampToValueAtTime(vol * 0.2, now + 0.1);
        padGain.gain.setValueAtTime(vol * 0.2, now + barDuration - 0.2);
        padGain.gain.exponentialRampToValueAtTime(0.001, now + barDuration);

        const padFilter = ctx.createBiquadFilter();
        padFilter.type = "lowpass";
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

        melOsc.type = "square";
        melOsc.frequency.setValueAtTime(note.freq, noteTime);

        melGain.gain.setValueAtTime(0, noteTime);
        melGain.gain.linearRampToValueAtTime(vol * 0.5, noteTime + 0.01);
        melGain.gain.exponentialRampToValueAtTime(
          0.001,
          noteTime + beatDuration * 0.8,
        );

        const melFilter = ctx.createBiquadFilter();
        melFilter.type = "highpass";
        melFilter.frequency.setValueAtTime(320, noteTime);

        melOsc.connect(melFilter);
        melFilter.connect(melGain);
        melGain.connect(musicGain);

        melOsc.start(noteTime);
        melOsc.stop(noteTime + beatDuration * 0.8);
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
        isMuted ? 0 : globalVolume * 0.4,
        now,
        0.05,
      );
    }
  }, [globalVolume, isMuted]);

  // Smoothly muffle background music when underwater
  useEffect(() => {
    if (musicFilterRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      if (tsunamiState === "underwater") {
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

    osc1.type = "square";
    osc2.type = "sawtooth";

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
      gainNode.gain.linearRampToValueAtTime(
        isMuted ? 0 : globalVolume * 0.85,
        tStart + 0.01,
      );
      gainNode.gain.setValueAtTime(
        isMuted ? 0 : globalVolume * 0.85,
        tStart + beepLength - 0.02,
      );
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

  const play = (
    sound: "ERROR" | "RIP" | "DIALUP" | "CLICK" | "AMBIENCE" | "SYSTEM_ALARM",
  ) => {
    try {
      const ctx = getAudioContext();
      const dest = ctx.destination;

      switch (sound) {
        case "CLICK":
          synthClick(ctx, dest);
          break;
        case "ERROR":
          synthError(ctx, dest);
          break;
        case "DIALUP":
          synthDialup(ctx, dest);
          break;
        case "RIP":
          synthRip(ctx, dest);
          break;
        case "AMBIENCE":
          // Ambience plays our gorgeous looping romantic song instead of a simple hum!
          startRomanticMusic(ctx, dest);
          break;
        case "SYSTEM_ALARM":
          synthAlarm(ctx, dest);
          break;
      }
    } catch (e) {
      console.warn("Audio Context interaction pending user click gesture.");
    }
  };

  return (
    <AudioContext.Provider value={{ play, speak }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useSound = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useSound must be used within AudioProvider");
  return context;
};
