import { create } from 'zustand';

export interface DeluluPopup {
  id: string;
  title: string;
  content: string;
  x: number;
  y: number;
  type: 'toxic' | 'warning' | 'alert' | 'therapy';
}

interface ChaosState {
  emotionalDamage: number;
  popups: DeluluPopup[];
  isShaking: boolean;
  isGlitching: boolean;
  onlineUsers: number;
  heartbreakIndex: number;
  tsunamiState: 'idle' | 'warning' | 'arrival' | 'collapse' | 'underwater' | 'void' | 'reconstruction';
  isTearing: boolean;
  isBossFighting: boolean;
  cartItemsCount: number;
  isGoblinActive: boolean;
  cursorScale: number;
  addToCart: () => void;
  removeFromCart: () => void;
  setIsGoblinActive: (val: boolean) => void;
  incrementCursorScale: () => void;
  resetCursorScale: () => void;
  addPopup: (popup: Omit<DeluluPopup, 'id'>) => void;
  removePopup: (id: string) => void;
  triggerShake: (duration?: number) => void;
  triggerGlitch: (duration?: number) => void;
  incrementDamage: (amount: number) => void;
  clearPopups: () => void;
  randomizeOnlineUsers: () => void;
  setTsunamiState: (state: 'idle' | 'warning' | 'arrival' | 'collapse' | 'underwater' | 'void' | 'reconstruction') => void;
  setIsTearing: (val: boolean) => void;
  setIsBossFighting: (val: boolean) => void;
  isFpsLow: boolean;
  setIsFpsLow: (val: boolean) => void;
}

export const useChaosStore = create<ChaosState>((set, get) => ({
  emotionalDamage: 0,
  popups: [],
  isShaking: false,
  isGlitching: false,
  onlineUsers: 1247293,
  heartbreakIndex: 98,
  tsunamiState: 'idle',
  isTearing: false,
  isBossFighting: false,
  cartItemsCount: 0,
  isGoblinActive: false,
  cursorScale: 1,
  isFpsLow: false,

  addToCart: () => set((state) => ({ cartItemsCount: state.cartItemsCount + 1 })),
  removeFromCart: () => set((state) => ({ cartItemsCount: Math.max(0, state.cartItemsCount - 1) })),
  setIsGoblinActive: (val) => set({ isGoblinActive: val }),
  
  incrementCursorScale: () => {
    set((state) => {
      const nextScale = state.cursorScale + 0.03;
      
      // If scale reaches critical stability levels, trigger popups!
      if (nextScale >= 2.2 && state.cursorScale < 2.2) {
        setTimeout(() => {
          get().addPopup({
            title: '⚠️ CURSOR INSTABILITY LIMIT',
            content: 'Emotional cursor corruption critical. High attachment weight detected. Cursor control degraded.',
            x: 20,
            y: 35,
            type: 'toxic'
          });
          get().addPopup({
            title: '🎁 PREMIUM CURSOR AD',
            content: 'Tired of emotional cursor scale drifts? Purchase DeluluMatch Premium Cursor Pack for only $49.99/mo to restore standard cursor precision!',
            x: 55,
            y: 45,
            type: 'therapy'
          });
        }, 100);
      }
      return { cursorScale: nextScale };
    });
  },
  resetCursorScale: () => set({ cursorScale: 1 }),

  addPopup: (popup) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      popups: [...state.popups, { ...popup, id }]
    }));
  },

  removePopup: (id) => {
    set((state) => ({
      popups: state.popups.filter((p) => p.id !== id)
    }));

    // Chaos mechanic: sometimes closing one spawns two more! (suppressed on mobile/touch screens)
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    if (!isMobile && Math.random() > 0.75) {
      setTimeout(() => {
        get().addPopup({
          title: '⚠️ EX ATTACHED',
          content: 'They just viewed your profile 17 seconds ago. Do not check your notifications.',
          x: Math.random() * 60 + 20,
          y: Math.random() * 60 + 20,
          type: 'toxic',
        });
        get().addPopup({
          title: '⚠️ SYSTEM FAILURE',
          content: 'Unresolved relationship situationship detected in active memory cache.',
          x: Math.random() * 60 + 20,
          y: Math.random() * 60 + 20,
          type: 'warning',
        });
      }, 400);
    }
  },

  triggerShake: (duration = 500) => {
    set({ isShaking: true });
    setTimeout(() => set({ isShaking: false }), duration);
  },

  triggerGlitch: (duration = 400) => {
    set({ isGlitching: true });
    setTimeout(() => set({ isGlitching: false }), duration);
  },

  incrementDamage: (amount) => {
    set((state) => {
      const nextDamage = Math.min(100, state.emotionalDamage + amount);
      const nextHeartbreak = Math.min(100, Math.max(90, state.heartbreakIndex + Math.floor(amount / 2)));
      return {
        emotionalDamage: nextDamage,
        heartbreakIndex: nextHeartbreak
      };
    });
  },

  clearPopups: () => set({ popups: [] }),

  randomizeOnlineUsers: () => {
    set((state) => ({
      onlineUsers: state.onlineUsers + Math.floor((Math.random() - 0.5) * 100)
    }));
  },

  setTsunamiState: (state) => set({ tsunamiState: state }),
  setIsTearing: (val) => set({ isTearing: val }),
  setIsBossFighting: (val) => set({ isBossFighting: val }),
  setIsFpsLow: (val) => set({ isFpsLow: val })
}));
