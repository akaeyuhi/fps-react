import { RigidBody } from '@react-three/rapier';

export function Player() {
  return (
    <RigidBody position={[0, 1, -2]}>
      <mesh>
        <capsuleGeometry args={[0.5, 0.5]} />
      </mesh>
    </RigidBody>
  );
}
