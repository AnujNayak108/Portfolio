'use client';
import { useState, useEffect, useRef } from 'react';

// Mock constants for demo
const OWNER_NAME = "Anuj Nayak";
const OWNER_TITLE = "Mathematics Explorer";

const TITLES_TO_CYCLE = [
  OWNER_TITLE,
  " AI/ML Enthusiast ",
  " Creative Problem Solver ",
  " Full-Stack Developer ",
];

export function HeroSection() {
  const [typedOwnerTitle, setTypedOwnerTitle] = useState('');
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isTypingTitle, setIsTypingTitle] = useState(true);
  
  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const isTypingInProgressRef = useRef(false); // Prevent overlapping animations

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Prevent multiple animations from running
    if (!isMountedRef.current || isTypingInProgressRef.current) {
      return;
    }

    const currentTargetTitle = TITLES_TO_CYCLE[currentTitleIndex];

    const startTyping = () => {
      isTypingInProgressRef.current = true;
      setIsTypingTitle(true);
      charIndexRef.current = 0;
      setTypedOwnerTitle('');

      // Clear any existing intervals/timeouts
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }

      const intervalId = setInterval(() => {
        if (!isMountedRef.current) {
          clearInterval(intervalId);
          return;
        }

        if (charIndexRef.current < currentTargetTitle.length) {
          // Use substring for better performance and avoiding race conditions
          setTypedOwnerTitle(currentTargetTitle.substring(0, charIndexRef.current + 1));
          charIndexRef.current++;
        } else {
          // Typing complete
          clearInterval(intervalId);
          if (typingIntervalRef.current === intervalId) {
            typingIntervalRef.current = null;
          }
          
          if (isMountedRef.current) {
            setIsTypingTitle(false); // Hide cursor during pause
            
            // Set timeout for next title
            const timeoutId = setTimeout(() => {
              if (isMountedRef.current) {
                isTypingInProgressRef.current = false;
                setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % TITLES_TO_CYCLE.length);
              }
            }, 2000);
            
            pauseTimeoutRef.current = timeoutId;
          }
        }
      }, 75);

      typingIntervalRef.current = intervalId;
    };

    if (currentTargetTitle && isMountedRef.current) {
      startTyping();
    }

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      isTypingInProgressRef.current = false;
    };
  }, [currentTitleIndex]);

  return (
    <section id="hero" className="w-full section-padding">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          <span className="block py-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent bg-[length:200%_auto] animate-shimmer animate-floatSlight">
            {OWNER_NAME}
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-12 min-h-[3.5rem] sm:min-h-[3rem] break-words">
          {typedOwnerTitle}
          {isTypingTitle && <span className="ml-1 animate-pulse">|</span>}
        </p>
        <div className="flex justify-center items-center gap-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            View Resume
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}