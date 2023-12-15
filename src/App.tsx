// import { useState } from 'react'
import 'src/App.css';
import { Sky } from '@react-three/drei';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Sky sunPosition={[100, 20, 100]} />
  );
}

export default App;
