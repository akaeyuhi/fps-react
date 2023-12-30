import { create } from 'zustand';

export interface LockControlsStore {
  isLock: boolean
}

export const usePointerLockControlsStore = create<LockControlsStore>(() => ({
  isLock: false,
}));
