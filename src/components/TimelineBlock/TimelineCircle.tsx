import { forwardRef, useEffect, useRef, useState } from 'react';
import styles from './TimelineBlock.module.scss';
import { gsap } from 'gsap';

interface Props {
  ranges: { title: string }[];
  activeIndex: number;
  onChange: (index: number) => void;
  circleRef?: React.Ref<SVGSVGElement>;
  rotation: number;
  numberRef: React.RefObject<SVGTextElement | null>;
  titleRef: React.RefObject<SVGForeignObjectElement | null>;
}

export const TimelineCircle = forwardRef<SVGSVGElement, Props>(
  ({ ranges, activeIndex, onChange, circleRef, rotation, numberRef, titleRef }, ref) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const hoverNumberRef = useRef<SVGTextElement | null>(null);

    const CIRCLE_SIZE = 530;
    const PADDING = 75;
    const SVG_SIZE = CIRCLE_SIZE + PADDING * 2;
    const CENTER = SVG_SIZE / 2;
    const RADIUS = CIRCLE_SIZE / 2;

    const TOTAL = ranges.length;
    const STEP = (2 * Math.PI) / TOTAL;
    const ANGLE_OFFSET = -Math.PI / 2 + STEP / 2;

    const activeAngle = STEP * activeIndex + ANGLE_OFFSET;
    const activeX = CENTER + RADIUS * Math.cos(activeAngle);
    const activeY = CENTER + RADIUS * Math.sin(activeAngle);

    const hoverX =
      hoverIndex !== null ? CENTER + RADIUS * Math.cos(STEP * hoverIndex + ANGLE_OFFSET) : 0;
    const hoverY =
      hoverIndex !== null ? CENTER + RADIUS * Math.sin(STEP * hoverIndex + ANGLE_OFFSET) : 0;

    useEffect(() => {
      if (!hoverNumberRef.current) return;

      gsap.fromTo(
        hoverNumberRef.current,
        { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }
      );
    }, [hoverIndex]);

    return (
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className={styles.circle}
        ref={circleRef || ref}
      >
        <g className="rotating">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} stroke="#42567A" fill="none" opacity={0.2} />

          {ranges.map((_, index) => {
            const angle = STEP * index + ANGLE_OFFSET;
            const x = CENTER + RADIUS * Math.cos(angle);
            const y = CENTER + RADIUS * Math.sin(angle);

            const isActive = index === activeIndex;
            const isHover = index === hoverIndex && index !== activeIndex;

            const targetR = isActive || isHover ? 28 : 3;
            const targetFill = isActive || isHover ? '#F4F5F9' : '#42567A';
            const targetStroke = isActive || isHover ? '#42567A' : 'none';

            const circleRef = useRef<SVGCircleElement | null>(null);

            useEffect(() => {
              if (!circleRef.current) return;
              gsap.to(circleRef.current, {
                r: targetR,
                fill: targetFill,
                stroke: targetStroke,
                duration: 0.25,
                ease: 'power2.out',
              });
            }, [targetR, targetFill, targetStroke]);

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={targetR}
                fill={targetFill}
                stroke={targetStroke}
                style={{ cursor: 'pointer' }}
                ref={circleRef}
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
            translate(${activeX} ${activeY})
            rotate(${-rotation})
            translate(${-activeX} ${-activeY})
          `}
        >
          <text
            ref={numberRef}
            x={activeX}
            y={activeY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={20}
            fill="#42567A"
          >
            {activeIndex + 1}
          </text>
        </g>

        {hoverIndex !== null && hoverIndex !== activeIndex && (
          <g
            pointerEvents="none"
            transform={`
              translate(${hoverX} ${hoverY})
              rotate(${-rotation})
              translate(${-hoverX} ${-hoverY})
            `}
          >
            <text
              ref={hoverNumberRef}
              x={hoverX}
              y={hoverY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={20}
              fill="#42567A"
            >
              {hoverIndex + 1}
            </text>
          </g>
        )}

        <g
          pointerEvents="none"
          transform={`
            translate(${activeX} ${activeY})
            rotate(${-rotation})
            translate(${-activeX} ${-activeY})
          `}
        >
          <foreignObject ref={titleRef} x={activeX + 36} y={activeY - 16} width={280} height={80}>
            <div className={styles.svgTitle}>{ranges[activeIndex].title}</div>
          </foreignObject>
        </g>
      </svg>
    );
  }
);

TimelineCircle.displayName = 'TimelineCircle';
