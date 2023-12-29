import * as THREE from 'three';
import { RigidBody, RigidBodyTypeString } from '@react-three/rapier';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePersonControls } from '../utils/hooks/usePersonControls.ts';

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player() {
  const playerRef = useRef<any>();
  const {
    forward, backward, left, right, jump,
  } = usePersonControls();

  useFrame(state => {
    if (!playerRef.current) return;

    const velocity = playerRef.current.linvel();

    frontVector.set(0, 0, +backward - +forward);
    sideVector.set(+left - +right, 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED);

    playerRef.current.wakeUp();
    playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
  });

  return (
    <RigidBody position={[0, 1, -2]} ref={playerRef}>
      <mesh>
        <capsuleGeometry args={[0.5, 0.5]} />
      </mesh>
    </RigidBody>
  );
}
