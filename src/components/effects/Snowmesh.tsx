
"use client";

import React, { useRef, useEffect, useCallback } from 'react';

interface SnowflakeParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  opacity: number;
  shape: string;
  settled: boolean;
}

interface SnowflakeBackgroundProps {
  density?: number;
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  colors?: string[];
  shapes?: string[];
  className?: string;
  maxPileHeight?: number;
}

export function SnowflakeBackground({ 
  density = 100,
  minSize = 2,
  maxSize = 6,
  minSpeed = 0.5,
  maxSpeed = 2,
  colors = ['#FFFFFF', '#E6F3FF', '#CCE7FF'],
  shapes = ['circle', 'star'],
  className = "",
  maxPileHeight = 100
}: SnowflakeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<SnowflakeParticle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const snowPileRef = useRef<number[]>([]);

  const drawSnowflake = useCallback((ctx: CanvasRenderingContext2D, flake: SnowflakeParticle) => {
    ctx.globalAlpha = flake.opacity;

    switch (flake.shape) {
      case 'star':
        ctx.beginPath();
        // Draw a 6-pointed asterisk-like star
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI) / 3; // 0, 60, 120 degrees
          const x1 = flake.x - flake.size * Math.cos(angle);
          const y1 = flake.y - flake.size * Math.sin(angle);
          const x2 = flake.x + flake.size * Math.cos(angle);
          const y2 = flake.y + flake.size * Math.sin(angle);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.strokeStyle = flake.color;
        ctx.lineWidth = Math.max(1, flake.size / 3);
        ctx.stroke();
        break;
      case 'circle':
      default:
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fillStyle = flake.color;
        ctx.fill();
        break;
    }

    ctx.globalAlpha = 1;
  }, []);

  const drawSnowPile = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    if (snowPileRef.current.length === 0) return;

    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);
    
    for (let i = 0; i < snowPileRef.current.length; i++) {
      const x = i * 2; // Each pile point represents 2 pixels width
      const y = canvasHeight - snowPileRef.current[i];
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.closePath();
    
    // Create gradient for snow pile
    const gradient = ctx.createLinearGradient(0, canvasHeight - maxPileHeight, 0, canvasHeight);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add subtle border
    ctx.strokeStyle = 'rgba(200, 200, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [maxPileHeight]);
  
  const createSnowflake = useCallback((canvasWidth: number, canvasHeight: number): SnowflakeParticle => {
    const currentShape = shapes[Math.floor(Math.random() * shapes.length)];

    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight - canvasHeight,
      size: minSize + Math.random() * (maxSize - minSize),
      speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.3 + Math.random() * 0.4,
      shape: currentShape,
      settled: false,
    };
  }, [minSize, maxSize, minSpeed, maxSpeed, colors, shapes]);

  const initializeSnowPile = useCallback((canvasWidth: number) => {
    const pileWidth = Math.ceil(canvasWidth / 2);
    snowPileRef.current = new Array(pileWidth).fill(0);
  }, []);

  const addToSnowPile = useCallback((x: number, size: number, canvasWidth: number) => {
    const pileIndex = Math.floor(x / 2);
    if (pileIndex >= 0 && pileIndex < snowPileRef.current.length) {
      const increment = size * 0.9; // Smaller increment for more gradual accumulation
      snowPileRef.current[pileIndex] = Math.min(snowPileRef.current[pileIndex] + increment, maxPileHeight);
      
      // Spread effect - affect neighboring points
      if (pileIndex > 0) {
        snowPileRef.current[pileIndex - 1] = Math.min(
          snowPileRef.current[pileIndex - 1] + increment * 0.3, 
          maxPileHeight
        );
      }
      if (pileIndex < snowPileRef.current.length - 1) {
        snowPileRef.current[pileIndex + 1] = Math.min(
          snowPileRef.current[pileIndex + 1] + increment * 0.9, 
          maxPileHeight
        );
      }
    }
  }, [maxPileHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    if (rect.width === 0 || rect.height === 0) {
        return;
    }
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const currentCanvasWidth = canvas.width / dpr;
    const currentCanvasHeight = canvas.height / dpr;

    // Initialize snow pile and snowflakes
    initializeSnowPile(currentCanvasWidth);
    const newSnowflakes: SnowflakeParticle[] = [];
    for (let i = 0; i < density; i++) {
        newSnowflakes.push(createSnowflake(currentCanvasWidth, currentCanvasHeight));
    }
    snowflakesRef.current = newSnowflakes;
    
    const animate = () => {
      const currentRect = canvas.getBoundingClientRect();
      if (currentRect.width === 0 || currentRect.height === 0) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const currentCtxWidth = canvas.width / (window.devicePixelRatio || 1);
      const currentCtxHeight = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, currentCtxWidth, currentCtxHeight);

      snowflakesRef.current.forEach((flake, index) => {
        if (!flake.settled) {
          flake.y += flake.speed;
          flake.x += Math.sin(flake.y / (flake.size * 20)) * 0.3;

          // Check if snowflake hits the pile
          const pileIndex = Math.floor(flake.x / 2);
          const currentPileHeight = pileIndex >= 0 && pileIndex < snowPileRef.current.length 
            ? snowPileRef.current[pileIndex] 
            : 0;

          if (flake.y + flake.size >= currentCtxHeight - currentPileHeight) {
            // Snowflake has hit the pile or ground
            addToSnowPile(flake.x, flake.size, currentCtxWidth);
            // Create a new snowflake
            snowflakesRef.current[index] = createSnowflake(currentCtxWidth, currentCtxHeight);
          }
        }
        
        drawSnowflake(ctx, flake);
      });

      // Draw the snow pile
      drawSnowPile(ctx, currentCtxWidth, currentCtxHeight);

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [density, minSize, maxSize, minSpeed, maxSpeed, colors, shapes, createSnowflake, drawSnowflake, initializeSnowPile, addToSnowPile, drawSnowPile]);

  // Resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            if (width === 0 || height === 0) continue;
            
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
                // Reinitialize snow pile for new canvas width
                initializeSnowPile(width);
            }
        }
    });

    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, [initializeSnowPile]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 w-full h-full pointer-events-none -z-50 ${className}`}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -50,
        pointerEvents: 'none'
      }}
    />
  );
}
