import React, { ReactNode, useEffect, useRef } from 'react';

export interface SimpleScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}

export const SimpleScrollStackItem: React.FC<SimpleScrollStackItemProps> = ({ children, itemClassName = '', style }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()} style={style}>
    {children}
  </div>
);

interface SimpleScrollStackProps {
  children: ReactNode;
  className?: string;
}

const SimpleScrollStack: React.FC<SimpleScrollStackProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          updateCards();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateCards = () => {
      if (!containerRef.current) return;

      const cards = containerRef.current.querySelectorAll<HTMLElement>('.scroll-stack-card');
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const stickyTop = windowHeight * 0.15;
      const totalCards = cards.length;
      const cardSpacing = windowHeight * 0.8;

      // Calculate container position
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top + scrollTop;

      cards.forEach((card, index) => {
        // Get card's actual top position in the document
        let cardScrollPosition = containerTop;
        for (let i = 0; i < index; i++) {
          const prevCard = cards[i] as HTMLElement;
          cardScrollPosition += parseFloat(window.getComputedStyle(prevCard).marginBottom) || (windowHeight * 0.8);
        }

        // Calculate scroll trigger points
        const appearStart = cardScrollPosition - windowHeight;
        const appearEnd = cardScrollPosition - stickyTop;
        const activeStart = appearEnd;
        const activeEnd = appearStart + cardSpacing * (totalCards - index + 1);
        const fadeStart = activeEnd;
        const fadeEnd = fadeStart + windowHeight * 0.6;

        // Calculate progress values
        const appearProgress = appearEnd > appearStart 
          ? Math.max(0, Math.min(1, (scrollTop - appearStart) / (appearEnd - appearStart)))
          : 1;
        const fadeProgress = fadeEnd > fadeStart
          ? Math.max(0, Math.min(1, (scrollTop - fadeStart) / (fadeEnd - fadeStart)))
          : 0;

        // Determine which state the card should be in
        if (scrollTop < appearStart) {
          // Before card appears
          card.style.opacity = '0';
          card.style.transform = 'translate3d(0, 0, 0) scale(0.88)';
          card.style.filter = 'blur(12px)';
          card.style.pointerEvents = 'none';
          card.style.zIndex = `${100 + index}`;
        } else if (scrollTop >= appearStart && scrollTop < appearEnd) {
          // Card is appearing and moving into view
          const opacity = 0.3 + appearProgress * 0.7;
          const scale = 0.88 + appearProgress * 0.12;
          const blur = 12 - appearProgress * 12;

          card.style.opacity = `${opacity}`;
          card.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
          card.style.filter = `blur(${blur}px)`;
          card.style.pointerEvents = 'none';
          card.style.zIndex = `${3000 + index}`;
        } else if (scrollTop >= activeStart && scrollTop < fadeStart) {
          // Card is active and fully visible
          card.style.opacity = '1';
          card.style.transform = 'translate3d(0, 0, 0) scale(1)';
          card.style.filter = 'blur(0px)';
          card.style.pointerEvents = 'auto';
          card.style.zIndex = `${3000 + index}`;
        } else if (scrollTop >= fadeStart && scrollTop < fadeEnd) {
          // Card is fading out as next card comes in
          const scale = 1 - fadeProgress * 0.12;
          const opacity = 1 - fadeProgress * 0.8;
          const blur = fadeProgress * 8;

          card.style.opacity = `${opacity}`;
          card.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
          card.style.filter = `blur(${blur}px)`;
          card.style.pointerEvents = 'none';
          card.style.zIndex = `${3000 + index}`;
        } else {
          // Card has scrolled past completely
          card.style.opacity = '0';
          card.style.transform = 'translate3d(0, 0, 0) scale(0.8)';
          card.style.filter = 'blur(10px)';
          card.style.pointerEvents = 'none';
          card.style.zIndex = `${50 + index}`;
        }
      });
    };

    // Initial setup with optimizations
    const cards = containerRef.current?.querySelectorAll<HTMLElement>('.scroll-stack-card');
    cards?.forEach((card) => {
      card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      card.style.position = 'sticky';
      card.style.top = '15vh';
      card.style.willChange = 'transform, opacity, filter';
      card.style.backfaceVisibility = 'hidden';
      card.style.webkitBackfaceVisibility = 'hidden';
    });

    updateCards();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
    </div>
  );
};

export default SimpleScrollStack;
