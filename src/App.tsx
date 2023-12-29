// import { useState } from 'react'
import { PointerLockControls, Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Ground } from './components/Ground';
import { Player } from './components/Player.tsx';
import { Cubes } from './components/Cubes.tsx';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <PointerLockControls />
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={1.5} />
      <Physics gravity={[0, -20, 0]}>
        <Ground />
        <Player />
        <Cubes />
      </Physics>
    </>
  );
}

export default App;
