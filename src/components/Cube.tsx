import { RigidBody } from "@react-three/rapier";
import { FC } from 'react';
import * as THREE from 'three';

interface Props {
  position: number[]
}

export const Cube: FC<Props> = ({ position }) => {
  const vector = new THREE.Vector3(...position);
  return (
    <RigidBody position={vector}>
      <mesh castShadow receiveShadow>
        <meshStandardMaterial color="white" />
        <boxGeometry />
      </mesh>
    </RigidBody>
  );
}
