'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TearingContainer from '@/components/tearing/TearingContainer';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '@/components/audio/AudioProvider';
import { AlertOctagon, ShieldAlert, HeartCrack, FileText, Lock, CheckCircle2, Siren } from 'lucide-react';
import Image from 'next/image';
import ComplianceSystemWipe from '@/components/cursed-ui/ComplianceSystemWipe';

export default function CompliancePage() {
  const router = useRouter();
  const { play } = useSound();
  const { addPopup, triggerShake, triggerGlitch, incrementDamage, popups, clearPopups } = useChaosStore();

  // Clear all popups on mount
  useEffect(() => {
    clearPopups();
  }, [clearPopups]);

  // Form states
  const [manipulation, setManipulation] = useState('');
  const [ghostingFreq, setGhostingFreq] = useState('hourly');
  const [password, setPassword] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  // Picker drawers states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showRomanPicker, setShowRomanPicker] = useState(false);

  // Tearing trigger
  const [autoTear, setAutoTear] = useState(false);
  const [tearTriggered, setTearTriggered] = useState(false);

  // Password Hell Validation Rules
  const hasTwoEmojis = (val: string) => {
    const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}/gu;
    const matches = val.match(emojiRegex);
    return matches ? matches.length >= 2 : false;
  };
  const hasExName = (val: string) => {
    // Simple checks for common names or just a capital word representing ex
    return /[A-Z][a-z]+/.test(val);
  };
  const hasRomanNumeral = (val: string) => {
    return /\b(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\b/.test(val) && /[IVXLCDM]/.test(val);
  };
  const hasTraumaWord = (val: string) => {
    const traumas = ['ghosting', 'toxic', 'avoidant', 'trauma', 'ex', 'crying', 'manipulation', 'cheating', 'read', 'ignoring'];
    return traumas.some(word => val.toLowerCase().includes(word));
  };

  const isPasswordValid = hasTwoEmojis(password) && hasExName(password) && hasRomanNumeral(password) && hasTraumaWord(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show password warning but DON'T block submission
    if (!isPasswordValid) {
      play('ERROR');
      addPopup({
        title: '⚠️ PASSWORD COMPLIANCE FAILURE',
        content: 'Password rules violated. But your lack of self-respect has been noted. Proceeding anyway...',
        x: 40,
        y: 40,
        type: 'warning'
      });
    }

    play('CLICK');
    setSubmitAttempts(prev => prev + 1);

    if (submitAttempts === 0) {
      // First attempt: reject with "Self-Respect Detected" comedy warning!
      play('ERROR');
      triggerShake(300);
      triggerGlitch(400);
      incrementDamage(10);
      setTimeout(() => {
        addPopup({
          title: '⚠️ COMMITMENT REJECTED',
          content: 'Self-respect detected in current session cache. Please purge all self-respect, embrace emotional destruction, and submit again.',
          x: 35,
          y: 45,
          type: 'toxic'
        });
      }, 300);
    } else {
      // Second attempt: Execute programmatic diagonal page tear!
      setIsLocked(true);
      play('DIALUP');
      triggerShake(1200);
      triggerGlitch(1200);
      incrementDamage(25);

      setTimeout(() => {
        setAutoTear(true);
        setTearTriggered(true);
      }, 1000);

      // Fallback navigation if tearing doesn't trigger onTearComplete
      setTimeout(() => {
        clearPopups();
        window.location.href = '/thank-you';
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0411] text-white flex flex-col font-mono relative overflow-hidden">
      
      {/* SCANNING LASER DECORATION */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FF007F]/20 animate-bounce pointer-events-none z-10 shadow-[0_0_15px_#FF007F]" />

      <header className="p-5 border-b border-[#FF007F]/30 bg-black/75 backdrop-blur-md flex justify-between items-center z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              clearPopups();
              window.location.href = '/marketplace';
            }}
            className="text-lg font-bold text-zinc-400 hover:text-[#FF007F] font-mono tracking-widest uppercase transition-colors"
          >
            [ Back ]
          </button>
          <span className="text-2xl font-bold font-bebas text-[#FF007F] tracking-widest pl-2 animate-pulse">
            RELATIONSHIP COMPLIANCE CENTER
          </span>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-[10px] text-pink-500 font-mono tracking-wider border border-[#FF007F]/40 px-3 py-1 rounded bg-black/60 shadow-[0_0_15px_rgba(255,0,127,0.2)]">
            ID: RCC-9942-D
          </span>
        </div>
      </header>

      {/* EXPANDED SIDE-BY-SIDE CORE LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* Left Side: Y2K Cyber Couple Animated Vector Panel (lg:col-span-5) */}
        <section data-emotional-object="true" className="lg:col-span-5 flex flex-col justify-center items-center w-full">
          <div className="w-full bg-black/60 border border-[#FF007F]/30 rounded-lg p-6 relative overflow-hidden shadow-[0_0_50px_rgba(255,0,127,0.15)] select-none">
            <div className="absolute top-2 left-3 px-1.5 py-0.5 bg-[#FF007F] text-black font-bold text-[8px] rounded uppercase animate-pulse">
              System Vector Overlay
            </div>
            
            <div className="relative w-full h-[360px] md:h-[400px] border border-zinc-900 bg-black rounded overflow-hidden mt-2">
              {/* Scanlines grid */}
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
              
              <Image 
                src="/y2k_toxic_couple.png"
                alt="Y2K Toxic Couple"
                fill
                className="object-cover opacity-85 scale-102 transition-transform duration-700 hover:scale-105"
              />
              
              {/* Pulsing neon overlay lines */}
              <div className="absolute inset-0 border-[3px] border-[#FF007F]/20 pointer-events-none animate-pulse" />
              <div className="absolute inset-0 bg-[#FF007F]/5 pointer-events-none" />
            </div>

            <div className="mt-5 space-y-2 uppercase text-[10px] text-zinc-400 font-mono tracking-tighter">
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span>SUBJECT A (ATTACHMENT THREAT):</span>
                <span className="text-[#FF007F] font-bold">AVOIDANT PREDISPOSED</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span>SUBJECT B (ANXIOUS THREAT):</span>
                <span className="text-purple-400 font-bold">DELUSIONAL SEEKER</span>
              </div>
              <div className="text-[9px] text-zinc-600 pt-1 text-center leading-normal">
                * COMPATIBILITY ALIGNMENT ALGORITHM COMPILING AT 12% EFFICIENCY. RESISTANCE DETECTED.
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Primary Compliance Portal Tearing Container (lg:col-span-7) */}
        <section data-emotional-object="true" className="lg:col-span-7 w-full">
          <div className="w-full h-[620px] md:h-[640px] relative">
            <TearingContainer
              id="compliance-portal"
              tearType="diagonal"
            autoTearTrigger={autoTear}
            onTearComplete={() => {
              clearPopups();
              window.location.href = '/thank-you';
            }}
            underlayer={
              <div className="p-6 md:p-12 text-center flex flex-col items-center justify-center h-full bg-[#050005] border border-red-500/40 rounded-lg shadow-[inset_0_0_50px_rgba(255,0,0,0.2)]">
                <Siren size={60} className="text-red-500 animate-bounce" />
                
                <h2 className="font-bebas text-4xl md:text-5xl text-red-500 tracking-widest font-bold uppercase mt-4 animate-pulse">
                  EMERGENCY BREAKUP PROTOCOL ACTIVATED
                </h2>
                
                <p className="text-xs md:text-sm text-zinc-300 max-w-lg leading-relaxed uppercase mt-4">
                  Commitment failure overflow. Relationship contract successfully torn in half. 
                  All active attachments are permanently severed. Calibrating financial trauma tax...
                </p>

                {/* Corrupted hidden warning logs */}
                <div className="w-full max-w-md bg-black/80 border border-red-500/20 p-4 rounded text-left text-[10px] text-red-400 space-y-1 font-mono uppercase mt-6 select-none">
                  <div>[RCC-LOG] RELATIONSHIP STATUS: FORCE SHUTDOWN</div>
                  <div>[RCC-LOG] SELF-RESPECT: PARTIALLY RESTORED</div>
                  <div>[RCC-LOG] ATTACHMENT CACHE: FLUSHED</div>
                  <div className="text-white animate-pulse font-bold">[RCC-LOG] PENDING ACTIONS: RECEIPT DOWNLOAD REQUIRED</div>
                </div>

                <button
                  onClick={() => {
                    clearPopups();
                    play('DIALUP');
                    window.location.href = '/thank-you';
                  }}
                  className="mt-8 px-8 py-3 bg-red-600 text-white font-bold uppercase tracking-widest rounded border border-black shadow-[4px_4px_0px_#000] hover:bg-white hover:text-black transition-all duration-300 text-xs animate-pulse"
                >
                  CLAIM DAMAGE RECEIPT &gt;
                </button>
              </div>
            }
          >
            {/* Primary Compliance Form Page */}
            <div data-normal-cursor className="h-full p-6 md:p-10 flex flex-col justify-between font-mono bg-gradient-to-br from-[#120516] to-[#040106] border border-zinc-800 rounded-lg select-none">
              
              <div className="space-y-6">
                
                {/* Header elements */}
                <div className="flex justify-between items-start pb-4 border-b border-zinc-900">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#FF007F] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                      <FileText size={12} />
                      FORM RCC-442: REGISTRATION OF DELUSION
                    </span>
                    <h2 className="text-2xl font-bold font-bebas text-white tracking-widest uppercase">
                      COMMITMENT AGREEMENT CONTRACT
                    </h2>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] text-[#FF0000] font-bold bg-[#FF0000]/10 border border-[#FF0000]/30 px-2 py-0.5 rounded animate-pulse">
                      SAFETY STATUS: FAILED
                    </span>
                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit} className="space-y-6 text-xs uppercase">
                  
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[#FF007F] font-bold flex items-center gap-1.5">
                        <AlertOctagon size={12} />
                        Preferred Manipulation Technique
                      </label>
                      <select 
                        value={manipulation}
                        onChange={(e) => {
                          setManipulation(e.target.value);
                          play('CLICK');
                        }}
                        required
                        className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white focus:border-[#FF007F] focus:outline-none"
                      >
                        <option value="">Select emotional weapon...</option>
                        <option value="gaslighting">Gaslighting (Classic)</option>
                        <option value="ghosting">Ghosting (Silent treatment)</option>
                        <option value="lovebombing">Lovebombing (Immediate regret)</option>
                        <option value="relapse">REL RELAPSE EX-MESSAGING</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#FF007F] font-bold flex items-center gap-1.5">
                        <HeartCrack size={12} />
                        Ghosting Frequency
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['hourly', 'weekly', 'bi-monthly'].map(freq => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => {
                              setGhostingFreq(freq);
                              play('CLICK');
                            }}
                            className={`py-2 text-center border rounded ${
                              ghostingFreq === freq 
                                ? 'bg-[#FF007F] text-black border-black font-bold' 
                                : 'bg-black border-zinc-800 hover:border-[#FF007F]/40'
                            } transition-colors`}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Password Hell */}
                  <div className="space-y-3 p-4 bg-black/70 border border-[#FF007F]/20 rounded relative">
                    <div className="flex justify-between items-center">
                      <label className="text-[#FF007F] font-bold flex items-center gap-1.5 uppercase">
                        <Lock size={12} />
                        ENTER PASSWORD SECURE COMPLIANCE KEY
                      </label>
                      
                      {/* Keyboard Quick Inject Corner Launchers */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            play('CLICK');
                            setShowEmojiPicker(prev => !prev);
                            setShowRomanPicker(false);
                          }}
                          className={`px-2 py-0.5 text-[8px] font-mono border rounded uppercase transition-all ${
                            showEmojiPicker 
                              ? 'bg-[#FF007F] text-black border-black font-bold' 
                              : 'bg-black text-[#FF007F] border-[#FF007F]/40 hover:border-[#FF007F]'
                          }`}
                        >
                          🤡 EMOJI KEYPAD
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            play('CLICK');
                            setShowRomanPicker(prev => !prev);
                            setShowEmojiPicker(false);
                          }}
                          className={`px-2 py-0.5 text-[8px] font-mono border rounded uppercase transition-all ${
                            showRomanPicker 
                              ? 'bg-[#8A2BE2] text-white border-white font-bold animate-pulse' 
                              : 'bg-black text-purple-400 border-purple-800/60 hover:border-purple-600'
                          }`}
                        >
                          🏛️ ROMAN KEYPAD
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="e.g. 🤡💔RiyaXIVghosting"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (Math.random() > 0.8) play('CLICK');
                        }}
                        required
                        className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white text-sm focus:border-[#FF007F] focus:outline-none placeholder-zinc-700 tracking-wider"
                      />

                      {/* EMOJI KEYPAD DRAWER PANEL */}
                      <AnimatePresence>
                        {showEmojiPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 4, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            className="absolute top-full right-0 mt-1 z-50 p-3 bg-black border border-[#FF007F]/40 rounded-md shadow-[0_0_20px_rgba(255,0,127,0.4)] w-48 space-y-2"
                          >
                            <div className="text-[8px] text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-1 flex justify-between">
                              <span>TAP TO INJECT</span>
                              <span className="text-[#FF007F] font-bold">EMOJI</span>
                            </div>
                            <div className="grid grid-cols-5 gap-1.5">
                              {['🤡', '💔', '😭', '🥵', '🫣', '👻', '🩹', '🥀', '💀', '🔒'].map(emo => (
                                <button
                                  key={emo}
                                  type="button"
                                  onClick={() => {
                                    play('CLICK');
                                    setPassword(prev => prev + emo);
                                  }}
                                  className="w-7 h-7 bg-zinc-900/60 border border-zinc-800 rounded flex items-center justify-center text-sm hover:border-[#FF007F] hover:bg-black transition-all"
                                >
                                  {emo}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ROMAN KEYPAD DRAWER PANEL */}
                      <AnimatePresence>
                        {showRomanPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 4, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            className="absolute top-full right-0 mt-1 z-50 p-3 bg-black border border-purple-500/40 rounded-md shadow-[0_0_20px_rgba(138,43,226,0.4)] w-48 space-y-2"
                          >
                            <div className="text-[8px] text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-1 flex justify-between">
                              <span>TAP TO INJECT</span>
                              <span className="text-purple-400 font-bold">ROMAN</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                              {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XIV', 'M'].map(num => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => {
                                    play('CLICK');
                                    setPassword(prev => prev + num);
                                  }}
                                  className="py-1 text-[9px] bg-zinc-900/60 border border-zinc-800 rounded flex items-center justify-center font-bold text-purple-300 hover:border-[#8A2BE2] hover:bg-black transition-all"
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Verification Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px] text-zinc-500 pt-2 border-t border-zinc-900 font-mono uppercase">
                      <div className={`flex items-center gap-1.5 ${hasTwoEmojis(password) ? 'text-[#32CD32]' : ''}`}>
                        <CheckCircle2 size={10} /> Must contain at least two emojis (🤡💔)
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasExName(password) ? 'text-[#32CD32]' : ''}`}>
                        <CheckCircle2 size={10} /> Must include your ex's name (Capitalized)
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasRomanNumeral(password) ? 'text-[#32CD32]' : ''}`}>
                        <CheckCircle2 size={10} /> Must contain a Roman numeral (XIV)
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasTraumaWord(password) ? 'text-[#32CD32]' : ''}`}>
                        <CheckCircle2 size={10} /> Must declare unresolved ex trauma (ghosting)
                      </div>
                    </div>
                  </div>

                  {/* Submission triggers */}
                  <div className="pt-4 border-t border-zinc-950 flex flex-col items-center">
                    <button
                      type="submit"
                      disabled={isLocked}
                      className={`px-12 py-3 bg-[#FF007F] text-black font-bold uppercase tracking-widest rounded border border-black shadow-[4px_4px_0px_#8A2BE2] hover:shadow-[0_0_20px_#FF007F] transition-all duration-300 text-xs w-full max-w-sm ${
                        isLocked ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                      {submitAttempts === 0 ? 'COMMIT TO RELATIONSHIP' : 'CONFIRM PURGE & COMMIT'}
                    </button>
                    <p className="text-[9px] text-zinc-600 mt-3 text-center">
                      * BY CLICKING COMMIT, YOU FORFEIT DIGNITY, RECOVERY RIGHTS, AND CALM WEEKENDS.
                    </p>
                  </div>

                </form>

              </div>

              {/* Bottom bar */}
              <div className="text-[9px] text-zinc-600 text-center uppercase tracking-widest border-t border-zinc-900 pt-3">
                Official relationship regulatory mesh OS-v1.2
              </div>

            </div>
          </TearingContainer>
        </div>
      </section>
    </main>

      {/* 10-STICKER Y2K DRIFT MATRIX BELT */}
      <section data-emotional-object="true" className="w-full max-w-7xl mx-auto px-6 pb-6 relative z-10">
        <div className="relative flex flex-nowrap md:flex-wrap gap-4 md:gap-6 justify-center items-center h-28 border border-[#FF007F]/20 bg-black/50 rounded-lg p-4 overflow-x-auto overflow-y-hidden md:overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] scrollbar-none">
          <div className="absolute top-1 left-2 text-[7px] text-zinc-500 font-mono tracking-widest uppercase">
            Trauma Asset Cluster (10-Element Drift Matrix)
          </div>
          
          {driftingStickers.map((sticker, idx) => {
            const rotationDirection = idx % 2 === 0 ? 1 : -1;
            const driftY = idx % 2 === 0 ? [0, -6, 0] : [0, 6, 0];
            const driftDuration = 4 + (idx % 3) * 0.8;

            if (sticker.type === 'image') {
              return (
                <motion.div
                  key={idx}
                  animate={{ 
                    rotate: [rotationDirection * -3, rotationDirection * 3, rotationDirection * -3], 
                    y: driftY 
                  }}
                  transition={{ repeat: Infinity, duration: driftDuration, ease: 'easeInOut', delay: sticker.delay }}
                  className="w-16 h-16 md:w-20 md:h-20 relative z-10 shrink-0 select-none cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-300"
                >
                  <Image 
                    src={sticker.src || ''} 
                    alt={sticker.alt || ''} 
                    fill 
                    className="object-contain"
                    style={{ filter: `drop-shadow(0 0 10px ${sticker.glow})` }}
                  />
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  key={idx}
                  animate={{ 
                    rotate: [rotationDirection * -5, rotationDirection * 5, rotationDirection * -5], 
                    y: driftY 
                  }}
                  transition={{ repeat: Infinity, duration: driftDuration, ease: 'easeInOut', delay: sticker.delay }}
                  className="w-16 h-16 md:w-20 md:h-20 border border-zinc-900 bg-black/85 rounded p-2 flex flex-col items-center justify-center relative z-10 shrink-0 select-none cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-300 font-mono text-[6px]"
                  style={{ color: sticker.color, boxShadow: `inset 0 0 15px rgba(0,0,0,0.6), 0 0 10px ${sticker.color}20` }}
                >
                  <div style={{ filter: `drop-shadow(0 0 6px ${sticker.color})` }}>
                    {sticker.element}
                  </div>
                  <span className="mt-1 opacity-70 tracking-widest font-bold font-mono text-center truncate w-full">
                    {sticker.label}
                  </span>
                </motion.div>
              );
            }
          })}
        </div>
      </section>

      {/* Ticker bar bottom */}
      <div className="h-6 bg-[#FF007F] text-black flex items-center overflow-hidden font-mono text-[8px] uppercase tracking-wider font-bold z-40">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap flex gap-12"
        >
          <span>🚨 rcc alert: attachment limits breached...</span>
          <span>🚨 self-respect calibration failed...</span>
          <span>🚨 situationship verification index: highly unstable...</span>
          <span>🚨 please fill trauma pass forms promptly...</span>
          
          {/* Loop copies */}
          <span>🚨 rcc alert: attachment limits breached...</span>
          <span>🚨 self-respect calibration failed...</span>
          <span>🚨 situationship verification index: highly unstable...</span>
          <span>🚨 please fill trauma pass forms promptly...</span>
        </motion.div>
      </div>

      <ComplianceSystemWipe />
    </div>
  );
}

// 10-STICKER STATIC DATASET
const driftingStickers = [
  { type: 'image', src: '/delulu_crying_heart.png', alt: 'Crying Heart', delay: 0, glow: 'rgba(255,0,127,0.4)' },
  { type: 'image', src: '/toxic_romance_receipt.png', alt: 'Receipt', delay: 0.5, glow: 'rgba(255,0,127,0.4)' },
  { type: 'image', src: '/delulu_ex_calling.png', alt: 'Incoming Call', delay: 1, glow: 'rgba(138,43,226,0.4)' },
  { type: 'image', src: '/broken_heart_shattered.png', alt: 'Shattered Heart', delay: 1.5, glow: 'rgba(255,20,147,0.4)' },
  { type: 'image', src: '/y2k_floppy_disk.png', alt: 'Ex Files Floppy', delay: 2, glow: 'rgba(255,0,127,0.4)' },
  { type: 'image', src: '/y2k_trauma_cd.png', alt: 'Trauma CD', delay: 2.5, glow: 'rgba(138,43,226,0.4)' },
  { type: 'image', src: '/y2k_toxic_couple.png', alt: 'Toxic Couple', delay: 3, glow: 'rgba(255,0,85,0.4)' },
  { 
    type: 'svg', 
    label: 'EX TEXT',
    delay: 3.5, 
    color: '#FFD700',
    element: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )
  },
  { 
    type: 'svg', 
    label: 'DIGNITY KEY',
    delay: 4, 
    color: '#32CD32',
    element: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3M15.5 7.5L19 4" />
      </svg>
    )
  },
  { 
    type: 'svg', 
    label: 'TRMA PAGER',
    delay: 4.5, 
    color: '#00FFFF',
    element: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
        <line x1="6" y1="8" x2="18" y2="8" />
        <line x1="6" y1="12" x2="14" y2="12" />
        <circle cx="18" cy="15" r="1" />
      </svg>
    )
  }
];
