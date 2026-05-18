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
  addPopup: (popup: Omit<DeluluPopup, 'id'>) => void;
  removePopup: (id: string) => void;
  triggerShake: (duration?: number) => void;
  triggerGlitch: (duration?: number) => void;
  incrementDamage: (amount: number) => void;
  clearPopups: () => void;
  randomizeOnlineUsers: () => void;
}

export const useChaosStore = create<ChaosState>((set, get) => ({
  emotionalDamage: 0,
  popups: [],
  isShaking: false,
  isGlitching: false,
  onlineUsers: 1247293,
  heartbreakIndex: 98,

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

    // Chaos mechanic: sometimes closing one spawns two more!
    if (Math.random() > 0.75) {
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
  }
}));
