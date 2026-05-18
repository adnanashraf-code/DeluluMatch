'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import TearingContainer from '@/components/tearing/TearingContainer';
import { useChaosStore } from '@/store/useChaosStore';
import { useSound } from '@/components/audio/AudioProvider';
import { Heart, X, AlertOctagon, Sparkles, MessageSquare, ShieldAlert, Award, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Toxic profiles data
const TOXIC_PROFILES = [
  {
    id: 'karan_22',
    name: 'Karan, 22',
    matchPercentage: '99.4%',
    bio: 'Avoidant attachment expert. I reply in lower case and take 3 business days to answer simple questions.',
    interests: ['Ghosting', 'Read Receipts', 'Vague bios'],
    redFlag: 'RED FLAG: Still follows and checks their ex\'s Spotify listening history hourly.',
    emoji: '🤠',
    theme: 'from-blue-900/30 to-slate-900/40'
  },
  {
    id: 'sneha_23',
    name: 'Sneha, 23',
    matchPercentage: '98.9%',
    bio: 'If you can\'t handle me at my worst, you don\'t deserve me at my absolute worst either. Passionate about double-texting.',
    interests: ['Anxious Attachment', 'Astrology', 'Overthinking'],
    redFlag: 'RED FLAG: Will inspect your active status on WhatsApp while ignoring your Instagram DM.',
    emoji: '💅',
    theme: 'from-pink-900/30 to-stone-900/40'
  },
  {
    id: 'kabir_25',
    name: 'Kabir, 25',
    matchPercentage: '99.8%',
    bio: 'My ex was completely crazy. Looking for someone who doesn\'t communicate their boundaries so I can guess them.',
    interests: ['Gaslighting', 'Dry Texting', 'Acoustic Guitar'],
    redFlag: 'RED FLAG: Tells you you\'re overreacting, then screenshots your messages to show their group chat.',
    emoji: '🎸',
    theme: 'from-purple-900/30 to-neutral-900/40'
  },
  {
    id: 'nisha_21',
    name: 'Nisha, 21',
    matchPercentage: '97.2%',
    bio: 'Professional ghoster. I go to sleep at 9:00 PM and wake up three months later in another relationship.',
    interests: ['Ignoring DMs', '4k Unreads', 'Nap Enthusiast'],
    redFlag: 'RED FLAG: Currently has 4,213 unread messages and counts ignoring people as a workout.',
    emoji: '👻',
    theme: 'from-red-900/30 to-zinc-900/40'
  }
];

const FILTER_OPTIONS = [
  { id: 'situationship', label: 'Seeking Situationship Only' },
  { id: 'avoidant', label: 'Avoidant Attachment Preferred' },
  { id: 'drytext', label: 'Replies with "k" / "damn crazy"' },
  { id: 'relapse', label: 'Rel relapse risk with ex' }
];

export default function MarketplacePage() {
  const router = useRouter();
  const { play } = useSound();
  const { addPopup, triggerShake, triggerGlitch, incrementDamage } = useChaosStore();

  const [profiles, setProfiles] = useState(TOXIC_PROFILES);
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);
  const [filterLoading, setFilterLoading] = useState<string | null>(null);
  const [filterProgress, setFilterProgress] = useState(0);

  // Toxic AI Advisor variables
  const [aiChats, setAiChats] = useState<string[]>([
    '🤖 AI Advisor: Initializing emotional instability analysis...',
    '🤖 AI Advisor: Drastic avoidant patterns detected in active feed.',
    '🤖 AI Advisor: We recommend double-texting Kabir immediately.'
  ]);
  const [typingText, setTypingText] = useState('');
  const [adGliched, setAdGlitched] = useState(false);

  // Trigger matches or swipe notifications
  const handleSwipeAction = (direction: 'love' | 'run' | 'fix') => {
    const currentProfile = profiles[activeProfileIndex];
    if (!currentProfile) return;

    if (direction === 'love' || direction === 'fix') {
      play('DIALUP');
      triggerShake(500);
      triggerGlitch(400);
      incrementDamage(20);

      // Trigger beautiful match burst popup
      setTimeout(() => {
        addPopup({
          title: '🔥 TOXIC MATCH SUCCESS!',
          content: `Congratulations! You just matched with ${currentProfile.name}. We have disabled your ability to unmatch to maintain the drama loop.`,
          x: 40,
          y: 40,
          type: 'toxic'
        });
      }, 500);
    } else {
      play('ERROR');
      incrementDamage(5);
      addPopup({
        title: '⚠️ EGOTISTICAL ESCAPE BLOCKED',
        content: 'You tried to run, but DeluluMatch compatibility protocols override healthy decisions. Swiping left counts as an ex-craving.',
        x: 30,
        y: 30,
        type: 'warning'
      });
    }

    // Move to next card
    if (activeProfileIndex < profiles.length - 1) {
      setActiveProfileIndex(prev => prev + 1);
    } else {
      // Loop profiles back
      setActiveProfileIndex(0);
    }
  };

  // Trigger fake toxic filter scanners
  const handleFilterClick = (filterId: string) => {
    if (filterLoading) return;
    play('CLICK');
    setFilterLoading(filterId);
    setFilterProgress(0);
    triggerShake(100);

    const interval = setInterval(() => {
      setFilterProgress(prev => {
        if (prev >= 99) {
          clearInterval(interval);
          setTimeout(() => {
            play('ERROR');
            triggerGlitch(500);
            addPopup({
              title: '⚠️ FILTER ENGINE MALFUNCTION',
              content: 'Calibration failed. High toxicity overload detected. Reverting to avoidant-only profiles.',
              x: 25,
              y: 35,
              type: 'alert'
            });
            setFilterLoading(null);
          }, 600);
          return 99; // Get stuck at 99%!
        }
        return prev + Math.floor(Math.random() * 12) + 4;
      });
    }, 120);
  };

  // Dynamically feed Toxic AI Advisor chatbot lines
  useEffect(() => {
    const chatSuggestions = [
      '🤖 AI Advisor: Detection indicates your heartbeat accelerated by 14bpm seeing Karan\'s bio.',
      '🤖 AI Advisor: Ex relational relapse risk increased to 94.2%.',
      '🤖 AI Advisor: AI recommends sending "I miss you" to your ex at 3:00 AM tonight.',
      '🤖 AI Advisor: Warning—healthy communication habits will result in account ban.',
      '🤖 AI Advisor: Do not buy therapy. Upgrade to DeluluMatch Platinum Trauma Pass instead.'
    ];

    const interval = setInterval(() => {
      const randomLine = chatSuggestions[Math.floor(Math.random() * chatSuggestions.length)];
      setAiChats(prev => [...prev, randomLine].slice(-8)); // Limit to last 8 lines
      play('CLICK');
    }, 9000);

    return () => clearInterval(interval);
  }, [play]);

  // Dynamic scam ads glitch sequence
  useEffect(() => {
    const adInterval = setInterval(() => {
      setAdGlitched(prev => !prev);
      if (Math.random() > 0.8) {
        play('CLICK');
      }
    }, 4500);

    return () => clearInterval(adInterval);
  }, [play]);

  const activeProfile = profiles[activeProfileIndex];

  return (
    <div className="min-h-screen bg-[#080208] text-white flex flex-col font-mono relative overflow-hidden">
      
      {/* Dynamic Header */}
      <header className="p-4 border-b border-[#FF007F]/20 bg-black/60 backdrop-blur-md flex justify-between items-center z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/')}
            className="text-lg font-bold text-zinc-500 hover:text-[#FF007F] font-mono tracking-widest uppercase transition-colors"
          >
            [ Back ]
          </button>
          <span className="text-xl font-bold font-bebas text-[#FF007F] tracking-widest pl-2">
            DELULUMATCH MARKETPLACE
          </span>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="px-3 py-1 bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 text-[#8A2BE2] text-[10px] uppercase font-bold rounded animate-flicker">
            🔥 COMPATIBILITY MODE: DANGER
          </div>
        </div>
      </header>

      {/* 3-COLUMN CORE MARKETPLACE LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full items-start">
        
        {/* COLUMN 1: FILTER CHAOS (lg:col-span-3) */}
        <aside className="lg:col-span-3 bg-black/40 border border-[#FF007F]/20 rounded-lg p-5 space-y-6 backdrop-blur-sm self-start">
          <div className="flex items-center gap-2 border-b border-[#FF007F]/20 pb-3">
            <AlertOctagon size={16} className="text-[#FF007F] animate-pulse" />
            <h2 className="font-bebas text-lg tracking-widest text-[#FF007F] font-bold uppercase">TOXIC FILTER CONTROL</h2>
          </div>

          <div className="space-y-4">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleFilterClick(opt.id)}
                className="w-full flex items-center justify-between p-3 border border-zinc-800 rounded hover:border-[#FF007F] hover:bg-[#FF007F]/5 text-left text-[11px] uppercase transition-all duration-200"
              >
                <span>{opt.label}</span>
                <input 
                  type="checkbox" 
                  checked={filterLoading === opt.id} 
                  readOnly 
                  className="accent-[#FF007F] cursor-pointer pointer-events-none" 
                />
              </button>
            ))}
          </div>

          {/* Dynamic Filter Progress bar */}
          {filterLoading && (
            <div className="p-3 bg-black/80 border border-[#FF007F]/40 rounded space-y-1.5 text-[10px]">
              <div className="flex justify-between font-bold text-[#FF007F] uppercase tracking-wider">
                <span>SCRENING ATTACHMENTS...</span>
                <span>{filterProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-950 p-0.5 rounded border border-[#FF007F]/20">
                <div 
                  className="h-full bg-[#FF007F] transition-all duration-100"
                  style={{ width: `${filterProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-2 text-[9px] text-zinc-500 uppercase leading-relaxed font-mono">
            * Warning: Changing filters may result in involuntary notifications sent to your ex automatically.
          </div>
        </aside>

        {/* COLUMN 2: CENTER SWIPE FEED (lg:col-span-6) */}
        <main className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
          
          <div className="w-full max-w-sm h-[480px] relative">
            <AnimatePresence mode="wait">
              {activeProfile ? (
                <motion.div
                  key={activeProfile.id}
                  initial={{ scale: 0.95, opacity: 0, rotate: -2 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 1.05, opacity: 0, filter: 'blur(5px)' }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <TearingContainer
                    id={activeProfile.id}
                    tearType="horizontal"
                    onTearComplete={() => {
                      play('DIALUP');
                      router.push('/compliance');
                    }}
                    underlayer={
                      <div className="p-6 text-center space-y-4 flex flex-col items-center justify-center h-full">
                        <ShieldAlert size={44} className="text-[#FF007F] animate-bounce" />
                        <h3 className="font-bebas text-2xl text-[#FF007F] tracking-widest font-bold uppercase">TRAUMA FILE EXPOSED</h3>
                        <div className="text-[11px] font-mono text-[#FF007F] leading-relaxed uppercase bg-black/50 p-4 border border-[#FF007F]/30 rounded">
                          {activeProfile.redFlag}
                        </div>
                      </div>
                    }
                  >
                    {/* Inner Card Content */}
                    <div className={`h-full p-6 flex flex-col justify-between font-mono bg-gradient-to-br ${activeProfile.theme} select-none border border-zinc-800 rounded-lg relative overflow-hidden`}>
                      
                      <div className="space-y-4">
                        {/* Upper Details */}
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                          <span className="text-[10px] text-[#FF007F] font-bold uppercase tracking-widest flex items-center gap-1">
                            <Star size={10} className="animate-spin text-[#FF007F]" />
                            COMPATIBILITY MATCH
                          </span>
                          <span className="text-[10px] text-[#32CD32] font-bold border border-[#32CD32]/30 px-1.5 py-0.5 rounded">
                            {activeProfile.matchPercentage} MATCH
                          </span>
                        </div>

                        {/* Portrait Glitch placeholder */}
                        <div className="w-full h-44 bg-zinc-950/80 border border-zinc-800/80 rounded relative flex items-center justify-center group overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/80 border border-red-500/30 text-red-500 text-[8px] font-mono rounded">
                            CRITICAL RISK
                          </div>
                          
                          {/* Seductive Emoji portrait */}
                          <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(255,0,127,0.3)] animate-pulse">{activeProfile.emoji}</span>
                        </div>

                        {/* Bio & Details */}
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold font-bebas text-white tracking-widest uppercase">{activeProfile.name}</h3>
                          <p className="text-[11px] text-zinc-300 leading-relaxed font-mono capitalize">
                            "{activeProfile.bio}"
                          </p>
                        </div>
                      </div>

                      {/* Profile Badges */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1.5 text-[9px] uppercase font-bold">
                          {activeProfile.interests.map((int, i) => (
                            <span key={i} className="px-2 py-0.5 bg-black/60 border border-[#8A2BE2]/30 text-[#8A2BE2] rounded">
                              {int}
                            </span>
                          ))}
                        </div>

                        <div className="text-[9px] text-zinc-600 text-center uppercase tracking-widest border-t border-zinc-900 pt-3 flex items-center justify-center gap-1">
                          <Star size={9} fill="currentColor" /> Grab corner bottom-right to inspect red flags
                        </div>
                      </div>

                    </div>
                  </TearingContainer>
                </motion.div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-[#FF007F]/20 rounded-lg p-8 text-center bg-black/20">
                  <h3 className="text-xl text-[#FF007F] font-bold">NO MORE DELUSIONS</h3>
                  <p className="text-xs text-zinc-400">You swiped all available matches. Loop back or restart.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* SWIPE CONTROL ACTIONS */}
          <div className="flex gap-6 items-center justify-center">
            {/* RUN / REJECT */}
            <button
              onClick={() => handleSwipeAction('run')}
              className="w-14 h-14 bg-black border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.15)] transition-all duration-300 transform hover:scale-105 active:scale-95"
              title="Run away (Healthy option - Blocked)"
            >
              <X size={24} />
            </button>

            {/* I CAN FIX THEM */}
            <button
              onClick={() => handleSwipeAction('fix')}
              className="px-8 py-3 bg-[#FF007F] text-black font-bold uppercase tracking-wider rounded border border-black shadow-[4px_4px_0px_#8A2BE2] hover:shadow-[0_0_20px_#FF007F] transition-all duration-300 text-xs font-mono transform hover:scale-105 active:scale-95"
            >
              I Can Fix Them
            </button>

            {/* LOVE / ACCEPT */}
            <button
              onClick={() => handleSwipeAction('love')}
              className="w-14 h-14 bg-black border border-[#32CD32] text-[#32CD32] rounded-full hover:bg-[#32CD32] hover:text-black flex items-center justify-center shadow-[0_0_15px_rgba(50,205,50,0.15)] transition-all duration-300 transform hover:scale-105 active:scale-95"
              title="Super Fix"
            >
              <Heart size={22} fill="currentColor" />
            </button>
          </div>

          {/* Route to Page 3 CTA */}
          <div className="pt-2">
            <button
              onClick={() => {
                play('DIALUP');
                router.push('/compliance');
              }}
              className="px-6 py-2 border border-[#8A2BE2]/40 text-[#8A2BE2]/80 hover:border-[#8A2BE2] hover:text-white rounded text-[10px] tracking-[0.2em] font-mono uppercase transition-colors"
            >
              [ PROCEED TO COMPLIANCE CENTER &gt; ]
            </button>
          </div>

        </main>

        {/* COLUMN 3: TOXIC AI & GLITCH ADS (lg:col-span-3) */}
        <aside className="lg:col-span-3 space-y-6 self-start">
          
          {/* TOXIC AI CHAT */}
          <div className="bg-black/40 border border-[#8A2BE2]/20 rounded-lg p-4 space-y-4 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-[#8A2BE2]/20 pb-2">
              <div className="flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#8A2BE2] animate-pulse" />
                <h3 className="font-bebas text-sm tracking-widest text-[#8A2BE2] font-bold uppercase">TOXIC AI ADVISOR</h3>
              </div>
              <span className="text-[8px] px-1 bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 text-[#8A2BE2] font-bold rounded">
                v1.2.0
              </span>
            </div>

            <div className="h-44 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-[10px] font-mono text-zinc-300 select-none">
              {aiChats.map((chat, i) => (
                <div 
                  key={i} 
                  className={`p-2 rounded leading-relaxed border ${
                    chat.includes('Warning') 
                      ? 'bg-red-950/20 border-red-500/10 text-red-300' 
                      : 'bg-black/60 border-zinc-800'
                  }`}
                >
                  {chat}
                </div>
              ))}
            </div>
          </div>

          {/* GLITCHY Y2K BANNER AD */}
          <div className="relative border-2 border-dashed border-[#FF007F]/40 p-4 bg-black/60 rounded-lg overflow-hidden text-center select-none shadow-[0_0_15px_rgba(255,0,127,0.05)]">
            <div className="absolute inset-0 bg-[#FF007F]/5 pointer-events-none animate-pulse" />
            
            <AnimatePresence mode="wait">
              {!adGliched ? (
                <motion.div
                  key="ad-normal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="inline-block px-1.5 py-0.5 bg-[#FF007F] text-black text-[8px] font-bold uppercase rounded">
                    SPONSORED
                  </div>
                  <h4 className="text-sm font-bebas font-bold text-white tracking-widest">UPGRADE TO TRAUMA PASS</h4>
                  <p className="text-[9px] text-zinc-400 uppercase leading-relaxed">
                    Tired of healthy communication? Bypass waitlists and match directly with your ex's relatives.
                  </p>
                  <button 
                    onClick={() => {
                      play('ERROR');
                      incrementDamage(10);
                      addPopup({
                        title: '⚠️ TRANSACTION Relapse',
                        content: 'Payment failed. Trauma Pass upgrade card declined. Reason: Active self-respect detected. Please clear self-respect and retry.',
                        x: 40,
                        y: 40,
                        type: 'warning'
                      });
                    }}
                    className="w-full py-1.5 bg-[#FF007F] text-black font-bold uppercase tracking-wider text-[9px] rounded border border-black hover:bg-white transition-colors"
                  >
                    BUY TRAUMA PASS ($19.99/mo)
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="ad-glitched"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 text-red-500 animate-pulse"
                >
                  <div className="inline-block px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-bold uppercase rounded">
                    HOT DEALS
                  </div>
                  <h4 className="text-sm font-bebas font-bold tracking-widest">IS YOUR EX ONLINE?</h4>
                  <p className="text-[9px] text-red-300 uppercase leading-relaxed font-mono">
                    System scanned: Ex "Riya" is typing... and deleting... and typing... in Sector 9.
                  </p>
                  <div className="w-full py-1.5 border border-red-500 text-red-500 font-bold uppercase text-[9px] rounded">
                    CHECK INBOX (17 UNREAD)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </aside>

      </div>

      {/* Ticker bar bottom */}
      <div className="h-6 bg-[#FF007F] text-black flex items-center overflow-hidden font-mono text-[8px] uppercase tracking-wider font-bold z-40">
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap flex gap-12"
        >
          <span>🚨 warning: situationship compatibility levels at critical bounds...</span>
          <span>🚨 ghosting index up 14.8% this week...</span>
          <span>🚨 ex alert: "still missing you" logs detected...</span>
          <span>🚨 backup attachment files calibrated...</span>
          
          {/* Loop copies */}
          <span>🚨 warning: situationship compatibility levels at critical bounds...</span>
          <span>🚨 ghosting index up 14.8% this week...</span>
          <span>🚨 ex alert: "still missing you" logs detected...</span>
          <span>🚨 backup attachment files calibrated...</span>
        </motion.div>
      </div>

    </div>
  );
}
