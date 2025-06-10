'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  z: number; // Simulated depth: 0 (far) to 1 (near)
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  type: 'star' | 'asteroid' | 'image';
  rotation?: number; // For asteroids and images
  angularVelocity?: number; // For asteroids and images
  vertices?: { x: number; y: number }[]; // For asteroid shape
  imageUrl?: string; // For image particles
  imageElement?: HTMLImageElement; // Cached image element
  imageLoaded?: boolean; // Track if image is loaded
}

interface CosmicMeshBackgroundProps {
  className?: string;
  floatingImages?: string[]; // Array of image URLs to float in the background
}

const CosmicMeshBackground = ({ className, floatingImages = [] }: CosmicMeshBackgroundProps) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const particlesArrayRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const accentH = rootStyle.getPropertyValue('--accent-h').trim() || '250';
    const accentS = rootStyle.getPropertyValue('--accent-s').trim() || '60%';
    const accentL = rootStyle.getPropertyValue('--accent-l').trim() || '60%';
    
    const getStarColor = (opacity: number) => `hsla(${accentH}, ${accentS}, calc(${accentL} + 10%), ${opacity})`;
    const getAsteroidColor = (opacity: number) => `hsla(${accentH}, 20%, calc(${accentL} * 0.8), ${opacity})`; // More desaturated and darker
    const getLineColor = (opacity: number) => `hsla(${accentH}, ${accentS}, ${accentL}, ${opacity})`;

    const MAX_PARTICLES_DENSITY_FACTOR = 25000; // Lower number = more particles
    const ASTEROID_RATIO = 0.1; // 10% of particles will be asteroids
    const BASE_SPEED = 0.4; // Increased from 0.2
    const STAR_BASE_RADIUS = 1.5; 
    const ASTEROID_BASE_RADIUS_FACTOR = 3.5;
    const IMAGE_BASE_SIZE = 60; // Base size for the single floating image

    // Preload images
    const loadImages = () => {
      floatingImages.forEach(imageUrl => {
        if (!imagesRef.current.has(imageUrl)) {
          const img = new Image();
          img.crossOrigin = 'anonymous'; // Handle CORS if needed
          img.onload = () => {
            console.log('Image loaded successfully:', imageUrl);
            // Mark particles with this image as loaded
            particlesArrayRef.current.forEach(particle => {
              if (particle.imageUrl === imageUrl) {
                particle.imageLoaded = true;
              }
            });
          };
          img.onerror = (error) => {
            console.error(`Failed to load image: ${imageUrl}`, error);
          };
          img.src = imageUrl;
          imagesRef.current.set(imageUrl, img);
        }
      });
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const createAsteroidVertices = (radius: number): { x: number; y: number }[] => {
      const numVertices = 5 + Math.floor(Math.random() * 4); // 5 to 8 vertices
      const vertices = [];
      for (let i = 0; i < numVertices; i++) {
        const angle = (i / numVertices) * Math.PI * 2;
        const irregularity = radius * (Math.random() * 0.4 - 0.2); // -20% to +20% irregularity
        vertices.push({
          x: (radius + irregularity) * Math.cos(angle),
          y: (radius + irregularity) * Math.sin(angle),
        });
      }
      return vertices;
    };

    const initParticles = () => {
      particlesArrayRef.current = [];
      const numberOfParticles = Math.max(30, Math.floor((canvas.width * canvas.height) / MAX_PARTICLES_DENSITY_FACTOR));
      const numAsteroids = Math.floor(numberOfParticles * ASTEROID_RATIO);

      // Create single image particle if image is provided
      if (floatingImages.length > 0) {
        const imageUrl = floatingImages[0]; // Just use the first image
        console.log('Creating image particle with URL:', imageUrl);
        const z = 0.8; // Place it in the foreground
        const size = IMAGE_BASE_SIZE * 1.5; // Make it larger and more visible
        
        particlesArrayRef.current.push({
          x: canvas.width / 2, // Start in center
          y: canvas.height / 2,
          z,
          vx: (Math.random() - 0.5) * BASE_SPEED * 0.3, // Even slower movement
          vy: (Math.random() - 0.5) * BASE_SPEED * 0.3,
          radius: size / 2,
          opacity: 1.0, // Full opacity for visibility
          type: 'image',
          rotation: 0,
          angularVelocity: 0.002, // Slightly faster rotation so you can see it moving
          imageUrl,
          imageElement: imagesRef.current.get(imageUrl),
          imageLoaded: imagesRef.current.get(imageUrl)?.complete || false,
        });
      }

      // Create asteroid particles
      for (let i = 0; i < numAsteroids; i++) {
        const z = Math.random(); // 0 (far) to 1 (near)
        const perspectiveFactor = 0.2 + 0.8 * z; // Scale factor based on depth
        const radius = STAR_BASE_RADIUS * ASTEROID_BASE_RADIUS_FACTOR * perspectiveFactor;
        const vertices = createAsteroidVertices(radius);
        
        particlesArrayRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z,
          vx: (Math.random() - 0.5) * BASE_SPEED,
          vy: (Math.random() - 0.5) * BASE_SPEED,
          radius,
          opacity: 0.3 + 0.7 * z, // Closer particles are more opaque
          type: 'asteroid',
          rotation: Math.random() * Math.PI * 2,
          angularVelocity: (Math.random() - 0.5) * 0.005,
          vertices,
        });
      }

      // Create star particles (fill the rest)
      const numStars = numberOfParticles - numAsteroids - (floatingImages.length > 0 ? 1 : 0);
      for (let i = 0; i < numStars; i++) {
        const z = Math.random(); // 0 (far) to 1 (near)
        const perspectiveFactor = 0.2 + 0.8 * z; // Scale factor based on depth
        const radius = STAR_BASE_RADIUS * perspectiveFactor;
        
        particlesArrayRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z,
          vx: (Math.random() - 0.5) * BASE_SPEED,
          vy: (Math.random() - 0.5) * BASE_SPEED,
          radius,
          opacity: 0.3 + 0.7 * z, // Closer particles are more opaque
          type: 'star',
        });
      }
    };

    const drawParticles = () => {
      particlesArrayRef.current.forEach(particle => {
        if (!ctx) return;
        
        ctx.beginPath();
        if (particle.type === 'star') {
          ctx.fillStyle = getStarColor(particle.opacity * 0.7); 
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'asteroid') {
          ctx.fillStyle = getAsteroidColor(particle.opacity * 0.8); 
          if (particle.vertices && particle.vertices.length > 0) {
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation!);
            ctx.moveTo(particle.vertices[0].x, particle.vertices[0].y);
            for (let k = 1; k < particle.vertices.length; k++) {
              ctx.lineTo(particle.vertices[k].x, particle.vertices[k].y);
            }
            ctx.closePath();
            ctx.restore();
            ctx.fill();
          } else { // Fallback if vertices somehow not generated
             ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
             ctx.fill();
          }
        } else if (particle.type === 'image' && particle.imageElement) {
          // Draw floating image
          console.log('Drawing image particle, loaded:', particle.imageLoaded);
          ctx.save();
          ctx.globalAlpha = particle.opacity; // Full opacity for debugging
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation!);
          
          const size = particle.radius * 2; // Convert radius back to size
          
          if (particle.imageLoaded) {
            ctx.drawImage(
              particle.imageElement,
              -size / 2,
              -size / 2,
              size,
              size
            );
          } else {
            // Draw a placeholder rectangle if image isn't loaded yet
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.strokeRect(-size / 2, -size / 2, size, size);
          }
          ctx.restore();
        }
      });
    };

    const updateParticles = () => {
      particlesArrayRef.current.forEach(particle => {
        const speedFactor = particle.type === 'image' ? 
          0.2 + 0.5 * particle.z : // Images move slower
          0.3 + 0.7 * particle.z;   // Stars and asteroids
        
        particle.x += particle.vx * speedFactor;
        particle.y += particle.vy * speedFactor;

        if (particle.type === 'asteroid' || particle.type === 'image') {
          particle.rotation! += particle.angularVelocity!;
        }

        // Wall collision
        if (particle.x + particle.radius > canvas.width || particle.x - particle.radius < 0) {
          particle.vx *= -1;
        }
        if (particle.y + particle.radius > canvas.height || particle.y - particle.radius < 0) {
          particle.vy *= -1;
        }
      });
    };

    const drawLines = () => {
      if (!ctx) return;
      const connectDistanceBase = Math.min(canvas.width, canvas.height) / 7;
      const particles = particlesArrayRef.current;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          // Skip connections involving images (optional - you can remove this if you want lines to connect to images too)
          if (p1.type === 'image' || p2.type === 'image') continue;
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connect distance slightly larger for closer particles
          const connectDistance = connectDistanceBase * (0.5 + 0.5 * ((p1.z + p2.z) / 2));

          if (distance < connectDistance) {
            // Opacity based on distance and average depth
            const distanceOpacity = Math.max(0, (1 - distance / connectDistance));
            const depthOpacity = (p1.opacity + p2.opacity) / 2;
            const finalOpacity = distanceOpacity * depthOpacity * 0.08; 

            if (finalOpacity > 0.005) { // Threshold to avoid drawing too faint lines
              ctx.beginPath();
              ctx.strokeStyle = getLineColor(finalOpacity);
              ctx.lineWidth = 0.2; // Very thin lines
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateParticles();
      // It's generally better to draw lines first, then particles on top
      drawLines();
      drawParticles();
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // Load images first, then initialize
    if (floatingImages.length > 0) {
      loadImages();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); 
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [floatingImages]); // Re-run when images change

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

export default CosmicMeshBackground;