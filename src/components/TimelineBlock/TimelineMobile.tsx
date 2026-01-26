import { TimelineRange } from './timeline.types';
import { TimelineSlider } from './TimelineSlider';
import styles from './TimelineBlock.module.scss';
import { formatCounter } from '../../utils/formatCounter';
import { ArrowButton } from '../ui/ArrowButton/ArrowButton';

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
          {formatCounter(activeIndex + 1)}/{formatCounter(total)}
        </span>

        <div className={styles.arrowWrapper}>
          <ArrowButton onClick={onPrev} disabled={activeIndex === 0} size="mobile" />

          <ArrowButton
            onClick={onNext}
            disabled={activeIndex === total - 1}
            size="mobile"
            direction="right"
          />
        </div>
      </div>
    </div>
  );
};
