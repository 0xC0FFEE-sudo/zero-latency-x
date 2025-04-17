import React, { useEffect, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Draw placeholder on 2D context
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = '30px sans-serif';
      ctx.fillText('ZL‑X UI Loaded', 50, 100);
    }
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default App;
