// import { useState } from 'react'
import { PointerLockControls, Sky } from '@react-three/drei';
import { Ground } from './components/Ground';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <PointerLockControls />
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={1.5} />
      <Ground />
    </>
  );
}

export default App;
