import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import floorTexture from '../assets/textures/floor.png';

export function Ground() {
  const texture = useTexture(floorTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return (
    <RigidBody>
      <mesh position={[0, -5, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="gray" map={texture} map-repeat={[100, 100]} />
      </mesh>
    </RigidBody>
  );
}
