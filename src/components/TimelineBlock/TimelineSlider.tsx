import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useState, useRef, useCallback } from 'react';

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

  const isMobile = useMediaQuery('(max-width: 1020px)');

  const handleSlideChange = useCallback((swiper: any) => {
    setCanPrev(!swiper.isBeginning);
    setCanNext(!swiper.isEnd);
  }, []);

  const goPrev = () => swiperRef.current?.slidePrev();
  const goNext = () => swiperRef.current?.slideNext();

  return (
    <div className={styles.sliderWrapper}>
      {!isMobile && canPrev && (
        <button className={`${styles.sliderArrow} ${styles.left}`} onClick={goPrev}>
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path
              d="M0.707093 0.707092L5.70709 5.70709L0.707093 10.7071"
              stroke="#3877EE"
              strokeWidth="2"
            />
          </svg>
        </button>
      )}

      {!isMobile && canNext && (
        <button className={`${styles.sliderArrow} ${styles.right}`} onClick={goNext}>
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
        pagination={isMobile ? { clickable: true } : false}
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
            <div className={styles.slideInner}>
              <p className={styles.yearColor}>{event.year}</p>
              <p className={styles.slideText}>{event.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
