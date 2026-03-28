import { useState, useLayoutEffect, useRef } from 'react';

export interface UseScrollZResult {
  currentZ: number;
  progress: number;
  addVelocity?: (v: number) => void;
  overrideZ?: (z: number) => void;
}

export const useScrollZ = (tunnelLength: number): UseScrollZResult => {
  const [currentZ, setCurrentZ] = useState(0);
  const [progress, setProgress] = useState(0);

  const targetZRef = useRef(0);
  const currentZRef = useRef(0);
  const rafRef = useRef<number>(0);
  const internalOverrideRef = useRef<boolean>(false);

  useLayoutEffect(() => {
    const handleScroll = () => {
      // If we are artificially flying, ignore mechanical scroll events
      if (internalOverrideRef.current) return;

      // Calculate max scroll height
      const scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      );
      const maxScrollY = scrollHeight - window.innerHeight;
      
      if (maxScrollY <= 0) {
        targetZRef.current = 0;
      } else {
        // Calculate scroll progress (0 to 1)
        const scrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScrollY));
        targetZRef.current = scrollProgress * tunnelLength;
      }
    };

    const loop = () => {
      // Basic lerp smoothing (10% closer to target each frame)
      const diff = targetZRef.current - currentZRef.current;
      currentZRef.current += diff * 0.1;
      
      // Update state if changed significantly
      if (Math.abs(diff) > 0.001) {
          setCurrentZ(currentZRef.current);
          
          let p = 0;
          if (tunnelLength > 0) {
            p = Math.max(0, Math.min(1, currentZRef.current / tunnelLength));
          }
          setProgress(p);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    // Attach listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tunnelLength]); 

  return { 
    currentZ, 
    progress,
    addVelocity: (v: number) => {
      internalOverrideRef.current = true;
      targetZRef.current += v;
      
      const scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight
      );
      const p = Math.max(0, Math.min(1, targetZRef.current / tunnelLength));
      window.scrollTo({ top: p * (scrollHeight - window.innerHeight), behavior: "instant" });
      
      if ((window as any)._scrollZTimeout) clearTimeout((window as any)._scrollZTimeout);
      (window as any)._scrollZTimeout = setTimeout(() => {
        internalOverrideRef.current = false;
      }, 50);
    },
    overrideZ: (z: number) => {
      internalOverrideRef.current = true;
      targetZRef.current = z;
      if ((window as any)._scrollZTimeout) clearTimeout((window as any)._scrollZTimeout);
      (window as any)._scrollZTimeout = setTimeout(() => {
        internalOverrideRef.current = false;
      }, 50);
    }
  };
};
