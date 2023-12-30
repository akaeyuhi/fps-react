import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { WeaponModel } from '../models/WeaponModel.jsx';

const recoilAmount = 0.03;
const recoilDuration = 100;
const easing = TWEEN.Easing.Quadratic.Out;
export function Weapon(props) {
  const [recoilAnimation, setRecoilAnimation] = useState(null);
  const [, setRecoilBackAnimation] = useState(null);
  const [isShooting, setIsShooting] = useState(false);
  const weaponRef = useRef<any>();

  useEffect(() => {
    document.addEventListener('mousedown', () => {
      setIsShooting(true);
    });

    document.addEventListener('mouseup', () => {
      setIsShooting(false);
    });
  }, []);

  const generateRecoilOffset = () => new THREE.Vector3(
    Math.random() * recoilAmount,
    Math.random() * recoilAmount,
    Math.random() * recoilAmount,
  );

  const generateNewPositionOfRecoil = currentPosition => {
    const recoilOffset = generateRecoilOffset();
    return currentPosition.clone().add(recoilOffset);
  };

  const initRecoilAnimation = () => {
    const currentPosition = new THREE.Vector3(0, 0, 0);
    const initialPosition = new THREE.Vector3(0, 0, 0);
    const newPosition = generateNewPositionOfRecoil(currentPosition);

    const twRecoilAnimation = new TWEEN.Tween(currentPosition)
      .to(newPosition, recoilDuration)
      .easing(easing)
      .onUpdate(() => {
        weaponRef.current.position.copy(currentPosition);
      });

    const twRecoilBackAnimation = new TWEEN.Tween(currentPosition)
      .to(initialPosition, recoilDuration)
      .easing(easing)
      .onUpdate(() => {
        weaponRef.current.position.copy(currentPosition);
      });

    twRecoilAnimation.chain(twRecoilBackAnimation);

    setRecoilAnimation(twRecoilAnimation);
    setRecoilBackAnimation(twRecoilBackAnimation);
  };

  const startShooting = () => {
    (recoilAnimation as any).start();
  };

  useEffect(() => {
    initRecoilAnimation();

    if (isShooting) {
      startShooting();
    }
  }, [isShooting]);

  useFrame(() => {
    TWEEN.update();

    if (isShooting) {
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
