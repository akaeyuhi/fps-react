import { create } from 'zustand';

export interface AimingStore {
  isAiming: null | boolean,
  setIsAiming: (value: boolean | null) => void,
}

export const useAimingStore = create<AimingStore>(set => ({
  isAiming: null,
  setIsAiming: (value: boolean | null) => set(() => ({ isAiming: value })),
}));
