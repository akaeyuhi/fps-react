import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import App from './App.tsx';
import 'index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div id="container">
      <div className="aim" />
      <Canvas camera={{ fov: 45 }}>
        <App />
      </Canvas>
    </div>
  </React.StrictMode>,
);
