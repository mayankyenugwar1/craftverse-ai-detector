import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, duration = 1500, suffix = '', className = '' }) => {
  const [current, setCurrent] = useState(0);
  const animRef = useRef<number | null>(null);
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [target, duration]);

  return <span className={className}>{current}{suffix}</span>;
};
