import React, { useEffect, useRef } from 'react';

const BASES = ['A', 'G', 'C', 'U'];

// --- 3D MATH HELPERS ---
type Point3D = { x: number; y: number; z: number };

function rotateX(p: Point3D, angle: number): Point3D {
  return {
    x: p.x,
    y: p.y * Math.cos(angle) - p.z * Math.sin(angle),
    z: p.y * Math.sin(angle) + p.z * Math.cos(angle)
  };
}

function rotateY(p: Point3D, angle: number): Point3D {
  return {
    x: p.x * Math.cos(angle) + p.z * Math.sin(angle),
    y: p.y,
    z: -p.x * Math.sin(angle) + p.z * Math.cos(angle)
  };
}

function rotateZ(p: Point3D, angle: number): Point3D {
  return {
    x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
    y: p.x * Math.sin(angle) + p.y * Math.cos(angle),
    z: p.z
  };
}

function project(p: Point3D, scale: number, offsetX: number, offsetY: number): { x: number; y: number; scale: number } {
  // Simple weak perspective projection
  const perspective = 1000;
  const factor = perspective / (perspective + p.z);
  return {
    x: p.x * factor * scale + offsetX,
    y: p.y * factor * scale + offsetY,
    scale: factor * scale
  };
}

// --- CLASSES ---

class FloatingObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angleX: number;
  angleY: number;
  angleZ: number;
  vAngleX: number;
  vAngleY: number;
  vAngleZ: number;
  scale: number;
  opacity: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;
    
    this.angleX = Math.random() * Math.PI * 2;
    this.angleY = Math.random() * Math.PI * 2;
    this.angleZ = Math.random() * Math.PI * 2;
    
    this.vAngleX = (Math.random() - 0.5) * 0.005;
    this.vAngleY = (Math.random() - 0.5) * 0.005;
    this.vAngleZ = (Math.random() - 0.5) * 0.002;

    this.scale = 0.5 + Math.random() * 0.5;
    this.opacity = 0.15 + Math.random() * 0.25;
  }

  update(w: number, h: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.angleX += this.vAngleX;
    this.angleY += this.vAngleY;
    this.angleZ += this.vAngleZ;

    // Wrap around
    const padding = 200;
    if (this.x < -padding) this.x = w + padding;
    if (this.x > w + padding) this.x = -padding;
    if (this.y < -padding) this.y = h + padding;
    if (this.y > h + padding) this.y = -padding;
  }
}

class AptamerStrand extends FloatingObject {
  length: number;
  sequence: string[];
  // Pre-calculated curve shape (static in local space)
  curvePoints: Point3D[]; 

  constructor(w: number, h: number) {
    super(w, h);
    this.length = 8 + Math.floor(Math.random() * 20); // Random length 8-28
    this.sequence = [];
    this.curvePoints = [];
    
    // Generate sequence
    for(let i=0; i<this.length; i++) {
      this.sequence.push(BASES[Math.floor(Math.random() * BASES.length)]);
    }

    // Generate static wave shape in 3D (a helix or twisted wave)
    const waveFreq = 0.3 + Math.random() * 0.3;
    const spiralRadius = 10 + Math.random() * 10;
    const spacing = 15;

    for(let i=0; i<this.length; i++) {
      // Center the strand at 0,0,0
      const x = (i - this.length/2) * spacing;
      // A spiral/wave shape
      const y = Math.sin(i * waveFreq) * spiralRadius;
      const z = Math.cos(i * waveFreq) * spiralRadius; 
      this.curvePoints.push({x, y, z});
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = `rgba(108, 117, 125, ${this.opacity})`;
    ctx.fillStyle = `rgba(52, 58, 64, ${this.opacity})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const transformedPoints = this.curvePoints.map(p => {
      let pt = rotateX(p, this.angleX);
      pt = rotateY(pt, this.angleY);
      pt = rotateZ(pt, this.angleZ);
      return project(pt, this.scale, this.x, this.y);
    });

    // Draw Backbone
    ctx.beginPath();
    ctx.lineWidth = 1.5 * this.scale;
    if (transformedPoints.length > 0) {
      ctx.moveTo(transformedPoints[0].x, transformedPoints[0].y);
      for (let i = 1; i < transformedPoints.length; i++) {
        ctx.lineTo(transformedPoints[i].x, transformedPoints[i].y);
      }
    }
    ctx.stroke();

    // Draw Bases (Sticks + Letters)
    for (let i = 0; i < transformedPoints.length; i++) {
      const origin = transformedPoints[i];
      
      const pOriginal = this.curvePoints[i];
      const stickLen = 12;
      const tipOriginal = { 
          x: pOriginal.x, 
          y: pOriginal.y + (pOriginal.y > 0 ? 1 : -1) * stickLen, 
          z: pOriginal.z + (pOriginal.z > 0 ? 1 : -1) * stickLen 
      };
      
      let tipRotated = rotateX(tipOriginal, this.angleX);
      tipRotated = rotateY(tipRotated, this.angleY);
      tipRotated = rotateZ(tipRotated, this.angleZ);
      const tip = project(tipRotated, this.scale, this.x, this.y);

      // Draw stick
      ctx.beginPath();
      ctx.lineWidth = 1 * this.scale;
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();

      // Draw Text
      ctx.font = `${9 * this.scale}px "Inter", monospace`;
      ctx.fillText(this.sequence[i], tip.x, tip.y);
    }
  }
}

// "Folded Ribbon" Protein Style
class Protein extends FloatingObject {
  tracePoints: Point3D[];

  constructor(w: number, h: number) {
    super(w, h);
    this.scale = 0.5 + Math.random() * 0.4;
    this.tracePoints = [];
    
    // Generate a random walk that forms a "globule"
    // This creates a folded chain structure
    const numNodes = 7 + Math.floor(Math.random() * 6); // 7-13 points
    
    let curr = { x:0, y:0, z:0 };
    this.tracePoints.push({...curr});
    
    // Build a constrained random walk (protein folding abstract)
    for(let i=0; i<numNodes; i++) {
        // Random direction step
        const step = 25;
        curr.x += (Math.random()-0.5) * step;
        curr.y += (Math.random()-0.5) * step;
        curr.z += (Math.random()-0.5) * step;
        this.tracePoints.push({...curr});
    }
    
    // Center the protein structure around (0,0,0) so it rotates correctly
    const center = this.tracePoints.reduce((acc, p) => ({x: acc.x+p.x, y: acc.y+p.y, z: acc.z+p.z}), {x:0, y:0, z:0});
    center.x /= this.tracePoints.length;
    center.y /= this.tracePoints.length;
    center.z /= this.tracePoints.length;
    
    this.tracePoints = this.tracePoints.map(p => ({
        x: p.x - center.x,
        y: p.y - center.y,
        z: p.z - center.z
    }));
    
    // Proteins tumble slower than small molecules
    this.vAngleX *= 0.6;
    this.vAngleY *= 0.6;
    this.vAngleZ *= 0.6;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Elegant gray ribbon
    ctx.strokeStyle = `rgba(130, 140, 150, ${this.opacity * 0.9})`;
    ctx.lineWidth = 3.5 * this.scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const projected = this.tracePoints.map(p => {
        let pt = rotateX(p, this.angleX);
        pt = rotateY(pt, this.angleY);
        pt = rotateZ(pt, this.angleZ);
        return project(pt, this.scale, this.x, this.y);
    });

    if (projected.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    
    // Draw a smooth curve through the points to simulate a folded polypeptide chain
    for (let i = 0; i < projected.length - 1; i++) {
      const p0 = projected[i];
      const p1 = projected[i + 1];
      
      // Use midpoints as control points for quadratic bezier to ensure continuity
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      
      if (i === 0) {
        ctx.lineTo(midX, midY);
      } else {
        ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
      }
    }
    // Finish the curve to the last point
    const last = projected[projected.length - 1];
    const secondLast = projected[projected.length - 2];
    // Simple line to end or curve? Let's curve to the last point using the 2nd to last as control? 
    // Simplified: Just line to last for the very end segment or quadratic
    ctx.lineTo(last.x, last.y);
    
    ctx.stroke();
  }
}

class SmallMolecule extends FloatingObject {
  // Complex multi-ring structures (Steroid-like or complex metabolites)
  vertices: Point3D[];
  edges: [number, number][];

  constructor(w: number, h: number) {
    super(w, h);
    this.vertices = [];
    this.edges = [];
    this.scale = 0.6 + Math.random() * 0.4;
    
    // Procedural generation of a connected graph
    const ringRadius = 18;
    const addRing = (centerX: number, centerY: number, sides: number, startIdx: number) => {
        const indices: number[] = [];
        for(let i=0; i<sides; i++) {
            const theta = (i / sides) * Math.PI * 2;
            this.vertices.push({
                x: centerX + Math.cos(theta) * ringRadius,
                y: centerY + Math.sin(theta) * ringRadius,
                z: (Math.random()-0.5) * 5 
            });
            indices.push(startIdx + i);
        }
        for(let i=0; i<sides; i++) {
            this.edges.push([indices[i], indices[(i+1)%sides]]);
        }
        return indices;
    };

    let currentIdx = 0;
    // Ring 1 (Center)
    addRing(0, 0, 6, currentIdx);
    currentIdx += 6;

    // Add 1-2 more rings or side chains
    const attachments = 1 + Math.floor(Math.random() * 2);
    
    for(let k=0; k<attachments; k++) {
        const type = Math.random();
        if (type > 0.5) {
            // Add a fused or connected ring
            const offsetDist = ringRadius * 2.2;
            const angle = (k / attachments) * Math.PI * 2;
            const sides = Math.random() > 0.5 ? 6 : 5;
            addRing(
                Math.cos(angle) * offsetDist, 
                Math.sin(angle) * offsetDist, 
                sides, 
                currentIdx
            );
            this.edges.push([Math.floor(Math.random()*6), currentIdx]); 
            currentIdx += sides;
        } else {
            // Add a functional group stick (Tail)
            const angle = Math.random() * Math.PI * 2;
            const startNode = Math.floor(Math.random() * currentIdx);
            const tailLen = 25;
            this.vertices.push({
                x: this.vertices[startNode].x + Math.cos(angle) * tailLen,
                y: this.vertices[startNode].y + Math.sin(angle) * tailLen,
                z: this.vertices[startNode].z + (Math.random()-0.5)*20
            });
            this.edges.push([startNode, currentIdx]);
            currentIdx++;
        }
    }

    this.vAngleX *= 1.5;
    this.vAngleY *= 1.5;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = `rgba(108, 117, 125, ${this.opacity})`;
    ctx.lineWidth = 1.2 * this.scale;

    const projected = this.vertices.map(p => {
        let pt = rotateX(p, this.angleX);
        pt = rotateY(pt, this.angleY);
        pt = rotateZ(pt, this.angleZ);
        return project(pt, this.scale, this.x, this.y);
    });

    ctx.beginPath();
    this.edges.forEach(([i, j]) => {
        if(projected[i] && projected[j]) {
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
        }
    });
    ctx.stroke();
    
    // Draw atoms at vertices
    ctx.fillStyle = `rgba(108, 117, 125, ${this.opacity})`;
    projected.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8 * this.scale, 0, Math.PI * 2);
        ctx.fill();
    });
  }
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;

    // --- INITIALIZATION ---
    const objects: FloatingObject[] = [];
    
    // High Density Calculation
    const aptamerCount = Math.min(Math.floor((width * height) / 60000), 12); 
    for (let i = 0; i < aptamerCount; i++) objects.push(new AptamerStrand(width, height));

    const proteinCount = Math.min(Math.floor((width * height) / 90000), 8);
    for (let i = 0; i < proteinCount; i++) objects.push(new Protein(width, height));

    const molCount = Math.min(Math.floor((width * height) / 45000), 18);
    for (let i = 0; i < molCount; i++) objects.push(new SmallMolecule(width, height));

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      objects.forEach(obj => {
        obj.update(width, height);
        // @ts-ignore
        obj.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
};