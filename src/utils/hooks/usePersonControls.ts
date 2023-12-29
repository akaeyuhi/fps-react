import { useEffect, useState } from 'react';
import { keys } from '../keys.ts';

interface Movement {
  forward: boolean,
  backward: boolean,
  left: boolean,
  right: boolean,
  jump: boolean,
}

export const usePersonControls = () => {
  const moveFieldByKey = (key: string) => keys[key as keyof typeof keys];

  const [movement, setMovement] = useState<Movement>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const setMovementStatus = (code: string, status: boolean) => {
    setMovement(m => ({ ...m, [code]: status }));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setMovementStatus(moveFieldByKey(event.code), true);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setMovementStatus(moveFieldByKey(event.code), false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
};
