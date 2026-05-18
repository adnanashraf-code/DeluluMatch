'use client';

import { create } from 'zustand';

interface AudioState {
  globalVolume: number;
  isMuted: boolean;
  activeAmbience: string | null;
  setGlobalVolume: (vol: number) => void;
  toggleMute: () => void;
  setActiveAmbience: (name: string | null) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  globalVolume: 0.5,
  isMuted: false,
  activeAmbience: null,
  setGlobalVolume: (vol) => set({ globalVolume: vol }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setActiveAmbience: (name) => set({ activeAmbience: name })
}));
