import { TimelineRange } from './timeline.types';
import { TimelineSlider } from './TimelineSlider';
import styles from './TimelineBlock.module.scss';
import clsx from 'clsx';

type Props = {
  activeIndex: number;
  total: number;
  activeRange: TimelineRange;
  onPrev: () => void;
  onNext: () => void;
};

export const TimelineMobile = ({ activeIndex, total, activeRange, onPrev, onNext }: Props) => {
  return (
    <div className={`${styles.mobileWrapper} ${styles.mobileOnly}`}>
      <div className={styles.yearsMobile}>
        <span className={styles.from}>{activeRange.from}</span>
        <span className={styles.to}>{activeRange.to}</span>
      </div>

      <TimelineSlider events={activeRange.events} />

      <div className={styles.mobileNav}>
        <span className={styles.counter}>
          {String(activeIndex + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>

        <div className={styles.arrowWrapper}>
          <button onClick={onPrev} className={styles.arrow} disabled={activeIndex === 0}>
            <svg
              width="6"
              height="8"
              viewBox="0 0 6 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.53918 0.707093L1.41418 3.83209L4.53918 6.95709"
                stroke="#42567A"
                stroke-width="2"
              />
            </svg>
          </button>

          <button
            onClick={onNext}
            className={clsx(styles.arrow, styles.right)}
            disabled={activeIndex === total - 1}
          >
            <svg
              width="6"
              height="8"
              viewBox="0 0 6 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.53918 0.707093L1.41418 3.83209L4.53918 6.95709"
                stroke="#42567A"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
