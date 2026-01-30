import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface TimelineDotProps {
  x: number;
  y: number;
  isActive: boolean;
  isHover: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const TimelineDot = ({
  x,
  y,
  isActive,
  isHover,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: TimelineDotProps) => {
  const ref = useRef<SVGCircleElement | null>(null);

  const targetR = isActive || isHover ? 28 : 3;
  const targetFill = isActive || isHover ? '#F4F5F9' : '#42567A';
  const targetStroke = isActive || isHover ? '#42567A' : 'none';

  useEffect(() => {
    if (!ref.current) return;

    const tween = gsap.to(ref.current, {
      r: targetR,
      fill: targetFill,
      stroke: targetStroke,
      duration: 0.25,
      ease: 'power2.out',
    });

    return () => {
      tween.kill();
    };
  }, [targetR, targetFill, targetStroke]);

  return (
    <circle
      ref={ref}
      cx={x}
      cy={y}
      r={targetR}
      fill={targetFill}
      stroke={targetStroke}
      style={{ cursor: 'pointer' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    />
  );
};
