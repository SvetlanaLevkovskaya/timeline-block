import { TimelineRange } from './timeline.types';
import { TimelineCircle } from './TimelineCircle';
import { TimelineSlider } from './TimelineSlider';
import styles from './TimelineBlock.module.scss';
import { formatCounter } from '../../utils/formatCounter';
import { ArrowButton } from '../ui/ArrowButton/ArrowButton';

type Props = {
  ranges: TimelineRange[];
  activeIndex: number;
  total: number;
  activeRange: TimelineRange;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (i: number) => void;
  circleRef: React.Ref<SVGSVGElement>;
  numberRef: React.RefObject<SVGTextElement | null>;
  titleRef: React.RefObject<SVGForeignObjectElement | null>;
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
          {formatCounter(activeIndex + 1)}/{formatCounter(total)}
        </span>

        <div className={styles.arrowWrapper}>
          <ArrowButton ariaLabel="Previous slide" onClick={onPrev} disabled={activeIndex === 0} />

          <ArrowButton
            ariaLabel="Next slide"
            onClick={onNext}
            disabled={activeIndex === total - 1}
            direction="right"
          />
        </div>
      </div>

      <TimelineSlider events={activeRange.events} />
    </>
  );
};
