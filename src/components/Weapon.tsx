import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { useEffect, useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { WeaponModel } from '../models/WeaponModel.jsx';
import { usePointerLockControlsStore } from '../store/LockContolsStore';
import { useAimingStore } from '../store/AimingStore';
import FlashShoot from '../assets/images/shoot.png';
import ShootSound from '../assets/sounds/shoot_sound.wav';

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
  const texture = useLoader(THREE.TextureLoader, FlashShoot);
  const audio = new Audio(ShootSound);

  const [flashAnimation, setFlashAnimation] = useState(null);

  const mouseButtonHandler = (button: number, state: boolean) => {
    if (!usePointerLockControlsStore.getState().isLock) return;

    switch (button) {
      case SHOOT_BUTTON:
        setIsShooting(state);
        break;
      case AIM_BUTTON:
        setIsAiming(state);
        break;
      default:
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

  const [flashOpacity, setFlashOpacity] = useState(0);

  const initFlashAnimation = () => {
    const currentFlashParams = { opacity: 0 };

    const twFlashAnimation = new TWEEN.Tween(currentFlashParams)
      .to({ opacity: 1 }, recoilDuration)
      .easing(easing)
      .onUpdate(() => {
        setFlashOpacity(() => currentFlashParams.opacity);
      })
      .onComplete(() => {
        setFlashOpacity(() => 0);
      });

    setFlashAnimation(twFlashAnimation);
  };

  useEffect(() => {
    initFlashAnimation();
  }, []);

  const startShooting = () => {
    if (!recoilAnimation) return;

    audio.play();

    (recoilAnimation as any).start();
    (flashAnimation as any).start();
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
        <mesh position={[1.2, 0.6, -3]} scale={[1, 1, 0]}>
          <planeGeometry attach="geometry" args={[1, 1]} />
          <meshBasicMaterial
            attach="material"
            map={texture}
            transparent
            opacity={flashOpacity}
          />
        </mesh>
        <WeaponModel />
      </group>
    </group>
  );
}
