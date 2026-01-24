import { useEffect, useRef, useState } from 'react';
import { TimelineRange } from './timeline.types';
import { gsap } from 'gsap';
import styles from './TimelineBlock.module.scss';
import { TimelineDesktop } from './TimelineDesktop';
import { TimelineMobile } from './TimelineMobile';

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

      <div className={styles.desktopOnly}>
        <TimelineDesktop
          ranges={ranges}
          activeIndex={activeIndex}
          total={total}
          activeRange={activeRange}
          onPrev={prev}
          onNext={next}
          onDotClick={handleDotClick}
          rotation={rotationRef.current}
          circleRef={circleRef}
          numberRef={numberRef}
          titleRef={titleRef}
          fromRef={fromRef}
          toRef={toRef}
        />
      </div>

      <div className={styles.mobileOnly}>
        <TimelineMobile
          activeIndex={activeIndex}
          total={total}
          activeRange={activeRange}
          onPrev={prev}
          onNext={next}
        />
      </div>
    </section>
  );
};
