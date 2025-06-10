
'use client'; // Add 'use client' because we are using hooks like useState and useEffect

import { useState, useEffect }from 'react';
import type { CSSProperties } from 'react';

export default function Loading() {
  const [starStyles, setStarStyles] = useState<CSSProperties[]>([]);

  useEffect(() => {
    const generateStyles = () => {
      const styles: CSSProperties[] = [];
      for (let i = 0; i < 40; i++) {
        styles.push({
          width: `${Math.random() * 2 + 0.5}px`,
          height: `${Math.random() * 2 + 0.5}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `2s`
        });
      }
      setStarStyles(styles);
    };

    generateStyles();
  }, []); // Empty dependency array ensures this runs once on mount (client-side)

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground overflow-hidden">
      <div className="relative animate-rocketLaunchAnimate">
        <svg
          viewBox="0 0 100 250"
          xmlns="http://www.w3.org/2000/svg"
          className="w-24 h-60 md:w-28 md:h-72"
        >
          {/* Rocket Body parts */}
          <path
            d="M50 20 C 40 40, 40 80, 50 100 C 60 80, 60 40, 50 20 Z"
            fill="hsl(var(--primary))"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="0.5"
          />
          <path
            d="M50 95 C 45 110, 45 200, 50 220 C 55 200, 55 110, 50 95 Z"
            fill="hsl(var(--primary))"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="0.5"
          />
          {/* Nose cone */}
          <path
            d="M50 10 L40 25 C45 22, 55 22, 60 25 L50 10 Z"
            fill="hsl(var(--accent))"
            stroke="hsl(var(--accent-foreground))"
            strokeWidth="0.5"
          />
          {/* Window */}
          <circle cx="50" cy="60" r="7" fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth="1" />
          <circle cx="50" cy="60" r="4" fill="hsla(var(--accent-h), var(--accent-s), calc(var(--accent-l) + 20%), 0.5)" />

          {/* Fins */}
          <polygon points="50,215 35,235 40,220" fill="hsl(var(--secondary))" stroke="hsl(var(--accent))" strokeWidth="0.5"/>
          <polygon points="50,215 65,235 60,220" fill="hsl(var(--secondary))" stroke="hsl(var(--accent))" strokeWidth="0.5"/>

          <polygon points="42,180 28,205 32,185" fill="hsl(var(--secondary))" stroke="hsl(var(--accent))" strokeWidth="0.5" />
          <polygon points="58,180 72,205 68,185" fill="hsl(var(--secondary))" stroke="hsl(var(--accent))" strokeWidth="0.5" />

          {/* Flame */}
          <g className="origin-bottom animate-flameAnimate" style={{ transformOrigin: '50% 100%' }}>
            <polygon points="42,220 58,220 55,245 50,250 45,245" fill="hsl(var(--accent))" opacity="0.95"/>
            <polygon points="45,222 55,222 52,240 50,245 48,240" fill="hsl(var(--destructive), 0.8)" opacity="0.8"/>
             <polygon points="47,225 53,225 51,235 50,240 49,235" fill="hsl(var(--destructive), 0.5)" opacity="0.6"/>
          </g>
        </svg>
      </div>
      <p className="mt-8 text-xl font-medium text-primary animate-pulse">
        Launching into the Cosmos...
      </p>
      {/* Twinkling Stars */}
      {starStyles.map((style, i) => (
        <div
          key={`star-${i}`}
          className="absolute bg-slate-300 rounded-full animate-starTwinkleAnimate"
          style={style}
        />
      ))}
    </div>
  );
}
