'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { cn } from '@/lib/utils';

interface SnowParticle {
  x: number;
  y: number;
  z: number; // Simulated depth: 0 (far) to 1 (near)
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  type: 'snowflake' | 'ice_crystal' | 'frost';
  rotation?: number;
  angularVelocity?: number;
  vertices?: { x: number; y: number }[]; // For ice crystal shapes
  driftOffset?: number; // For natural drifting motion
  driftSpeed?: number;
}

interface SnowfallIceAgeMeshProps {
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy'; // Snow intensity
  windStrength?: number; // 0-1, affects horizontal drift
}

const SnowfallIceAgeMesh = ({ 
  className, 
  intensity = 'medium',
  windStrength = 0.3 
}: SnowfallIceAgeMeshProps) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const particlesArrayRef = useRef<SnowParticle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ice age color palette - cold blues and whites
    const getSnowflakeColor = (opacity: number) => `rgba(255, 255, 255, ${opacity})`;
    const getIceCrystalColor = (opacity: number) => `rgba(173, 216, 230, ${opacity * 0.8})`; // Light blue
    const getFrostColor = (opacity: number) => `rgba(240, 248, 255, ${opacity * 0.6})`; // Alice blue
    const getConnectionColor = (opacity: number) => `rgba(135, 206, 235, ${opacity * 0.15})`; // Sky blue, very faint

    // Intensity settings
    const intensitySettings = {
      light: { density: 35000, snowRatio: 0.7, iceRatio: 0.2, baseSpeed: 0.5 },
      medium: { density: 20000, snowRatio: 0.6, iceRatio: 0.25, baseSpeed: 0.8 },
      heavy: { density: 12000, snowRatio: 0.5, iceRatio: 0.3, baseSpeed: 1.2 }
    };

    const settings = intensitySettings[intensity];
    const SNOWFLAKE_RATIO = settings.snowRatio;
    const ICE_CRYSTAL_RATIO = settings.iceRatio;
    const FROST_RATIO = 1 - SNOWFLAKE_RATIO - ICE_CRYSTAL_RATIO;
    const BASE_FALL_SPEED = settings.baseSpeed;
    const SNOWFLAKE_BASE_RADIUS = 1.5;
    const ICE_CRYSTAL_BASE_RADIUS = 3;
    const FROST_BASE_RADIUS = 0.8;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const createSnowflakeVertices = (radius: number): { x: number; y: number }[] => {
      const vertices = [];
      const arms = 6; // Classic 6-pointed snowflake
      
      for (let i = 0; i < arms; i++) {
        const angle = (i / arms) * Math.PI * 2;
        const length = radius * (0.8 + Math.random() * 0.4); // Vary arm length
        
        // Main arm
        vertices.push({
          x: length * Math.cos(angle),
          y: length * Math.sin(angle)
        });
        
        // Small branches
        const branchLength = length * 0.3;
        const branchAngle1 = angle - Math.PI / 6;
        const branchAngle2 = angle + Math.PI / 6;
        
        vertices.push({
          x: branchLength * Math.cos(branchAngle1),
          y: branchLength * Math.sin(branchAngle1)
        });
        
        vertices.push({
          x: branchLength * Math.cos(branchAngle2),
          y: branchLength * Math.sin(branchAngle2)
        });
      }
      
      return vertices;
    };

    const createIceCrystalVertices = (radius: number): { x: number; y: number }[] => {
      const vertices = [];
      const sides = 4 + Math.floor(Math.random() * 4); // 4-7 sided crystals
      
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2;
        const irregularity = radius * (Math.random() * 0.3 - 0.15); // Crystalline irregularity
        const distance = radius + irregularity;
        
        vertices.push({
          x: distance * Math.cos(angle),
          y: distance * Math.sin(angle)
        });
      }
      
      return vertices;
    };

    const initParticles = () => {
      particlesArrayRef.current = [];
      const numberOfParticles = Math.max(50, Math.floor((canvas.width * canvas.height) / settings.density));
      
      const numSnowflakes = Math.floor(numberOfParticles * SNOWFLAKE_RATIO);
      const numIceCrystals = Math.floor(numberOfParticles * ICE_CRYSTAL_RATIO);
      const numFrost = numberOfParticles - numSnowflakes - numIceCrystals;

      // Create snowflakes
      for (let i = 0; i < numSnowflakes; i++) {
        const z = Math.random();
        const perspectiveFactor = 0.3 + 0.7 * z;
        const radius = SNOWFLAKE_BASE_RADIUS * perspectiveFactor;
        
        particlesArrayRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z,
          vx: (Math.random() - 0.5) * windStrength * 0.5,
          vy: BASE_FALL_SPEED * perspectiveFactor * (0.5 + Math.random() * 0.5),
          radius,
          opacity: 0.4 + 0.6 * z,
          type: 'snowflake',
          rotation: Math.random() * Math.PI * 2,
          angularVelocity: (Math.random() - 0.5) * 0.02,
          vertices: createSnowflakeVertices(radius),
          driftOffset: Math.random() * Math.PI * 2,
          driftSpeed: 0.005 + Math.random() * 0.01,
        });
      }

      // Create ice crystals
      for (let i = 0; i < numIceCrystals; i++) {
        const z = Math.random();
        const perspectiveFactor = 0.2 + 0.8 * z;
        const radius = ICE_CRYSTAL_BASE_RADIUS * perspectiveFactor;
        
        particlesArrayRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z,
          vx: (Math.random() - 0.5) * windStrength * 0.3,
          vy: BASE_FALL_SPEED * perspectiveFactor * (0.3 + Math.random() * 0.4),
          radius,
          opacity: 0.3 + 0.5 * z,
          type: 'ice_crystal',
          rotation: Math.random() * Math.PI * 2,
          angularVelocity: (Math.random() - 0.5) * 0.01,
          vertices: createIceCrystalVertices(radius),
          driftOffset: Math.random() * Math.PI * 2,
          driftSpeed: 0.003 + Math.random() * 0.007,
        });
      }

      // Create frost particles
      for (let i = 0; i < numFrost; i++) {
        const z = Math.random();
        const perspectiveFactor = 0.4 + 0.6 * z;
        const radius = FROST_BASE_RADIUS * perspectiveFactor;
        
        particlesArrayRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z,
          vx: (Math.random() - 0.5) * windStrength * 0.2,
          vy: BASE_FALL_SPEED * perspectiveFactor * (0.2 + Math.random() * 0.3),
          radius,
          opacity: 0.2 + 0.4 * z,
          type: 'frost',
          driftOffset: Math.random() * Math.PI * 2,
          driftSpeed: 0.002 + Math.random() * 0.005,
        });
      }
    };

    const drawParticles = () => {
      particlesArrayRef.current.forEach(particle => {
        if (!ctx) return;
        
        ctx.save();
        
        if (particle.type === 'snowflake') {
          ctx.strokeStyle = getSnowflakeColor(particle.opacity);
          ctx.lineWidth = 0.5;
          
          if (particle.vertices && particle.vertices.length > 0) {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation!);
            
            // Draw snowflake arms
            particle.vertices.forEach(vertex => {
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(vertex.x, vertex.y);
              ctx.stroke();
            });
          }
        } else if (particle.type === 'ice_crystal') {
          ctx.fillStyle = getIceCrystalColor(particle.opacity);
          ctx.strokeStyle = getIceCrystalColor(particle.opacity * 1.2);
          ctx.lineWidth = 0.3;
          
          if (particle.vertices && particle.vertices.length > 0) {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation!);
            
            ctx.beginPath();
            ctx.moveTo(particle.vertices[0].x, particle.vertices[0].y);
            for (let k = 1; k < particle.vertices.length; k++) {
              ctx.lineTo(particle.vertices[k].x, particle.vertices[k].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        } else if (particle.type === 'frost') {
          ctx.fillStyle = getFrostColor(particle.opacity);
          ctx.beginPath();
          ctx.arc(0, 0, particle.radius, 0, Math.PI * 2);
          ctx.fill();
          
          // Add a subtle glow effect
          ctx.shadowColor = getFrostColor(particle.opacity * 0.5);
          ctx.shadowBlur = particle.radius * 2;
          ctx.fill();
        }
        
        ctx.restore();
      });
    };

    const updateParticles = () => {
      timeRef.current += 0.016; // Roughly 60fps
      
      particlesArrayRef.current.forEach(particle => {
        // Apply drift motion for natural movement
        if (particle.driftOffset !== undefined && particle.driftSpeed !== undefined) {
          particle.driftOffset += particle.driftSpeed;
          const drift = Math.sin(particle.driftOffset) * windStrength * 0.5;
          particle.x += particle.vx + drift;
        } else {
          particle.x += particle.vx;
        }
        
        particle.y += particle.vy;

        // Rotate crystals and snowflakes
        if (particle.angularVelocity !== undefined) {
          particle.rotation! += particle.angularVelocity;
        }

        // Wrap around screen
        if (particle.y > canvas.height + particle.radius) {
          particle.y = -particle.radius;
          particle.x = Math.random() * canvas.width;
        }
        
        if (particle.x > canvas.width + particle.radius) {
          particle.x = -particle.radius;
        } else if (particle.x < -particle.radius) {
          particle.x = canvas.width + particle.radius;
        }
      });
    };

    const drawConnections = () => {
      if (!ctx) return;
      const connectDistanceBase = Math.min(canvas.width, canvas.height) / 8;
      const particles = particlesArrayRef.current;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          // Only connect similar types or ice crystals to snowflakes
          if (p1.type === 'frost' || p2.type === 'frost') continue;
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const connectDistance = connectDistanceBase * (0.4 + 0.6 * ((p1.z + p2.z) / 2));

          if (distance < connectDistance) {
            const distanceOpacity = Math.max(0, (1 - distance / connectDistance));
            const depthOpacity = (p1.opacity + p2.opacity) / 2;
            const finalOpacity = distanceOpacity * depthOpacity * 0.1;

            if (finalOpacity > 0.01) {
              ctx.beginPath();
              ctx.strokeStyle = getConnectionColor(finalOpacity);
              ctx.lineWidth = 0.15;
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      
      // Create a subtle gradient background for ice age effect
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(25, 25, 112, 0.02)'); // Dark blue at top
      gradient.addColorStop(1, 'rgba(135, 206, 235, 0.01)'); // Light blue at bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      updateParticles();
      drawConnections();
      drawParticles();
      
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [intensity, windStrength]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'fixed top-0 left-0 w-full h-full -z-10 pointer-events-none',
        className
      )}
      aria-hidden="true"
    />
  );
};

export default SnowfallIceAgeMesh;