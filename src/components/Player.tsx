import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { RigidBody, useRapier } from '@react-three/rapier';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePersonControls } from '../utils/hooks/usePersonControls.ts';

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player() {
  const playerRef = useRef<any>();
  const rapier = useRapier();
  const {
    forward, backward, left, right, jump,
  } = usePersonControls();

  const doJump = () => {
    playerRef.current.setLinvel({ x: 0, y: 8, z: 0 });
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
      0,
      true,
    );
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.5;

    if (jump && grounded) doJump();

    // moving camera
    const { x, y, z } = playerRef.current.translation();
    state.camera.position.set(x, y, z);
  });

  return (
    <RigidBody position={[0, 1, -2]} ref={playerRef}>
      <mesh>
        <capsuleGeometry args={[0.5, 0.5]} />
      </mesh>
    </RigidBody>
  );
}
