'use client';

import { useState, useEffect, useRef } from 'react';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '../audio/AudioProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Heart, Zap, RefreshCw, Volume2, ShieldCheck, X } from 'lucide-react';
import gsap from 'gsap';

export default function LoginBossFight() {
  const { isBossFighting, setIsBossFighting, addPopup, triggerShake, triggerGlitch, incrementDamage } = useChaosStore();
  const { play } = useSound();

  const [stage, setStage] = useState<'password' | 'intro' | 'battle' | 'win' | 'loss'>('password');
  const [password, setPassword] = useState('');
  
  // Battle state metrics
  const [playerHP, setPlayerHP] = useState(100);
  const [bossHP, setBossHP] = useState(100);
  const [combatLogs, setCombatLogs] = useState<string[]>([
    '⚔️ BATTLE INITIATED: A wild GHOSTER SUPREME appears!',
    '⚔️ Turn 1: Select your first defensive situationship action...'
  ]);
  const [panicMsg, setPanicMsg] = useState('Aarav is judging your password typing...');

  // Speech Synth lock to prevent audio race conditions
  const lastSpokenChar = useRef('');

  // Native Web Speech character reader
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.82;
      utterance.pitch = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speaks password changes in real time
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);

    if (val.length === 0) {
      lastSpokenChar.current = '';
      return;
    }

    const lastChar = val[val.length - 1];
    
    // Character out loud reader
    if (lastChar !== lastSpokenChar.current) {
      lastSpokenChar.current = lastChar;
      
      // Map standard character spoken readouts
      let speakChar = lastChar;
      if (lastChar === ' ') speakChar = 'space';
      speakText(speakChar);
    }

    // Sarcastic keyword checks
    const lowerVal = val.toLowerCase();
    
    if (lowerVal.endsWith('ex')) {
      setTimeout(() => speakText('ex... oh... still stalking them on Spotify?'), 300);
      setPanicMsg('⚠️ EX DETECTED: Spotify ex-trackers activated in active Sector!');
    } else if (lowerVal.endsWith('love')) {
      setTimeout(() => speakText('love... a concept you struggle to calibrate.'), 300);
      setPanicMsg('⚠️ EXTREME BOUNDARY WARNING: Relapse risk at 94.2%');
    } else if (lowerVal.endsWith('riya') || lowerVal.endsWith('sneha')) {
      setTimeout(() => speakText('wow... her?... that explains your attachment history.'), 300);
      setPanicMsg('🚨 Sneha unmatched you instantly from active cache!');
    } else if (lowerVal.endsWith('kabir') || lowerVal.endsWith('karan')) {
      setTimeout(() => speakText('kabir?... prepare to be dry texted for 3 business days.'), 300);
      setPanicMsg('🚨 Kabir screenshotted your password to show the group chat!');
    } else if (lowerVal.endsWith('sad') || lowerVal.endsWith('trauma')) {
      setTimeout(() => speakText('trauma... standard DeluluMatch entry credentials detected.'), 300);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    play('DIALUP');
    setStage('intro');
    triggerShake(800);
    triggerGlitch(600);

    setTimeout(() => {
      setStage('battle');
      speakText('Combat protocol activated. Survive the Ghoster Supreme.');
    }, 2000);
  };

  // Turn Actions
  const handleAction = (type: 'communicate' | 'double_text' | 'cry') => {
    if (playerHP <= 0 || bossHP <= 0) return;

    if (type === 'communicate') {
      play('ERROR');
      triggerShake(400);
      
      const seenPenalty = 25;
      const nextPlayerHP = Math.max(0, playerHP - seenPenalty);
      
      setPlayerHP(nextPlayerHP);
      setCombatLogs(prev => [
        `❌ You clicked COMMUNICATE. The Ghoster Supreme left you on SEEN immediately. Emotional Damage -${seenPenalty}!`,
        ...prev
      ]);
      speakText('Left on read.');

      if (nextPlayerHP <= 0) handleLoss();

    } else if (type === 'double_text') {
      play('RIP');
      triggerShake(600);
      triggerGlitch(300);
      
      const dmg = 35;
      const selfDmg = 30;
      const nextBossHP = Math.max(0, bossHP - dmg);
      const nextPlayerHP = Math.max(0, playerHP - selfDmg);

      setBossHP(nextBossHP);
      setPlayerHP(nextPlayerHP);
      setCombatLogs(prev => [
        `💥 CRITICAL HIT! You double-texted Sneha. Ghoster's Commitment Avoidance cracks by -${dmg} HP!`,
        `⚠️ Self-Respect drains heavily! You lost -${selfDmg} Emotional Stability HP.`,
        ...prev
      ]);
      speakText('Double text sent. Self respect compromised.');

      if (nextBossHP <= 0) {
        handleWin();
      } else if (nextPlayerHP <= 0) {
        handleLoss();
      }

    } else if (type === 'cry') {
      play('CLICK');
      const heal = 25;
      const nextPlayerHP = Math.min(100, playerHP + heal);
      
      setPlayerHP(nextPlayerHP);
      setCombatLogs(prev => [
        `🛡️ You entered a crying session in the dark. Emotional Stability restored by +${heal} HP!`,
        ...prev
      ]);
      speakText('Crying session concluded. Stability temporarily restored.');
    }
  };

  const handleWin = () => {
    setStage('win');
    play('DIALUP');
    triggerShake(1200);
    triggerGlitch(1000);
    incrementDamage(25);
    speakText('Ghoster supreme defeated. Login authorized.');

    setTimeout(() => {
      addPopup({
        title: '🏆 LOGIN BOSS DEFEATED!',
        content: 'Unbelievable! You shattered the Ghoster Supreme’s avoidance shields. Login fully authorized. Emotional survival confirmed!',
        x: 35,
        y: 40,
        type: 'therapy'
      });
      setIsBossFighting(false);
      resetArena();
    }, 2800);
  };

  const handleLoss = () => {
    setStage('loss');
    play('ERROR');
    speakText('Stability zero. Relapse risk imminent.');
  };

  const resetArena = () => {
    setPlayerHP(100);
    setBossHP(100);
    setPassword('');
    setStage('password');
    setCombatLogs([
      '⚔️ BATTLE INITIATED: A wild GHOSTER SUPREME appears!',
      '⚔️ Turn 1: Select your first defensive situationship action...'
    ]);
  };

  if (!isBossFighting) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-[10005] flex items-center justify-center p-4 font-mono select-none overflow-hidden">
      
      {/* Cinematic Red CRT Scanlines Overlay */}
      <div className="absolute inset-0 bg-red-950/10 pointer-events-none z-10 scan-overlay" />
      <div className="absolute inset-0 pointer-events-none z-15 crt-vignette opacity-80" />

      {/* Close button to escape if locked */}
      <button 
        onClick={() => {
          play('ERROR');
          setIsBossFighting(false);
          resetArena();
        }}
        className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-[#FF007F] hover:bg-[#FF007F]/10 border border-zinc-800 rounded transition-all z-50 pointer-events-auto"
        title="Abandon situationship login"
      >
        <X size={18} />
      </button>

      {/* 1. PASSWORD READOUT OUT-LOUD ENTER STEP */}
      {stage === 'password' && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md p-6 border-2 border-[#FF007F] bg-zinc-950 rounded shadow-[0_0_40px_rgba(255,0,127,0.3)] space-y-6 relative z-20"
        >
          <div className="space-y-1 pb-3 border-b border-[#FF007F]/20 text-center">
            <h2 className="text-xl font-extrabold text-[#FF007F] font-bebas tracking-widest flex items-center justify-center gap-2">
              <ShieldAlert className="animate-pulse" size={18} />
              EMOTIONAL GATEWAY VERIFICATION
            </h2>
            <p className="text-[9px] text-zinc-500 uppercase">Y2K.AUTHENTICATION.PORTAL</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">
                Enter situationship password:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="We promise not to read it out loud..."
                  autoComplete="off"
                  className="w-full bg-black/60 border border-[#FF007F]/40 focus:border-[#FF007F] rounded p-3 text-xs text-white placeholder-zinc-700 outline-none transition-all pr-10 tracking-widest"
                />
                <Volume2 size={16} className="absolute right-3 top-3.5 text-[#FF007F]/60 animate-bounce" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!password}
              className="w-full py-3 bg-[#FF007F] text-black font-extrabold text-xs uppercase tracking-wider rounded hover:bg-pink-400 transition-all shadow-[0_0_15px_#FF007F] disabled:opacity-40"
            >
              Verify attachment stability
            </button>
          </form>

          {/* Social Panic Feed reactions */}
          <div className="bg-black/80 border border-zinc-800 p-3 rounded text-[9px] uppercase space-y-1 min-h-[42px] flex items-center justify-center text-center">
            <span className="text-pink-400 font-bold leading-normal animate-flicker">
              {panicMsg}
            </span>
          </div>
        </motion.div>
      )}

      {/* 2. ANIME TRANSITION BATTLE INTRO */}
      {stage === 'intro' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4 z-20"
        >
          <motion.h1
            animate={{ scale: [1, 1.2, 1], rotate: [-2, 2, -2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-6xl md:text-8xl text-red-500 font-extrabold font-bebas tracking-tighter"
          >
            ⚠️ WARNING! WARNING! ⚠️
          </motion.h1>
          <p className="text-xs uppercase text-zinc-400 tracking-[0.25em] animate-pulse">
            SITUATIONSHIP SECURES CORRUPTED. PREPARE FOR BATTLE.
          </p>
        </motion.div>
      )}

      {/* 3. THE GHOSTER SUPREME TURN-BASED ARENA */}
      {stage === 'battle' && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 z-20 items-stretch h-[600px]">
          
          {/* Left Column: Battle Canvas */}
          <div className="md:col-span-8 border border-red-500 bg-black/80 rounded p-5 flex flex-col justify-between relative">
            
            {/* HUD: Boss Bars */}
            <div className="space-y-2 border-b border-red-500/20 pb-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-red-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  ☠️ THE GHOSTER SUPREME
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">STABILITY DEFICIT: {bossHP}%</span>
              </div>
              <div className="w-full h-3 bg-zinc-950 p-0.5 rounded border border-red-500/30">
                <motion.div
                  animate={{ width: `${bossHP}%` }}
                  className="h-full bg-red-600 shadow-[0_0_10px_#ef4444]"
                />
              </div>
            </div>

            {/* Boss visual vector drawings */}
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden my-4 py-8">
              
              {/* Massive pixelated glowing Neon silhouette of the Ghoster */}
              <div className="relative">
                <GhosterSVG scale={1.2 + (bossHP / 200)} />
                
                {/* Floating unread chat bubble clouds */}
                <div className="absolute top-[-25px] left-[-35px] bg-[#8A2BE2] border border-[#FF007F] text-white text-[7px] font-mono p-1 rounded animate-bounce">
                  💬 left on read
                </div>
                <div className="absolute top-[40px] right-[-45px] bg-red-950 border border-red-500 text-red-300 text-[6px] font-mono p-1 rounded animate-pulse">
                  💬 read 3 business days ago
                </div>
              </div>

              {/* Glowing blinking boss eyes */}
              <div className="absolute flex gap-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
            </div>

            {/* HUD: Player Bars */}
            <div className="space-y-2 border-t border-zinc-800 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  💖 PLAYER SELF-RESPECT
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Stability HP: {playerHP}/100</span>
              </div>
              <div className="w-full h-3 bg-zinc-950 p-0.5 rounded border border-green-500/30">
                <motion.div
                  animate={{ width: `${playerHP}%` }}
                  className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Actions & Logs */}
          <div className="md:col-span-4 flex flex-col gap-4 justify-between">
            
            {/* Interactive choices box */}
            <div className="border border-red-500 bg-zinc-950 p-4 rounded space-y-3">
              <h4 className="text-[10px] text-red-400 font-bold uppercase tracking-wider border-b border-red-500/20 pb-2">
                SELECT SITUATIONSHIP COMMAND:
              </h4>
              
              <div className="flex flex-col gap-2">
                {/* 1. Communicate (Seen Trap) */}
                <button
                  onClick={() => handleAction('communicate')}
                  className="w-full py-2.5 bg-black border border-red-500/50 hover:border-red-500 text-red-500 text-[10px] uppercase font-bold rounded flex items-center justify-between px-3 transition-all"
                >
                  <span>[1] COMMUNICATE</span>
                  <span className="text-[7px] text-zinc-500">SEEN RISK: 99%</span>
                </button>

                {/* 2. Double Text (Self-Damage hit) */}
                <button
                  onClick={() => handleAction('double_text')}
                  className="w-full py-2.5 bg-red-950/20 border border-[#FF007F]/50 hover:border-[#FF007F] text-[#FF007F] text-[10px] uppercase font-bold rounded flex items-center justify-between px-3 transition-all"
                >
                  <span>[2] DOUBLE TEXT</span>
                  <span className="text-[7px] text-zinc-500">DMG: 35 | HP: -30</span>
                </button>

                {/* 3. Cry (Stability Restore) */}
                <button
                  onClick={() => handleAction('cry')}
                  className="w-full py-2.5 bg-black border border-green-500/50 hover:border-green-500 text-green-400 text-[10px] uppercase font-bold rounded flex items-center justify-between px-3 transition-all"
                >
                  <span>[3] CRY / THERAPY</span>
                  <span className="text-[7px] text-zinc-500">HEAL: +25 HP</span>
                </button>

                {/* 4. Move On (Evasive Trap button!) */}
                <motion.button
                  onMouseEnter={(e) => {
                    play('CLICK');
                    const target = e.currentTarget;
                    gsap.to(target, {
                      x: (Math.random() - 0.5) * 120,
                      y: (Math.random() - 0.5) * 60,
                      duration: 0.2
                    });
                  }}
                  className="w-full py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-600 text-[10px] uppercase font-bold rounded flex items-center justify-between px-3 cursor-not-allowed"
                  style={{ pointerEvents: 'auto' }}
                >
                  <span>[4] MOVE ON</span>
                  <span className="text-[7px] text-zinc-700">LOCKED</span>
                </motion.button>
              </div>
            </div>

            {/* Combat log entries */}
            <div className="flex-1 border border-zinc-800 bg-black/90 p-4 rounded flex flex-col justify-between">
              <h4 className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider pb-2 border-b border-zinc-900">
                COMBAT EVENT LOG:
              </h4>
              <div className="flex-1 overflow-y-auto space-y-2 pt-2 pr-1 max-h-[220px] text-[9px] uppercase leading-relaxed font-mono">
                {combatLogs.map((log, idx) => (
                  <div key={idx} className={
                    log.includes('💥') ? 'text-pink-400 font-bold' : 
                    (log.includes('❌') ? 'text-red-400 font-bold' : 
                    (log.includes('🛡️') ? 'text-green-400 font-bold' : 'text-zinc-500'))
                  }>
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. THE TURN EXPLOSIVE WIN SCREEN */}
      {stage === 'win' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 z-20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center mx-auto bg-green-500/10 shadow-[0_0_40px_#22c55e]"
          >
            <ShieldCheck size={48} className="text-green-400" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-extrabold text-green-400 font-bebas tracking-widest">
              SITUATIONSHIP CRACKED SUCCESSFULLY!
            </h1>
            <p className="text-xs uppercase text-zinc-400 tracking-[0.2em] animate-pulse">
              LOGIN AUTHORIZED. CACHES SYNCED. RED FLAGS VERIFIED.
            </p>
          </div>
        </motion.div>
      )}

      {/* 5. THE TURN RELAPSE LOSS SCREEN */}
      {stage === 'loss' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 z-20 max-w-md p-6 bg-zinc-950 border border-red-500 rounded"
        >
          <h2 className="text-4xl text-red-500 font-extrabold font-bebas tracking-widest">K.O.! SELF-RESPECT ZERO</h2>
          <p className="text-xs text-zinc-400 leading-relaxed uppercase">
            Your emotional stability hit 0 HP. You relapsed, texted your ex, and agreed to be a backup situationship.
          </p>

          <button
            onClick={resetArena}
            className="w-full py-3 bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider rounded hover:bg-red-500 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            Try again to fix them
          </button>
        </motion.div>
      )}

    </div>
  );
}

// Pixelated Glowing Neon Silhouette vector representation of the Ghoster Supreme
function GhosterSVG({ scale = 1 }: { scale?: number }) {
  return (
    <svg 
      width="140" 
      height="140" 
      viewBox="0 0 100 100" 
      className="animate-pulse origin-center transition-transform"
      style={{ 
        transform: `scale(${scale})`, 
        filter: 'drop-shadow(0 0 16px #ef4444) drop-shadow(0 0 4px #8A2BE2)' 
      }}
    >
      {/* Outer Ghost Cloak */}
      <path 
        d="M20,75 C20,35 30,15 50,15 C70,15 80,35 80,75 C80,82 72,82 68,76 C64,72 58,72 54,76 L50,80 L46,76 C42,72 36,72 32,76 C28,82 20,82 20,75 Z" 
        fill="#120202" 
        stroke="#ef4444" 
        strokeWidth="2.5" 
      />
      
      {/* Exaggerated digital textures */}
      <line x1="30" y1="35" x2="70" y2="35" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
      <line x1="25" y1="55" x2="75" y2="55" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,5" />
      
      {/* Avoidant armor chains */}
      <path d="M35,62 Q50,72 65,62" fill="none" stroke="#8A2BE2" strokeWidth="2.5" />
    </svg>
  );
}
