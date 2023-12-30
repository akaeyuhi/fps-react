import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import * as TWEEN from '@tweenjs/tween.js';
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import { useFrame, Vector3 } from '@react-three/fiber';
import { useAimingStore, Weapon } from './Weapon.tsx';
import { usePersonControls } from '../utils/hooks/usePersonControls.ts';

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();
const easing = TWEEN.Easing.Quadratic.Out;

export function Player() {
  const playerRef = useRef<any>();
  const objectInHandRef = useRef<any>();

  const swayingObjectRef = useRef<any>();
  const [swayingAnimation, setSwayingAnimation] = useState(null);
  const [, setSwayingBackAnimation] = useState(null);
  const [isSwayingAnimationFinished, setIsSwayingAnimationFinished] = useState(true);
  const [swayingNewPosition, setSwayingNewPosition] = useState(new THREE.Vector3(-0.005, 0.005, 0));
  const [swayingDuration, setSwayingDuration] = useState(1000);
  const [isMoving, setIsMoving] = useState(false);
  const isAiming = useAimingStore(state => state.isAiming);

  const rapier = useRapier();
  const {
    forward, backward, left, right, jump,
  } = usePersonControls();

  const doJump = () => {
    playerRef.current.setLinvel({ x: 0, y: 8, z: 0 });
  };

  const [aimingAnimation, setAimingAnimation] = useState(null);
  const [aimingBackAnimation, setAimingBackAnimation] = useState(null);

  const initAimingAnimation = () => {
    const currentPosition = swayingObjectRef.current.position;
    const finalPosition = new THREE.Vector3(-0.352, 0.06, 0);

    const twAimingAnimation = new TWEEN.Tween(currentPosition)
      .to(finalPosition, 200)
      .easing(easing);

    const twAimingBackAnimation = new TWEEN.Tween(finalPosition.clone())
      .to(new THREE.Vector3(0, 0, 0), 200)
      .easing(easing)
      .onUpdate((position: Vector3) => {
        swayingObjectRef.current.position.copy(position);
      });

    setAimingAnimation(twAimingAnimation);
    setAimingBackAnimation(twAimingBackAnimation);
  };

  const setAnimationParams = () => {
    if (!swayingAnimation) return;

    (swayingAnimation as any).stop();
    setIsSwayingAnimationFinished(true);

    if (isMoving) {
      setSwayingDuration(() => 300);
      setSwayingNewPosition(() => new THREE.Vector3(-0.05, 0, 0));
    } else {
      setSwayingDuration(() => 1000);
      setSwayingNewPosition(() => new THREE.Vector3(-0.01, 0, 0));
    }
  };

  useEffect(() => {
    initAimingAnimation();
  }, [swayingObjectRef]);

  useEffect(() => {
    if (isAiming) {
      (swayingAnimation as any).stop();
      (aimingAnimation as any).start();
    } else if (isAiming === false) {
      (aimingBackAnimation as any).start()
        .onComplete(() => {
          setAnimationParams();
        });
    }
  }, [isAiming, aimingAnimation, aimingBackAnimation]);

  const initSwayingObjectAnimation = () => {
    const currentPosition = new THREE.Vector3(0, 0, 0);
    const initialPosition = new THREE.Vector3(0, 0, 0);
    const newPosition = swayingNewPosition;
    const animationDuration = swayingDuration;
    const easing = TWEEN.Easing.Quadratic.Out;

    const twSwayingAnimation = new TWEEN.Tween(currentPosition)
      .to(newPosition, animationDuration)
      .easing(easing)
      .onUpdate(() => {
        swayingObjectRef.current.position.copy(currentPosition);
      });

    const twSwayingBackAnimation = new TWEEN.Tween(currentPosition)
      .to(initialPosition, animationDuration)
      .easing(easing)
      .onUpdate(() => {
        swayingObjectRef.current.position.copy(currentPosition);
      })
      .onComplete(() => {
        setIsSwayingAnimationFinished(true);
      });

    twSwayingAnimation.chain(twSwayingBackAnimation);

    setSwayingAnimation(twSwayingAnimation);
    setSwayingBackAnimation(twSwayingBackAnimation);
  };

  useFrame(state => {
    if (!playerRef.current) return;

    const velocity = playerRef.current.linvel();

    frontVector.set(0, 0, +backward - +forward);
    sideVector.set(+left - +right, 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED)
      .applyEuler(state.camera.rotation);

    playerRef.current.wakeUp();
    playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
    const { world } = rapier;
    const ray = world.castRay(
      new RAPIER.Ray(playerRef.current.translation(), { x: 0, y: -1, z: 0 }),
      2,
      false,
    );
    const grounded = ray && ray.collider && Math.abs(ray.toi) < 1.25;

    if (jump && grounded) doJump();

    const { x, y, z } = playerRef.current.translation();
    state.camera.position.set(x, y, z);

    objectInHandRef.current.rotation.copy(state.camera.rotation);
    objectInHandRef.current.position.copy(state.camera.position)
      .add(state.camera.getWorldDirection(rotation));

    setIsMoving(direction.length() > 0);

    if (swayingAnimation && isSwayingAnimationFinished) {
      setIsSwayingAnimationFinished(false);
      (swayingAnimation as any).start();
    }
    TWEEN.update();
  });

  useEffect(() => {
    setAnimationParams();
  }, [isMoving]);

  useEffect(() => {
    initSwayingObjectAnimation();
  }, [swayingNewPosition, swayingDuration]);

  return (
    <>
      <RigidBody colliders={false} mass={1} ref={playerRef} lockRotations>
        <mesh castShadow>
          <capsuleGeometry args={[0.5, 0.5]} />
          <CapsuleCollider args={[0.75, 0.5]} />
        </mesh>
      </RigidBody>
      <group ref={objectInHandRef}>
        <group ref={swayingObjectRef}>
          <Weapon position={[0.2, -0.2, 0.3]} scale={0.12} />
        </group>
      </group>
    </>
  );
}
