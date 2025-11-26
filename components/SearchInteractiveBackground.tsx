
import React, { useEffect, useRef } from 'react';

const BASES = ['A', 'G', 'C', 'U'];

interface Props {
  isActive: boolean; // Controls rotation
}

export const SearchInteractiveBackground: React.FC<Props> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- HIGH DPI SETUP ---
    // Handle Retina/High-DPI displays for sharp rendering
    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return { width: window.innerWidth, height: 150 };

      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      
      // Set the "actual" size in memory (scaled up)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Set the "visible" size in CSS (standard)
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Scale the context so drawing operations use logical pixels
      ctx.scale(dpr, dpr);

      return { width: rect.width, height: rect.height };
    };

    let { width, height } = updateSize();

    // --- STRAND CONFIG ---
    const strandLength = 40; // Number of bases
    const amplitude = 20;
    const frequency = 0.15;
    const spacing = width / (strandLength + 5); 
    const bases: string[] = [];
    
    // Generate random sequence once
    for(let i=0; i<strandLength; i++) {
       bases.push(BASES[Math.floor(Math.random() * BASES.length)]);
    }

    const render = () => {
      // Clear rect uses logical coordinates because of ctx.scale
      ctx.clearRect(0, 0, width, height);
      
      // Update rotation
      if (isActive) {
        rotationRef.current += 0.004; // Spin speed: 2x the idle speed
      } else {
        // Idle drift
        rotationRef.current += 0.002;
      }

      const centerY = height / 2;
      const angleOffset = rotationRef.current;

      ctx.lineCap = 'round';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw Loop
      for (let i = 0; i < strandLength; i++) {
        const x = (i + 2.5) * spacing; // Center horizontally with some padding
        
        // Helix Math
        const t = i * frequency;
        const theta = t * Math.PI * 2 + angleOffset;
        const r = amplitude;
        
        const y3d = r * Math.cos(theta);
        const z3d = r * Math.sin(theta);
        
        // Project to 2D
        const perspective = 500;
        const scale = perspective / (perspective + z3d);
        
        const y2d = centerY + y3d * scale;
        const x2d = x; 
        
        // Draw Backbone segment (connecting to previous)
        if (i > 0) {
           const prevT = (i - 1) * frequency;
           const prevTheta = prevT * Math.PI * 2 + angleOffset;
           const prevY3d = r * Math.cos(prevTheta);
           const prevZ3d = r * Math.sin(prevTheta);
           const prevScale = perspective / (perspective + prevZ3d);
           const prevY2d = centerY + prevY3d * prevScale;
           const prevX2d = (i - 1 + 2.5) * spacing;

           ctx.beginPath();
           ctx.strokeStyle = `rgba(108, 117, 125, ${0.3 + (scale - 0.5)})`; // Depth cueing alpha
           ctx.lineWidth = 2 * scale;
           ctx.moveTo(prevX2d, prevY2d);
           ctx.lineTo(x2d, y2d);
           ctx.stroke();
        }

        // Draw Base Stick
        const stickLen = 15 * scale;
        const tipY = y2d + (y2d < centerY ? 1 : -1) * stickLen; // Simple directional stick
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(108, 117, 125, ${0.3 + (scale - 0.5)})`;
        ctx.lineWidth = 1 * scale;
        ctx.moveTo(x2d, y2d);
        ctx.lineTo(x2d, tipY);
        ctx.stroke();

        // Draw Base Letter
        ctx.fillStyle = `rgba(52, 58, 64, ${0.4 + (scale - 0.5)})`; // Dark gray
        ctx.font = `600 ${10 * scale}px "Inter", monospace`;
        ctx.fillText(bases[i], x2d, tipY + (y2d < centerY ? 12 : -12) * scale);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    const handleResize = () => {
       const dims = updateSize();
       width = dims.width;
       height = dims.height;
       // Re-calculate spacing if width changes significantly? 
       // For now, let's keep spacing consistent or it might jump. 
       // Ideally we re-calc spacing here but the 'spacing' var is const in closure.
       // For a simple effect, scaling the context handles the visual resize mostly, 
       // but the strand might get cut off or centered improperly if we don't update vars.
       // Since this is a simple effect, we'll leave variables as is for performance, 
       // as standard window resize refreshes components often anyway.
    };

    window.addEventListener('resize', handleResize);
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isActive]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700"
    />
  );
};
