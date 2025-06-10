'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserCircle2 } from 'lucide-react';

const BOOT_BIO = `> Loading personality...
> Environment detected: Cold outside, code inside ❄️
> Core modules: Mathematics, Music, Midnight Creativity
> Side quests: Piano solos, Drum battles, Debugging life
> Background task: Lo-fi beats & deep thoughts running
> Error 404: Sleep not found
> Dependencies: Caffeine, Curiosity, Quiet nights

> Mission: Turn caffeine into code and chaos into creation
> Objective: Build cool things. Stay warm.
> System status: ✨ Running with rhythm and just a bit of jazz.`;

export function AboutSection() {
  const [typedBio, setTypedBio] = useState('');
  const [isTypingBio, setIsTypingBio] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  
  // Clean up function
  const cleanup = useCallback(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }, []);
  
  // Start typing animation
  const startTyping = useCallback(() => {
    // Prevent multiple instances
    if (hasStartedRef.current || typingIntervalRef.current) {
      return;
    }
    
    hasStartedRef.current = true;
    setIsTypingBio(true);
    charIndexRef.current = 0;
    setTypedBio('');
    
    const intervalId = setInterval(() => {
      if (charIndexRef.current < BOOT_BIO.length) {
        setTypedBio(BOOT_BIO.substring(0, charIndexRef.current + 1));
        charIndexRef.current++;
      } else {
        clearInterval(intervalId);
        if (typingIntervalRef.current === intervalId) {
          typingIntervalRef.current = null;
        }
        setIsTypingBio(false);
      }
    }, 30);
    
    typingIntervalRef.current = intervalId;
  }, []);
  
  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedRef.current) {
            setIsVisible(true);
            startTyping();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }
    
    return () => {
      cleanup();
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [startTyping, cleanup]);
  
  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return (
    <section id="about" ref={sectionRef} className="w-full py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 flex items-center justify-center">
          <UserCircle2 className="h-10 w-10 text-primary mr-3" />
          About Me
        </h2>
        <Card className="max-w-3xl mx-auto p-6 sm:p-8 shadow-xl bg-card/80 backdrop-blur-sm min-h-[200px]">
          <CardContent className="pt-6">
            <p className="text-lg text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
              <span>{typedBio}</span>
              {isTypingBio && <span className="animate-pulse ml-1 text-green-400">|</span>}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}