// import { useState } from 'react'
import { PointerLockControls, Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Ground } from './components/Ground';
import { Player } from './components/Player.tsx';
import { Cubes } from './components/Cubes.tsx';
import { WeaponModel } from './models/WeaponModel.tsx';

const shadowOffset = 50;

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <PointerLockControls />
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={1.5} />
      <directionalLight
        castShadow
        intensity={1.5}
        shadow-mapSize={4096}
        shadow-camera-top={shadowOffset}
        shadow-camera-bottom={-shadowOffset}
        shadow-camera-left={shadowOffset}
        shadow-camera-right={-shadowOffset}
        position={[100, 100, 0]}
      />
      <Physics gravity={[0, -20, 0]}>
        <Ground />
        <Player />
        <Cubes />
      </Physics>
      <group position={[0, 3, 0]}>
        <WeaponModel />
      </group>
    </>
  );
}

export default App;
