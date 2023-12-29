import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface Props {
  position: number[]
}

export function Cube({ position }: Props) {
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
