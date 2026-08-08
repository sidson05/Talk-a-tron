import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording, color = '#6366f1' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      const numBars = 32;
      const barWidth = (width / numBars) * 0.6;
      const gap = (width / numBars) * 0.4;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;

        if (isRecording) {
          // Dynamic animated wave frequency
          const sinValue = Math.sin(phase + i * 0.2) * Math.cos(phase * 0.7 + i * 0.1);
          barHeight = Math.max(6, Math.abs(sinValue) * (height * 0.8));
        } else {
          // Subtle idle ambient breathing height
          barHeight = 4 + Math.sin(phase * 0.5 + i * 0.3) * 3;
        }

        const x = i * (barWidth + gap) + gap / 2;
        const y = centerY - barHeight / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#06b6d4');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();
      }

      phase += isRecording ? 0.15 : 0.04;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRecording, color]);

  return (
    <div className="w-full flex items-center justify-center py-2">
      <canvas
        ref={canvasRef}
        width={360}
        height={50}
        className="w-full max-w-sm rounded-xl"
      />
    </div>
  );
};
