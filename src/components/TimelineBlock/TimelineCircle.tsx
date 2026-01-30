import { useEffect, useRef, useState } from 'react';
import styles from './TimelineBlock.module.scss';
import { gsap } from 'gsap';
import { TimelineDot } from './TimelineDot';

interface Props {
  ranges: { title: string }[];
  activeIndex: number;
  onChange: (index: number) => void;
  circleRef?: React.Ref<SVGSVGElement | null>;
  rotation: number;
  numberRef: React.RefObject<SVGTextElement | null>;
  titleRef: React.RefObject<SVGForeignObjectElement | null>;
}

export const TimelineCircle = ({
  ranges,
  activeIndex,
  onChange,
  circleRef,
  rotation,
  numberRef,
  titleRef,
}: Props) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const hoverNumberRef = useRef<SVGTextElement | null>(null);

  if (!ranges.length) return null;

  const CIRCLE_SIZE = 530;
  const PADDING = 75;
  const SVG_SIZE = CIRCLE_SIZE + PADDING * 2;
  const CENTER = SVG_SIZE / 2;
  const RADIUS = CIRCLE_SIZE / 2;

  const STEP = (2 * Math.PI) / ranges.length;
  const ANGLE_OFFSET = -Math.PI / 2 + STEP / 2;

  const getPoint = (index: number) => {
    const angle = STEP * index + ANGLE_OFFSET;
    return {
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    };
  };

  const active = getPoint(activeIndex);
  const hover = hoverIndex !== null ? getPoint(hoverIndex) : null;

  useEffect(() => {
    if (!hoverNumberRef.current) return;

    const tween = gsap.fromTo(
      hoverNumberRef.current,
      { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' },
      { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }
    );

    return () => {
      tween.kill();
    };
  }, [hoverIndex]);

  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      className={styles.circle}
      ref={circleRef}
    >
      <g className="rotating">
        <circle cx={CENTER} cy={CENTER} r={RADIUS} stroke="#42567A" fill="none" opacity={0.2} />

        {ranges.map((_, index) => {
          const { x, y } = getPoint(index);

          return (
            <TimelineDot
              key={index}
              x={x}
              y={y}
              isActive={index === activeIndex}
              isHover={index === hoverIndex && index !== activeIndex}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => {
                setHoverIndex(null);
                onChange(index);
              }}
            />
          );
        })}
      </g>

      <g
        pointerEvents="none"
        transform={`
            translate(${active.x} ${active.y})
            rotate(${-rotation})
            translate(${-active.x} ${-active.y})
          `}
      >
        <text
          ref={numberRef}
          x={active.x}
          y={active.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={20}
          fill="var(--color-text)"
        >
          {activeIndex + 1}
        </text>
      </g>

      {hover && hoverIndex !== null && hoverIndex !== activeIndex && (
        <g
          pointerEvents="none"
          transform={`
              translate(${hover.x} ${hover.y})
              rotate(${-rotation})
              translate(${-hover.x} ${-hover.y})
            `}
        >
          <text
            ref={hoverNumberRef}
            x={hover.x}
            y={hover.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={20}
            fill="var(--color-text)"
          >
            {hoverIndex + 1}
          </text>
        </g>
      )}

      <g
        pointerEvents="none"
        transform={`
            translate(${active.x} ${active.y})
            rotate(${-rotation})
            translate(${-active.x} ${-active.y})
          `}
      >
        <foreignObject ref={titleRef} x={active.x + 36} y={active.y - 16} width={280} height={80}>
          <div className={styles.svgTitle}>{ranges[activeIndex].title}</div>
        </foreignObject>
      </g>
    </svg>
  );
};
