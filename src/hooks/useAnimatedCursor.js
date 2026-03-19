import { useEffect, useRef } from 'react';

export const useAnimatedCursor = () => {
  const cursorRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.id = 'animated-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 12px;
      height: 12px;
      background-color: #00ff87;
      border-radius: 50%;
      pointer-events: none;
      z-index: 999;
      box-shadow: 0 0 12px #00ff87, 0 0 24px rgba(0, 255, 135, 0.6);
      top: -999px;
      left: -999px;
    `;
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animateCursor = () => {
      // Smooth lag effect with easing
      const dx = mousePos.current.x - cursorPos.current.x;
      const dy = mousePos.current.y - cursorPos.current.y;

      cursorPos.current.x += dx * 0.2; // 20% interpolation = smooth lag
      cursorPos.current.y += dy * 0.2;

      if (cursorRef.current) {
        cursorRef.current.style.left = cursorPos.current.x - 6 + 'px';
        cursorRef.current.style.top = cursorPos.current.y - 6 + 'px';
      }

      requestAnimationFrame(animateCursor);
    };

    const rafId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      if (cursorRef.current) {
        cursorRef.current.remove();
      }
    };
  }, []);
};
