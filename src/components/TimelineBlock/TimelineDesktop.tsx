import { TimelineRange } from './timeline.types';
import { TimelineCircle } from './TimelineCircle';
import { TimelineSlider } from './TimelineSlider';
import styles from './TimelineBlock.module.scss';
import clsx from 'clsx';

type Props = {
  ranges: TimelineRange[];
  activeIndex: number;
  total: number;
  activeRange: TimelineRange;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (i: number) => void;
  circleRef: React.Ref<SVGSVGElement>;
  numberRef: React.RefObject<HTMLDivElement | null>;
  titleRef: React.RefObject<HTMLDivElement | null>;
  fromRef: React.RefObject<HTMLSpanElement | null>;
  toRef: React.RefObject<HTMLSpanElement | null>;
  rotation: number;
};

export const TimelineDesktop = ({
  ranges,
  activeIndex,
  total,
  activeRange,
  onPrev,
  onNext,
  onDotClick,
  circleRef,
  numberRef,
  titleRef,
  fromRef,
  toRef,
  rotation,
}: Props) => {
  return (
    <>
      <div className={styles.circleWrapper}>
        <div className={styles.circleClip}>
          <TimelineCircle
            ranges={ranges}
            activeIndex={activeIndex}
            onChange={onDotClick}
            circleRef={circleRef}
            numberRef={numberRef}
            titleRef={titleRef}
            rotation={rotation}
          />
        </div>

        <div className={styles.years}>
          <span ref={fromRef} className={styles.from} />
          <span ref={toRef} className={styles.to} />
        </div>
      </div>

      <div className={styles.sliderNav}>
        <span className={styles.counter}>
          {String(activeIndex + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>

        <div className={styles.arrowWrapper}>
          <button onClick={onPrev} className={styles.arrow} disabled={activeIndex === 0}>
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path
                d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071"
                stroke="#42567A"
                strokeWidth="2"
              />
            </svg>
          </button>

          <button
            onClick={onNext}
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
    </>
  );
};
