import { useEffect, useRef, useState } from 'react';
import { TimelineRange } from './timeline.types';
import { TimelineCircle } from './TimelineCircle';
import { TimelineSlider } from './TimelineSlider';
import { gsap } from 'gsap';
import styles from './TimelineBlock.module.scss';
import clsx from 'clsx';

const INITIAL_ROTATION = 0;

type Direction = 'forward' | 'backward';

type Props = {
  ranges: TimelineRange[];
};

export const TimelineBlock = ({ ranges }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRange = ranges[activeIndex];

  const circleRef = useRef<SVGSVGElement>(null);
  const rotationRef = useRef(INITIAL_ROTATION);
  const directionRef = useRef<Direction>('forward');
  const isAnimatingRef = useRef(false);

  const numberRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);

  const total = ranges.length;
  const step = 360 / total;

  const animateGuard = (fn: () => void) => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    fn();

    gsap.delayedCall(0.85, () => {
      isAnimatingRef.current = false;
    });
  };

  const prev = () =>
    animateGuard(() => {
      if (activeIndex === 0) return;
      directionRef.current = 'backward';
      rotationRef.current += step;
      setActiveIndex((i) => i - 1);
    });

  const next = () =>
    animateGuard(() => {
      if (activeIndex === total - 1) return;
      directionRef.current = 'forward';
      rotationRef.current -= step;
      setActiveIndex((i) => i + 1);
    });

  const handleDotClick = (index: number) =>
    animateGuard(() => {
      if (index === activeIndex) return;

      const diffForward = (index - activeIndex + total) % total;
      const diffBackward = (activeIndex - index + total) % total;

      if (diffForward <= diffBackward) {
        directionRef.current = 'forward';
        rotationRef.current -= diffForward * step;
      } else {
        directionRef.current = 'backward';
        rotationRef.current += diffBackward * step;
      }

      setActiveIndex(index);
    });

  useEffect(() => {
    if (!circleRef.current) return;

    gsap.to(circleRef.current, {
      rotation: rotationRef.current,
      duration: 0.8,
      ease: 'power3.inOut',
      transformOrigin: '50% 50%',
      overwrite: 'auto',
    });

    if (fromRef.current && toRef.current) {
      gsap.to([fromRef.current, toRef.current], {
        scale: 1.03,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (!fromRef.current || !toRef.current) return;

    const prevIndex =
      directionRef.current === 'forward'
        ? Math.max(activeIndex - 1, 0)
        : Math.min(activeIndex + 1, total - 1);

    const prevRange = ranges[prevIndex];
    const dir = directionRef.current === 'forward' ? 1 : -1;

    gsap.fromTo(
      fromRef.current,
      { innerText: prevRange.from },
      {
        innerText: activeRange.from,
        duration: 0.8,
        ease: 'power2.out',
        snap: { innerText: 1 },
      }
    );

    gsap.fromTo(
      toRef.current,
      {
        innerText: prevRange.to,
        y: 20 * dir,
        opacity: 0,
      },
      {
        innerText: activeRange.to,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        snap: { innerText: 1 },
      }
    );
  }, [activeIndex, activeRange, ranges, total]);

  useEffect(() => {
    if (!numberRef.current || !titleRef.current) return;

    gsap.fromTo(
      [numberRef.current, titleRef.current],
      { opacity: 0, y: -6 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        delay: 0.6,
      }
    );
  }, [activeIndex]);

  return (
    <section className={styles.timeline}>
      <h2 className={styles.title}>Исторические даты</h2>

      <div className={styles.circleWrapper}>
        <div className={styles.circleClip}>
          <TimelineCircle
            ranges={ranges}
            activeIndex={activeIndex}
            onChange={handleDotClick}
            circleRef={circleRef}
            rotation={rotationRef.current}
            numberRef={numberRef}
            titleRef={titleRef}
          />
        </div>

        <div className={styles.years}>
          <span ref={fromRef} className={styles.from} />
          <span ref={toRef} className={styles.to} />
        </div>
      </div>

      <div className={styles.sliderNav}>
        <span className={styles.counter}>
          {String(activeIndex + 1).padStart(2, '0')}/{total.toString().padStart(2, '0')}
        </span>

        <div className={styles.arrowWrapper}>
          <button onClick={prev} className={styles.arrow} disabled={activeIndex === 0}>
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path
                d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071"
                stroke="#42567A"
                strokeWidth="2"
              />
            </svg>
          </button>

          <button
            onClick={next}
            className={clsx(styles.arrow, styles.right)}
            disabled={activeIndex === total - 1}
          >
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path
                d="M1.33582 0.707108L7.58581 6.95711L1.33582 13.2071"
                stroke="#42567A"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>

      <TimelineSlider events={activeRange.events} />
    </section>
  );
};
