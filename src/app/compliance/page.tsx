'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TearingContainer from '@/components/tearing/TearingContainer';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '@/components/audio/AudioProvider';
import { AlertOctagon, ShieldAlert, HeartCrack, FileText, Lock, CheckCircle2, Siren } from 'lucide-react';

export default function CompliancePage() {
  const router = useRouter();
  const { play } = useSound();
  const { addPopup, triggerShake, triggerGlitch, incrementDamage } = useChaosStore();

  // Form states
  const [manipulation, setManipulation] = useState('');
  const [ghostingFreq, setGhostingFreq] = useState('hourly');
  const [password, setPassword] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);

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
    if (!isPasswordValid) {
      play('ERROR');
      addPopup({
        title: '⚠️ PASSWORD COMPLIANCE FAILURE',
        content: 'Password rules violated. Ensure two emojis, ex name, Roman numeral, and unresolved trauma are present.',
        x: 40,
        y: 40,
        type: 'warning'
      });
      return;
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
    }
  };

  return (
    <div className="min-h-screen bg-[#080208] text-white flex flex-col font-mono relative overflow-hidden">
      
      {/* SCANNING LASER DECORATION */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FF007F]/20 animate-bounce pointer-events-none z-10 shadow-[0_0_15px_#FF007F]" />

      <header className="p-4 border-b border-[#FF007F]/20 bg-black/60 backdrop-blur-md flex justify-between items-center z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/marketplace')}
            className="text-lg font-bold text-zinc-500 hover:text-[#FF007F] font-mono tracking-widest uppercase transition-colors"
          >
            [ Back ]
          </button>
          <span className="text-xl font-bold font-bebas text-[#FF007F] tracking-widest pl-2 animate-pulse">
            RELATIONSHIP COMPLIANCE CENTER
          </span>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-[10px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded bg-black/40">
            ID: RCC-9942-D
          </span>
        </div>
      </header>

      {/* CORE WRAPPED TEAR CONTAINER */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex items-center justify-center relative">
        <div className="w-full min-h-[580px] relative">
          <TearingContainer
            id="compliance-portal"
            tearType="diagonal"
            autoTearTrigger={autoTear}
            onTearComplete={() => router.push('/thank-you')}
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
                    play('DIALUP');
                    router.push('/thank-you');
                  }}
                  className="mt-8 px-8 py-3 bg-red-600 text-white font-bold uppercase tracking-widest rounded border border-black shadow-[4px_4px_0px_#000] hover:bg-white hover:text-black transition-all duration-300 text-xs animate-pulse"
                >
                  CLAIM DAMAGE RECEIPT &gt;
                </button>
              </div>
            }
          >
            {/* Primary Compliance Form Page */}
            <div className="h-full p-6 md:p-10 flex flex-col justify-between font-mono bg-gradient-to-br from-[#120516] to-[#040106] border border-zinc-800 rounded-lg select-none">
              
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
                  <div className="space-y-3 p-4 bg-black/60 border border-zinc-800 rounded">
                    <label className="text-[#FF007F] font-bold flex items-center gap-1.5">
                      <Lock size={12} />
                      ENTER PASSWORD SECURE COMPLIANCE KEY
                    </label>
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
      </main>

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

    </div>
  );
}
