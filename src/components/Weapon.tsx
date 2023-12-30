import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { WeaponModel } from '../models/WeaponModel.jsx';
import { usePointerLockControlsStore } from '../store/LockContolsStore';
import { useAimingStore } from '../store/AimingStore';

const SHOOT_BUTTON = parseInt(import.meta.env.VITE_SHOOT_BUTTON, 10);
const AIM_BUTTON = parseInt(import.meta.env.VITE_AIM_BUTTON, 10);
const recoilAmount = 0.03;
const recoilDuration = 50;
const easing = TWEEN.Easing.Quadratic.Out;

export function Weapon(props) {
  const [recoilAnimation, setRecoilAnimation] = useState(null);
  const [isRecoilAnimationFinished, setIsRecoilAnimationFinished] = useState(true);
  const [isShooting, setIsShooting] = useState(false);
  const setIsAiming = useAimingStore(state => state.setIsAiming);
  const weaponRef = useRef<any>();

  const mouseButtonHandler = (button: number, state: boolean) => {
    if (!usePointerLockControlsStore.getState().isLock) return;

    switch (button) {
    case SHOOT_BUTTON:
      setIsShooting(state);
      break;
    case AIM_BUTTON:
      setIsAiming(state);
      break;
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', ev => {
      ev.preventDefault();
      mouseButtonHandler(ev.button, true);
    });
    document.addEventListener('mouseup', ev => {
      ev.preventDefault();
      mouseButtonHandler(ev.button, false);
    });
  }, []);

  const generateRecoilOffset = () => new THREE.Vector3(
    Math.random() * recoilAmount,
    Math.random() * recoilAmount,
    Math.random() * recoilAmount,
  );

  const generateNewPositionOfRecoil = (currentPosition = new THREE.Vector3(0, 0, 0)) => {
    const recoilOffset = generateRecoilOffset();
    return currentPosition.clone().add(recoilOffset);
  };

  const initRecoilAnimation = () => {
    const currentPosition = new THREE.Vector3(0, 0, 0);
    const newPosition = generateNewPositionOfRecoil(currentPosition);

    const twRecoilAnimation = new TWEEN.Tween(currentPosition)
      .to(newPosition, recoilDuration)
      .easing(easing)
      .repeat(1)
      .yoyo(true)
      .onUpdate(() => {
        weaponRef.current.position.copy(currentPosition);
      })
      .onStart(() => {
        setIsRecoilAnimationFinished(false);
      })
      .onComplete(() => {
        setIsRecoilAnimationFinished(true);
      });

    setRecoilAnimation(twRecoilAnimation);
  };

  const startShooting = () => {
    (recoilAnimation as any).start();
  };

  useEffect(() => {
    initRecoilAnimation();
  }, []);

  useFrame(() => {
    TWEEN.update();

    if (isShooting && isRecoilAnimationFinished) {
      startShooting();
    }
  });
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <group {...props}>
      <group ref={weaponRef}>
        <WeaponModel />
      </group>
    </group>
  );
}
