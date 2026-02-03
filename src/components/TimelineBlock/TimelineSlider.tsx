import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styles from './TimelineBlock.module.scss';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface Event {
  year: number;
  description: string;
}

interface Props {
  events: Event[];
}

export const TimelineSlider = ({ events }: Props) => {
  const swiperRef = useRef<any>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const isTablet = useMediaQuery('(max-width: 1020px)');

  const handleSlideChange = useCallback((swiper: any) => {
    setCanPrev(!swiper.isBeginning);
    setCanNext(!swiper.isEnd);
  }, []);

  const goPrev = () => swiperRef.current?.slidePrev();
  const goNext = () => swiperRef.current?.slideNext();

  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!slideRefs.current.length) return;

    if (isTablet) {
      slideRefs.current.forEach((el) => {
        if (el) el.style.opacity = '';
      });
      return;
    }

    gsap.killTweensOf(slideRefs.current);

    const tween = gsap.to(slideRefs.current, {
      opacity: 0,
      duration: 0.25,
      stagger: 0.05,
      onComplete: () => {
        gsap.fromTo(
          slideRefs.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
        );
      },
    });

    return () => {
      tween.kill();
    };
  }, [events, isTablet]);

  return (
    <div className={styles.sliderWrapper}>
      {!isTablet && canPrev && (
        <button
          aria-label="Previous slide"
          className={`${styles.sliderArrow} ${styles.left}`}
          onClick={goPrev}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path
              d="M0.707093 0.707092L5.70709 5.70709L0.707093 10.7071"
              stroke="#3877EE"
              strokeWidth="2"
            />
          </svg>
        </button>
      )}

      {!isTablet && canNext && (
        <button
          aria-label="Next slide"
          className={`${styles.sliderArrow} ${styles.right}`}
          onClick={goNext}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path
              d="M0.707093 0.707092L5.70709 5.70709L0.707093 10.7071"
              stroke="#3877EE"
              strokeWidth="2"
            />
          </svg>
        </button>
      )}

      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1.5}
        spaceBetween={24}
        pagination={isTablet ? { clickable: true } : false}
        breakpoints={{
          0: { slidesPerView: 1.5 },
          769: { slidesPerView: 3 },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          handleSlideChange(swiper);
        }}
        onSlideChange={(swiper) => handleSlideChange(swiper)}
        onResize={(swiper) => handleSlideChange(swiper)}
      >
        {events.map((event, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <div
              className={styles.slideInner}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
            >
              <p className={styles.yearColor}>{event.year}</p>
              <p className={styles.slideText}>{event.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
