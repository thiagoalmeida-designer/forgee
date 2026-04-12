import { useRef, ReactNode } from 'react';
import { motion, useInView } from 'motion/react';

interface AnimateOnScrollProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  className?: string;
  style?: React.CSSProperties;
  once?: boolean;
}

export function AnimateOnScroll({
  children,
  delay = 0,
  direction = 'up',
  className,
  style,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-80px' });

  const initialMap = {
    up: { opacity: 0, y: 40 },
    left: { opacity: 0, x: -40 },
    right: { opacity: 0, x: 40 },
    none: { opacity: 0 },
  };

  const animateMap = {
    up: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
    none: { opacity: 1 },
  };

  return (
    <motion.div
      ref={ref}
      initial={initialMap[direction]}
      animate={isInView ? animateMap[direction] : initialMap[direction]}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div style={{ width: '32px', height: '1px', backgroundColor: '#E02020' }} />
      <span
        style={{
          fontFamily: "'Nimbus Sans', sans-serif",
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '2.4px',
          color: '#E02020',
          textTransform: 'uppercase',
        }}
      >
        {children}
      </span>
    </div>
  );
}

export function DisplayHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        fontFamily: "'Nimbus Sans', sans-serif",
        fontWeight: 900,
        fontSize: 'clamp(48px, 7vw, 88px)',
        letterSpacing: '-2px',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        lineHeight: 0.92,
      }}
    >
      {children}
    </div>
  );
}
