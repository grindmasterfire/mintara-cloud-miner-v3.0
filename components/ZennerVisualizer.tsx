import React, { useEffect, useRef } from 'react';

interface ZennerVisualizerProps {
  frequencyHash: string; // e.g. "FREQ_432"
  isActive: boolean;
}

// The 5-Point "Die" Layout
type EmitterPosition = 'TL' | 'TR' | 'C' | 'BL' | 'BR';

interface Shape {
  x: number;
  y: number;
  size: number;
  maxSize: number;
  type: EmitterPosition;
  color: string;
  rotation: number;
  growthRate: number;
}

export const ZennerVisualizer: React.FC<ZennerVisualizerProps> = ({ frequencyHash, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const requestRef = useRef<number>(0);

  // --- AUDIO ENGINE (THE MATH) ---
  useEffect(() => {
    if (isActive) {
      // 1. Parse Frequency from Hash (e.g., "FREQ_432" -> 432)
      let freq = 432; // Default
      const match = frequencyHash.match(/FREQ_(\d+)/);
      if (match) freq = parseInt(match[1]);

      // 2. Initialize Audio Context
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // 3. Create Oscillator (Pure Sine Wave)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // 4. Create Gain (Volume Control for Fade In/Out)
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 2); // 2s Fade In

      // 5. Connect
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    }

    return () => {
      // Cleanup: Fade out and stop
      if (gainNodeRef.current && audioContextRef.current) {
        const ctx = audioContextRef.current;
        gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        
        setTimeout(() => {
          oscillatorRef.current?.stop();
          audioContextRef.current?.close();
        }, 1000);
      }
    };
  }, [isActive, frequencyHash]);

  // --- VISUAL ENGINE (THE GEOMETRY) ---
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handling
    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    let shapes: Shape[] = [];
    let frameCount = 0;

    // Emitter Logic
    const spawnShape = () => {
      const w = canvas.width;
      const h = canvas.height;
      const maxSize = Math.max(w, h) * 1.5;

      const emitters: { type: EmitterPosition, x: number, y: number, color: string, rate: number }[] = [
        { type: 'TL', x: w * 0.2, y: h * 0.2, color: '#a855f7', rate: 2 }, // Purple Square
        { type: 'TR', x: w * 0.8, y: h * 0.2, color: '#eab308', rate: 2.5 }, // Gold Triangle
        { type: 'C',  x: w * 0.5, y: h * 0.5, color: '#10b981', rate: 1.5 }, // Mint Starburst
        { type: 'BL', x: w * 0.2, y: h * 0.8, color: '#3b82f6', rate: 2.2 }, // Blue Diamond
        { type: 'BR', x: w * 0.8, y: h * 0.8, color: '#ec4899', rate: 2.8 }, // Pink Oval
      ];

      // Spawn one shape from each emitter occasionally
      emitters.forEach(e => {
        // Stagger generation based on framecount for "independence"
        if (Math.random() > 0.98) {
          shapes.push({
            x: e.x,
            y: e.y,
            size: 0,
            maxSize: maxSize,
            type: e.type,
            color: e.color,
            rotation: 0,
            growthRate: e.rate + Math.random()
          });
        }
      });
    };

    // Draw Functions
    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) => {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    const drawLoop = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frameCount++;
      spawnShape();

      // Update and Draw Shapes
      for (let i = shapes.length - 1; i >= 0; i--) {
        const s = shapes[i];
        s.size += s.growthRate;
        s.rotation += 0.01;

        if (s.size > s.maxSize) {
          shapes.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = 1 - (s.size / s.maxSize); // Fade out as it grows
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2 + (s.size / 100);

        ctx.beginPath();
        
        if (s.type === 'TL') {
          // Square
          ctx.rect(s.x - s.size/2, s.y - s.size/2, s.size, s.size);
          ctx.stroke();
        } 
        else if (s.type === 'TR') {
          // Triangle
          const h = s.size * (Math.sqrt(3)/2);
          ctx.moveTo(s.x, s.y - h/2);
          ctx.lineTo(s.x - s.size/2, s.y + h/2);
          ctx.lineTo(s.x + s.size/2, s.y + h/2);
          ctx.closePath();
          ctx.stroke();
        }
        else if (s.type === 'C') {
          // Starburst / Circle Pulse
          drawStar(s.x, s.y, 8, s.size, s.size/2, s.color);
          // Also draw a concentric circle
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 1.2, 0, Math.PI * 2);
          ctx.stroke();
        }
        else if (s.type === 'BL') {
          // Diamond (Rotated Square)
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(Math.PI / 4 + s.rotation); // Spin!
          ctx.strokeRect(-s.size/2, -s.size/2, s.size, s.size);
          ctx.restore();
        }
        else if (s.type === 'BR') {
          // Oval
          ctx.ellipse(s.x, s.y, s.size, s.size * 0.6, s.rotation, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      requestRef.current = requestAnimationFrame(drawLoop);
    };

    requestRef.current = requestAnimationFrame(drawLoop);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isActive]);

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
        <p className="font-mono text-xs text-mint-500/50 tracking-[0.5em] animate-pulse">
           OSCILLATOR ACTIVE • {frequencyHash.replace('FREQ_', '')}HZ
        </p>
      </div>
    </div>
  );
};